package com.meta.wearable.dat.externalsampleapps.cameraaccess.twitch

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioDeviceInfo
import android.media.MediaPlayer
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.util.Log
import java.io.File
import java.util.Locale
import java.util.concurrent.atomic.AtomicLong

/**
 * Reads chat messages aloud.
 *
 * Routing-aware: when [setOutputDevice] is given a non-null device, every utterance is rendered
 * with `synthesizeToFile` and played through a MediaPlayer with `setPreferredDevice`, which is
 * the only reliable way to force TTS to a specific output (phone speaker vs glasses) on Android.
 * When no preferred device is set, falls back to plain `tts.speak()` and follows system routing.
 */
class ChatTTSManager(context: Context) {

    companion object {
        private const val TAG = "ChatTTSManager"
        private const val MAX_PENDING = 5
        private const val MAX_FILE_QUEUE = 8
    }

    var onSpeakingStarted: (() -> Unit)? = null
    var onSpeakingFinished: (() -> Unit)? = null

    private val appContext = context.applicationContext
    private var tts: TextToSpeech? = null
    private var isReady = false
    private val pendingQueue = mutableListOf<String>()

    @Volatile private var preferredOutputDevice: AudioDeviceInfo? = null

    private val cacheDir: File = File(appContext.cacheDir, "chat_tts").apply { mkdirs() }
    private val utteranceCounter = AtomicLong(0)

    /** IDs we synthesized but had to fall back to plain speak() — must fire start/finish from TTS callbacks. */
    private val fallbackIds = java.util.Collections.synchronizedSet(mutableSetOf<String>())

    // Pending audio files waiting for playback (when routed mode is active).
    private val playbackQueue = ArrayDeque<File>()
    private var currentPlayer: MediaPlayer? = null
    @Volatile private var isPlaybackActive = false

    init {
        // Best-effort cleanup of stale files from a previous run.
        try { cacheDir.listFiles()?.forEach { it.delete() } } catch (_: Exception) {}

        tts = TextToSpeech(appContext) { status ->
            if (status == TextToSpeech.SUCCESS) {
                val result = tts?.setLanguage(Locale.getDefault())
                if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                    tts?.setLanguage(Locale.ENGLISH)
                }
                tts?.setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .build()
                )
                tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                    override fun onStart(utteranceId: String?) {
                        // Plain mode OR fallback path → start fires here. In routed mode the
                        // MediaPlayer.onPrepared callback emits speaking-started instead.
                        val isFallback = utteranceId != null && fallbackIds.contains(utteranceId)
                        if (preferredOutputDevice == null || isFallback) onSpeakingStarted?.invoke()
                    }

                    override fun onDone(utteranceId: String?) {
                        if (utteranceId != null && fallbackIds.remove(utteranceId)) {
                            onSpeakingFinished?.invoke()
                            return
                        }
                        if (preferredOutputDevice == null) {
                            onSpeakingFinished?.invoke()
                        } else {
                            // Synthesis finished — file is on disk, queue it for routed playback.
                            val file = File(cacheDir, "$utteranceId.wav")
                            if (file.exists()) enqueueFile(file) else Log.w(TAG, "Synth done but file missing: $utteranceId")
                        }
                    }

                    @Deprecated("Deprecated in Java")
                    override fun onError(utteranceId: String?) {
                        if (utteranceId != null) fallbackIds.remove(utteranceId)
                        if (preferredOutputDevice == null) onSpeakingFinished?.invoke()
                    }
                })
                isReady = true
                val queued = pendingQueue.toList()
                pendingQueue.clear()
                queued.forEach { speakInternal(it) }
                Log.d(TAG, "TTS ready, language=${Locale.getDefault()}")
            } else {
                Log.e(TAG, "TTS init failed: $status")
            }
        }
    }

    /** Set or clear the preferred output device. Null = system default routing (plain speak). */
    fun setOutputDevice(device: AudioDeviceInfo?) {
        if (preferredOutputDevice?.id == device?.id) return
        preferredOutputDevice = device
        Log.d(TAG, "Output device → ${device?.productName ?: "system default"} (type=${device?.type ?: -1})")
        // Drop in-flight routed playback so the next utterance starts on the new device.
        if (device == null) {
            stopRoutedPlayback()
        }
    }

    private fun speakInternal(text: String) {
        val id = "chat_${utteranceCounter.incrementAndGet()}"
        val device = preferredOutputDevice
        if (device == null) {
            tts?.speak(text, TextToSpeech.QUEUE_ADD, null, id)
        } else {
            // Route via file → MediaPlayer.setPreferredDevice
            val outFile = File(cacheDir, "$id.wav")
            val params = Bundle()
            val res = tts?.synthesizeToFile(text, params, outFile, id)
            if (res != TextToSpeech.SUCCESS) {
                Log.w(TAG, "synthesizeToFile failed ($res), falling back to plain speak")
                fallbackIds.add(id)
                tts?.speak(text, TextToSpeech.QUEUE_ADD, null, id)
            }
        }
    }

    fun speakMessage(username: String, message: String) {
        val text = "$username: $message"
        if (!isReady) {
            if (pendingQueue.size < MAX_PENDING) pendingQueue.add(text)
            return
        }
        speakInternal(text)
    }

    fun stop() {
        tts?.stop()
        fallbackIds.clear()
        stopRoutedPlayback()
    }

    fun shutdown() {
        tts?.stop()
        tts?.shutdown()
        tts = null
        isReady = false
        pendingQueue.clear()
        fallbackIds.clear()
        stopRoutedPlayback()
        try { cacheDir.listFiles()?.forEach { it.delete() } } catch (_: Exception) {}
    }

    // --- Routed playback queue (used only when preferredOutputDevice != null) ---------------

    @Synchronized
    private fun enqueueFile(file: File) {
        if (playbackQueue.size >= MAX_FILE_QUEUE) {
            val dropped = playbackQueue.removeFirst()
            try { dropped.delete() } catch (_: Exception) {}
            Log.w(TAG, "Playback queue full, dropped oldest")
        }
        playbackQueue.addLast(file)
        if (!isPlaybackActive) playNext()
    }

    @Synchronized
    private fun playNext() {
        val file = playbackQueue.removeFirstOrNull()
        if (file == null) {
            isPlaybackActive = false
            onSpeakingFinished?.invoke()
            return
        }
        isPlaybackActive = true
        val device = preferredOutputDevice
        try {
            val mp = MediaPlayer().apply {
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                        .build()
                )
                setDataSource(file.absolutePath)
                setOnPreparedListener {
                    if (device != null) {
                        val ok = setPreferredDevice(device)
                        Log.d(TAG, "MediaPlayer.setPreferredDevice '${device.productName}': $ok")
                    }
                    onSpeakingStarted?.invoke()
                    start()
                }
                setOnCompletionListener {
                    try { release() } catch (_: Exception) {}
                    try { file.delete() } catch (_: Exception) {}
                    currentPlayer = null
                    playNext()
                }
                setOnErrorListener { _, what, extra ->
                    Log.w(TAG, "MediaPlayer error what=$what extra=$extra")
                    try { release() } catch (_: Exception) {}
                    try { file.delete() } catch (_: Exception) {}
                    currentPlayer = null
                    playNext()
                    true
                }
                prepareAsync()
            }
            currentPlayer = mp
        } catch (e: Exception) {
            Log.w(TAG, "Failed to play TTS file: ${e.message}")
            try { file.delete() } catch (_: Exception) {}
            currentPlayer = null
            playNext()
        }
    }

    @Synchronized
    private fun stopRoutedPlayback() {
        try { currentPlayer?.stop() } catch (_: Exception) {}
        try { currentPlayer?.release() } catch (_: Exception) {}
        currentPlayer = null
        playbackQueue.forEach { try { it.delete() } catch (_: Exception) {} }
        playbackQueue.clear()
        if (isPlaybackActive) {
            isPlaybackActive = false
            onSpeakingFinished?.invoke()
        }
    }
}
