package com.meta.wearable.dat.externalsampleapps.cameraaccess.skills

import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.util.concurrent.TimeUnit

object EpicureRepository {
    private const val TAG = "EpicureRepository"
    private const val MCP_BASE = "https://epicure-mcp.kaikaku.ai/mcp"

    enum class Status { IDLE, SCANNING, FETCHING, READY, ERROR }

    data class State(
        val status: Status = Status.IDLE,
        val ingredients: List<String> = emptyList(),
        val pairingRaw: String = "",
        val recipeText: String = "",
        val errorMessage: String? = null,
    )

    private val _state = MutableStateFlow(State())
    val state: StateFlow<State> = _state.asStateFlow()

    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private val client = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    var onMcpResult: ((String) -> Unit)? = null

    fun reset() {
        _state.value = State()
    }

    fun setScanning() {
        _state.update { it.copy(status = Status.SCANNING) }
    }

    fun updateRecipeText(text: String) {
        _state.update { it.copy(recipeText = text, status = Status.READY) }
    }

    fun processIngredients(ingredients: List<String>) {
        if (ingredients.isEmpty()) return
        _state.update { it.copy(status = Status.FETCHING, ingredients = ingredients) }
        scope.launch {
            try {
                val sessionId = initSession() ?: throw Exception("Failed to init MCP session")
                val result = callFindPairings(sessionId, ingredients)
                _state.update { it.copy(status = Status.READY, pairingRaw = result) }
                onMcpResult?.invoke(result)
            } catch (e: Exception) {
                Log.e(TAG, "MCP call failed: ${e.message}")
                _state.update { it.copy(status = Status.ERROR, errorMessage = e.message) }
            }
        }
    }

    private fun initSession(): String? {
        val initBody = """{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"VisionClaw","version":"1.0"}},"id":0}"""
        val initReq = Request.Builder()
            .url(MCP_BASE)
            .post(initBody.toRequestBody("application/json".toMediaType()))
            .addHeader("Accept", "application/json, text/event-stream")
            .build()

        val sessionId = client.newCall(initReq).execute().use { resp ->
            resp.header("mcp-session-id")
        } ?: return null

        val notifyBody = """{"jsonrpc":"2.0","method":"notifications/initialized","params":{}}"""
        val notifyReq = Request.Builder()
            .url(MCP_BASE)
            .post(notifyBody.toRequestBody("application/json".toMediaType()))
            .addHeader("mcp-session-id", sessionId)
            .build()
        client.newCall(notifyReq).execute().use { /* discard */ }

        Log.d(TAG, "MCP session initialized: $sessionId")
        return sessionId
    }

    private fun callFindPairings(sessionId: String, ingredients: List<String>): String {
        val ingJson = ingredients.joinToString(",") { "\"$it\"" }
        val body = """{"jsonrpc":"2.0","method":"tools/call","params":{"name":"find_pairings","arguments":{"ingredients":[$ingJson]}},"id":1}"""
        val request = Request.Builder()
            .url(MCP_BASE)
            .post(body.toRequestBody("application/json".toMediaType()))
            .addHeader("mcp-session-id", sessionId)
            .addHeader("Accept", "application/json, text/event-stream")
            .build()

        val raw = client.newCall(request).execute().use { resp ->
            resp.body?.string() ?: ""
        }
        Log.d(TAG, "MCP find_pairings raw response (${raw.length} chars): ${raw.take(200)}")
        return extractContentText(raw)
    }

    private fun extractContentText(raw: String): String {
        // Try SSE format: lines starting with "data:"
        val dataLines = raw.lines()
            .filter { it.startsWith("data:") }
            .map { it.removePrefix("data:").trim() }
            .filter { it.isNotBlank() }

        for (line in dataLines) {
            val text = parseJsonrpcContent(line)
            if (text != null) return text
        }

        // Try raw JSON
        val text = parseJsonrpcContent(raw.trim())
        if (text != null) return text

        // Fallback: return raw trimmed
        return raw.take(2000)
    }

    private fun parseJsonrpcContent(jsonStr: String): String? {
        return try {
            val json = JSONObject(jsonStr)
            val result = json.optJSONObject("result") ?: return null
            val content = result.optJSONArray("content") ?: return null
            if (content.length() == 0) return null
            content.getJSONObject(0).optString("text", null)
        } catch (_: Exception) {
            null
        }
    }
}
