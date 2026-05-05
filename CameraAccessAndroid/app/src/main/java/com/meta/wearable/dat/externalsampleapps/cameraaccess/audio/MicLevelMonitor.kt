package com.meta.wearable.dat.externalsampleapps.cameraaccess.audio

import android.annotation.SuppressLint
import android.content.Context
import android.media.AudioDeviceInfo
import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioRecord
import android.media.MediaRecorder
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.NonCancellable
import kotlinx.coroutines.cancelAndJoin
import kotlinx.coroutines.withContext
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlin.math.sqrt

/**
 * Monitors RMS level of a chosen mic for the level meter UI.
 *
 * For Bluetooth devices (glasses, BT headsets) `AudioRecord.setPreferredDevice` alone
 * does NOT route audio — the system also needs MODE_IN_COMMUNICATION + setCommunicationDevice
 * (and startBluetoothSco for SCO links). Without that, BT mics return silence and the meter
 * stays at 0. This monitor mirrors the Gemini AudioManager BT setup so the UI shows real levels
 * for any device the user picks.
 */
class MicLevelMonitor {

    private val _level = MutableStateFlow(0f)
    val level: StateFlow<Float> = _level.asStateFlow()

    private var job: Job? = null

    @SuppressLint("MissingPermission")
    fun start(scope: CoroutineScope, context: Context? = null, preferredDevice: AudioDeviceInfo? = null) {
        if (job?.isActive == true) return
        job = scope.launch(Dispatchers.IO) {
            val sampleRate = 16000
            val minBuf = AudioRecord.getMinBufferSize(
                sampleRate,
                AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT,
            ).coerceAtLeast(2048)

            val isBtSco = preferredDevice != null && preferredDevice.type in BT_SCO_TYPES
            val isAnyBt = preferredDevice != null && preferredDevice.type in BT_ALL_TYPES

            // ---- BT routing setup (mirrors gemini.AudioManager) ------------------------------
            var sysAm: AudioManager? = null
            var commDeviceSet = false
            var scoStarted = false
            var modeChanged = false
            if (context != null && preferredDevice != null) {
                val am = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
                sysAm = am
                if (isAnyBt) {
                    am.mode = AudioManager.MODE_IN_COMMUNICATION
                    modeChanged = true
                }
                if (isBtSco) {
                    @Suppress("DEPRECATION") am.startBluetoothSco()
                    @Suppress("DEPRECATION") am.isBluetoothScoOn = true
                    scoStarted = true
                    val deadline = System.currentTimeMillis() + 2000
                    @Suppress("DEPRECATION")
                    while (!am.isBluetoothScoOn && System.currentTimeMillis() < deadline) {
                        Thread.sleep(100)
                    }
                }
                commDeviceSet = am.setCommunicationDevice(preferredDevice)
                Log.d(TAG, "setCommunicationDevice '${preferredDevice.productName}' (type=${preferredDevice.type}): $commDeviceSet")
            }
            // ---------------------------------------------------------------------------------

            val audioSource = when {
                isAnyBt -> MediaRecorder.AudioSource.VOICE_COMMUNICATION
                preferredDevice != null -> MediaRecorder.AudioSource.MIC
                else -> MediaRecorder.AudioSource.VOICE_RECOGNITION
            }

            val ar = try {
                AudioRecord(
                    audioSource,
                    sampleRate,
                    AudioFormat.CHANNEL_IN_MONO,
                    AudioFormat.ENCODING_PCM_16BIT,
                    minBuf,
                )
            } catch (e: Exception) {
                Log.w(TAG, "AudioRecord create failed: ${e.message}")
                cleanupRouting(sysAm, commDeviceSet, scoStarted, modeChanged)
                return@launch
            }

            if (ar.state != AudioRecord.STATE_INITIALIZED) {
                Log.w(TAG, "AudioRecord not initialized")
                ar.release()
                cleanupRouting(sysAm, commDeviceSet, scoStarted, modeChanged)
                return@launch
            }

            if (preferredDevice != null) {
                val ok = ar.setPreferredDevice(preferredDevice)
                Log.d(TAG, "setPreferredDevice '${preferredDevice.productName}': $ok")
            }

            ar.startRecording()
            Log.d(TAG, "started (device=${preferredDevice?.productName ?: "default"}, source=$audioSource)")

            val buf = ShortArray(minBuf / 2)
            try {
                while (isActive) {
                    val read = ar.read(buf, 0, buf.size)
                    if (read > 0) {
                        var sum = 0.0
                        for (i in 0 until read) sum += buf[i].toDouble() * buf[i]
                        val rms = sqrt(sum / read)
                        val normalized = (rms / 8000.0).coerceIn(0.0, 1.0).toFloat()
                        _level.value = normalized
                    }
                }
            } finally {
                try { ar.stop(); ar.release() } catch (_: Exception) {}
                cleanupRouting(sysAm, commDeviceSet, scoStarted, modeChanged)
                _level.value = 0f
                Log.d(TAG, "stopped")
            }
        }
    }

    private fun cleanupRouting(
        am: AudioManager?,
        commDeviceSet: Boolean,
        scoStarted: Boolean,
        modeChanged: Boolean,
    ) {
        if (am == null) return
        if (commDeviceSet) try { am.clearCommunicationDevice() } catch (_: Exception) {}
        if (scoStarted) try {
            @Suppress("DEPRECATION") am.stopBluetoothSco()
            @Suppress("DEPRECATION") am.isBluetoothScoOn = false
        } catch (_: Exception) {}
        if (modeChanged) try { am.mode = AudioManager.MODE_NORMAL } catch (_: Exception) {}
    }

    fun stop() {
        job?.cancel()
        job = null
    }

    /**
     * Cancels the recorder loop AND waits for the routing cleanup in `finally` to complete.
     * Must be called before another component (Twitch/Gemini) starts capture, otherwise the
     * deferred cleanup (`clearCommunicationDevice`, `stopBluetoothSco`, `mode=NORMAL`) would
     * run AFTER the new recorder set its own routing and undo it.
     */
    suspend fun stopAndJoin() {
        val j = job ?: return
        // Wait inside NonCancellable so even if our caller's coroutine gets cancelled mid-wait
        // the recorder's `finally` cleanup (routing/SCO/mode restore) still runs to completion
        // before this returns. CancellationException is rethrown afterwards.
        var cancelled: CancellationException? = null
        try {
            withContext(NonCancellable) { j.cancelAndJoin() }
        } catch (ce: CancellationException) {
            cancelled = ce
        } catch (_: Exception) {}
        job = null
        if (cancelled != null) throw cancelled
    }

    companion object {
        private const val TAG = "MicLevelMonitor"
        private val BT_SCO_TYPES = setOf(
            AudioDeviceInfo.TYPE_BLUETOOTH_SCO,
            AudioDeviceInfo.TYPE_BLUETOOTH_A2DP,
        )
        private val BT_ALL_TYPES = setOf(
            AudioDeviceInfo.TYPE_BLUETOOTH_SCO,
            AudioDeviceInfo.TYPE_BLUETOOTH_A2DP,
            AudioDeviceInfo.TYPE_BLE_HEADSET,
            AudioDeviceInfo.TYPE_BLE_SPEAKER,
            AudioDeviceInfo.TYPE_BLE_BROADCAST,
        )
    }
}
