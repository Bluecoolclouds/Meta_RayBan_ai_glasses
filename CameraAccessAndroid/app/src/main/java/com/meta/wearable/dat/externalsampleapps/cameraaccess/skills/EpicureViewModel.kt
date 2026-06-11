package com.meta.wearable.dat.externalsampleapps.cameraaccess.skills

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.launch

class EpicureViewModel : ViewModel() {

    val state: StateFlow<EpicureRepository.State> = EpicureRepository.state

    private val _timerSecondsLeft = MutableStateFlow(-1)
    val timerSecondsLeft: StateFlow<Int> = _timerSecondsLeft.asStateFlow()

    private var timerJob: Job? = null

    init {
        EpicureRepository.state
            .onEach { s ->
                if (s.status == EpicureRepository.Status.COOKING) {
                    val step = s.cookingSteps.getOrNull(s.currentStepIndex)
                    startStepTimer(step?.durationMinutes ?: 0)
                } else {
                    cancelTimer()
                }
            }
            .launchIn(viewModelScope)
    }

    fun advanceStep() {
        cancelTimer()
        val s = EpicureRepository.state.value
        EpicureRepository.advanceStep()
        val newState = EpicureRepository.state.value
        val step = newState.cookingSteps.getOrNull(newState.currentStepIndex)
        if (newState.status == EpicureRepository.Status.COOKING && step != null) {
            val total = newState.cookingSteps.size
            val stepNum = newState.currentStepIndex + 1
            val timerNote = if (step.durationMinutes > 0) " (таймер: ${step.durationMinutes} мин.)" else ""
            val msg = "[EPICURE_STEP_ADVANCE] Пользователь готов — переходим к шагу $stepNum из $total: " +
                "${step.phase.label} — ${step.instruction}$timerNote. Объяви этот шаг голосом, коротко и по делу."
            SkillManager.injectMessage?.invoke(msg)
            startStepTimer(step.durationMinutes)
        } else if (newState.status == EpicureRepository.Status.DONE) {
            SkillManager.injectMessage?.invoke(
                "[EPICURE_DONE] Все шаги выполнены! Поздравь пользователя — блюдо готово, скажи что-нибудь приятное!"
            )
        }
    }

    private fun startStepTimer(minutes: Int) {
        cancelTimer()
        if (minutes <= 0) {
            _timerSecondsLeft.value = -1
            return
        }
        _timerSecondsLeft.value = minutes * 60
        timerJob = viewModelScope.launch {
            while (_timerSecondsLeft.value > 0) {
                delay(1000L)
                _timerSecondsLeft.value -= 1
            }
            SkillManager.injectMessage?.invoke(
                "[EPICURE_TIMER_DONE] Таймер истёк! Сообщи пользователю голосом, что время вышло — пора переходить к следующему шагу."
            )
            EpicureRepository.advanceStep()
            val newState = EpicureRepository.state.value
            val next = newState.cookingSteps.getOrNull(newState.currentStepIndex)
            if (next != null) startStepTimer(next.durationMinutes)
        }
    }

    private fun cancelTimer() {
        timerJob?.cancel()
        timerJob = null
        _timerSecondsLeft.value = -1
    }

    override fun onCleared() {
        super.onCleared()
        cancelTimer()
    }
}
