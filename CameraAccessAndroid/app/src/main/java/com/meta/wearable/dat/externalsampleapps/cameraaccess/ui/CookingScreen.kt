package com.meta.wearable.dat.externalsampleapps.cameraaccess.ui

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.meta.wearable.dat.externalsampleapps.cameraaccess.skills.CookingPhase
import com.meta.wearable.dat.externalsampleapps.cameraaccess.skills.EpicureRepository
import com.meta.wearable.dat.externalsampleapps.cameraaccess.skills.EpicureViewModel

private val EpicureGold   = Color(0xFFD4A853)
private val EpicureGoldBg = Color(0xFF1E1708)
private val EpicureTeal   = Color(0xFF2ECFB1)
private val EpicureGreen  = Color(0xFF4CAF7D)

@Composable
private fun CookingSectionLabel(text: String) {
    Text(
        text = text,
        color = AppColor.SubtleText,
        fontSize = 11.sp,
        fontWeight = FontWeight.SemiBold,
        modifier = androidx.compose.ui.Modifier.padding(start = 4.dp, bottom = 2.dp),
    )
}

@Composable
fun CookingScreen(
    onBack: () -> Unit,
    onScanClick: () -> Unit,
    modifier: Modifier = Modifier,
    epicureViewModel: EpicureViewModel = viewModel(),
) {
    val state by epicureViewModel.state.collectAsStateWithLifecycle()
    val timerSecondsLeft by epicureViewModel.timerSecondsLeft.collectAsStateWithLifecycle()

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(AppColor.SurfaceBlack),
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .systemBarsPadding()
                .navigationBarsPadding(),
        ) {
            // ── Header ────────────────────────────────────────────────────
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(onClick = onBack) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back",
                        tint = Color.White,
                        modifier = Modifier.size(24.dp),
                    )
                }
                Spacer(modifier = Modifier.weight(1f))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.AutoAwesome,
                        contentDescription = null,
                        tint = EpicureGold,
                        modifier = Modifier.size(18.dp),
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Готовка",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                    )
                }
                Spacer(modifier = Modifier.weight(1f))
                Spacer(modifier = Modifier.size(48.dp))
            }

            // ── Content ───────────────────────────────────────────────────
            AnimatedContent(
                targetState = state.status,
                transitionSpec = {
                    fadeIn(tween(300)) togetherWith fadeOut(tween(200))
                },
                label = "cooking_state",
            ) { status ->
                when (status) {
                    EpicureRepository.Status.IDLE ->
                        IdleSection(onScanClick = onScanClick)

                    EpicureRepository.Status.SCANNING ->
                        LoadingSection(message = "Сканирую ингредиенты...")

                    EpicureRepository.Status.FETCHING ->
                        LoadingSection(message = "Ищу вкусовые сочетания...")

                    EpicureRepository.Status.READY ->
                        ResultsSection(state = state, onScanAgain = onScanClick)

                    EpicureRepository.Status.COOKING ->
                        CookingStepSection(
                            state = state,
                            timerSecondsLeft = timerSecondsLeft,
                            onNextStep = { epicureViewModel.advanceStep() },
                        )

                    EpicureRepository.Status.DONE ->
                        DoneSection(onScanAgain = onScanClick)

                    EpicureRepository.Status.ERROR ->
                        ErrorSection(
                            errorMessage = state.errorMessage,
                            onRetry = onScanClick,
                        )
                }
            }
        }
    }
}

// ── IDLE ────────────────────────────────────────────────────────────────────

@Composable
private fun IdleSection(onScanClick: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Box(
            modifier = Modifier
                .size(96.dp)
                .clip(RoundedCornerShape(24.dp))
                .background(EpicureGoldBg),
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                imageVector = Icons.Default.CameraAlt,
                contentDescription = null,
                tint = EpicureGold,
                modifier = Modifier.size(48.dp),
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Epicure",
            color = EpicureGold,
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Направьте камеру очков на ингредиенты — AI определит их и проведёт вас через весь рецепт шаг за шагом.",
            color = AppColor.SubtleText,
            fontSize = 14.sp,
            textAlign = TextAlign.Center,
            lineHeight = 20.sp,
        )

        Spacer(modifier = Modifier.height(32.dp))

        Button(
            onClick = onScanClick,
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = EpicureGold),
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
        ) {
            Icon(
                imageVector = Icons.Default.CameraAlt,
                contentDescription = null,
                tint = Color.Black,
                modifier = Modifier.size(20.dp),
            )
            Spacer(modifier = Modifier.width(10.dp))
            Text(
                text = "Сканировать ингредиенты",
                color = Color.Black,
                fontWeight = FontWeight.SemiBold,
                fontSize = 16.sp,
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Или скажите «epicure» / «найди сочетания»",
            color = AppColor.SubtleText.copy(alpha = 0.6f),
            fontSize = 12.sp,
            textAlign = TextAlign.Center,
        )
    }
}

// ── LOADING ─────────────────────────────────────────────────────────────────

@Composable
private fun LoadingSection(message: String) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        CircularProgressIndicator(
            color = EpicureGold,
            modifier = Modifier.size(56.dp),
            strokeWidth = 3.dp,
        )
        Spacer(modifier = Modifier.height(20.dp))
        Text(
            text = message,
            color = Color.White,
            fontSize = 17.sp,
            fontWeight = FontWeight.Medium,
        )
    }
}

// ── COOKING STEP ─────────────────────────────────────────────────────────────

@Composable
private fun CookingStepSection(
    state: EpicureRepository.State,
    timerSecondsLeft: Int,
    onNextStep: () -> Unit,
) {
    val step = state.cookingSteps.getOrNull(state.currentStepIndex) ?: return
    val total = state.cookingSteps.size
    val stepNum = state.currentStepIndex + 1
    val progress = stepNum.toFloat() / total.toFloat()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 20.dp),
    ) {
        Spacer(modifier = Modifier.height(8.dp))

        // ── Progress bar ─────────────────────────────────────────────────
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                text = "Шаг $stepNum",
                color = EpicureGold,
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
            )
            Spacer(modifier = Modifier.weight(1f))
            Text(
                text = "$stepNum / $total",
                color = AppColor.SubtleText,
                fontSize = 13.sp,
            )
        }
        Spacer(modifier = Modifier.height(8.dp))
        LinearProgressIndicator(
            progress = { progress },
            modifier = Modifier
                .fillMaxWidth()
                .height(4.dp)
                .clip(RoundedCornerShape(2.dp)),
            color = EpicureGold,
            trackColor = AppColor.CardDark,
            strokeCap = StrokeCap.Round,
        )

        Spacer(modifier = Modifier.height(20.dp))

        // ── Phase badge ──────────────────────────────────────────────────
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(phaseBgColor(step.phase))
                    .padding(horizontal = 12.dp, vertical = 5.dp),
            ) {
                Text(
                    text = "${step.phase.emoji}  ${step.phase.label.uppercase()}",
                    color = phaseTextColor(step.phase),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.8.sp,
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // ── Step instruction ─────────────────────────────────────────────
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = AppColor.CardDark),
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text(
                text = step.instruction,
                color = Color.White,
                fontSize = 17.sp,
                lineHeight = 26.sp,
                fontWeight = FontWeight.Medium,
                modifier = Modifier.padding(20.dp),
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // ── Timer (if active) ────────────────────────────────────────────
        if (step.durationMinutes > 0 && timerSecondsLeft >= 0) {
            TimerCard(secondsLeft = timerSecondsLeft, totalMinutes = step.durationMinutes)
            Spacer(modifier = Modifier.height(16.dp))
        }

        // ── Step dots ────────────────────────────────────────────────────
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            state.cookingSteps.forEachIndexed { i, s ->
                val isCurrent = i == state.currentStepIndex
                val isDone = i < state.currentStepIndex
                Box(
                    modifier = Modifier
                        .size(if (isCurrent) 10.dp else 6.dp)
                        .clip(CircleShape)
                        .background(
                            when {
                                isCurrent -> EpicureGold
                                isDone -> EpicureGreen
                                else -> AppColor.CardDark
                            }
                        )
                        .then(
                            if (!isDone && !isCurrent)
                                Modifier.border(1.dp, AppColor.SubtleText.copy(alpha = 0.3f), CircleShape)
                            else Modifier
                        ),
                )
                if (i < state.cookingSteps.lastIndex) Spacer(modifier = Modifier.width(6.dp))
            }
        }

        Spacer(modifier = Modifier.weight(1f))

        // ── Next step button ─────────────────────────────────────────────
        Button(
            onClick = onNextStep,
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = EpicureGold),
            modifier = Modifier
                .fillMaxWidth()
                .height(54.dp),
        ) {
            Text(
                text = if (stepNum < total) "Дальше" else "Готово!",
                color = Color.Black,
                fontWeight = FontWeight.Bold,
                fontSize = 17.sp,
            )
            Spacer(modifier = Modifier.width(8.dp))
            Icon(
                imageVector = if (stepNum < total) Icons.AutoMirrored.Filled.ArrowForward
                              else Icons.Default.CheckCircle,
                contentDescription = null,
                tint = Color.Black,
                modifier = Modifier.size(20.dp),
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Или скажите «дальше» / «готово»",
            color = AppColor.SubtleText.copy(alpha = 0.5f),
            fontSize = 12.sp,
            textAlign = TextAlign.Center,
            modifier = Modifier.fillMaxWidth(),
        )

        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
private fun TimerCard(secondsLeft: Int, totalMinutes: Int) {
    val totalSec = totalMinutes * 60
    val progress = if (totalSec > 0) secondsLeft.toFloat() / totalSec.toFloat() else 0f
    val minutes = secondsLeft / 60
    val seconds = secondsLeft % 60
    val isUrgent = secondsLeft <= 60

    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isUrgent) Color(0xFF2A1010) else Color(0xFF101A1A),
        ),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Timer,
                    contentDescription = null,
                    tint = if (isUrgent) Color(0xFFFF6B6B) else EpicureTeal,
                    modifier = Modifier.size(16.dp),
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "ТАЙМЕР",
                    color = if (isUrgent) Color(0xFFFF6B6B) else EpicureTeal,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.8.sp,
                )
                Spacer(modifier = Modifier.weight(1f))
                Text(
                    text = "%02d:%02d".format(minutes, seconds),
                    color = if (isUrgent) Color(0xFFFF6B6B) else Color.White,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            LinearProgressIndicator(
                progress = { progress },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(3.dp)
                    .clip(RoundedCornerShape(2.dp)),
                color = if (isUrgent) Color(0xFFFF6B6B) else EpicureTeal,
                trackColor = AppColor.SurfaceBlack,
            )
        }
    }
}

private fun phaseBgColor(phase: CookingPhase): Color = when (phase) {
    CookingPhase.PREP  -> Color(0xFF0E1A10)
    CookingPhase.COOK  -> Color(0xFF1A120E)
    CookingPhase.BAKE  -> Color(0xFF1A160E)
    CookingPhase.REST  -> Color(0xFF0E1218)
    CookingPhase.PLATE -> Color(0xFF120E1A)
}

private fun phaseTextColor(phase: CookingPhase): Color = when (phase) {
    CookingPhase.PREP  -> Color(0xFF5CD97B)
    CookingPhase.COOK  -> Color(0xFFFF8C55)
    CookingPhase.BAKE  -> Color(0xFFFFCC44)
    CookingPhase.REST  -> Color(0xFF55BBFF)
    CookingPhase.PLATE -> Color(0xFFCC88FF)
}

// ── DONE ─────────────────────────────────────────────────────────────────────

@Composable
private fun DoneSection(onScanAgain: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Box(
            modifier = Modifier
                .size(100.dp)
                .clip(CircleShape)
                .background(Color(0xFF0E1A10)),
            contentAlignment = Alignment.Center,
        ) {
            Text(text = "🍽️", fontSize = 44.sp)
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text(
            text = "Готово!",
            color = EpicureGreen,
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Блюдо приготовлено.\nПриятного аппетита!",
            color = AppColor.SubtleText,
            fontSize = 15.sp,
            textAlign = TextAlign.Center,
            lineHeight = 22.sp,
        )

        Spacer(modifier = Modifier.height(40.dp))

        Button(
            onClick = onScanAgain,
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = AppColor.CardDark),
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp),
        ) {
            Icon(
                imageVector = Icons.Default.CameraAlt,
                contentDescription = null,
                tint = EpicureGold,
                modifier = Modifier.size(18.dp),
            )
            Spacer(modifier = Modifier.width(10.dp))
            Text(
                text = "Приготовить ещё",
                color = EpicureGold,
                fontWeight = FontWeight.Medium,
                fontSize = 15.sp,
            )
        }
    }
}

// ── RESULTS ─────────────────────────────────────────────────────────────────

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ResultsSection(
    state: EpicureRepository.State,
    onScanAgain: () -> Unit,
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            Spacer(modifier = Modifier.height(4.dp))
            CookingSectionLabel("ИНГРЕДИЕНТЫ")
            Spacer(modifier = Modifier.height(8.dp))
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = AppColor.CardDark),
            ) {
                FlowRow(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    state.ingredients.forEach { ingredient ->
                        IngredientChip(ingredient)
                    }
                }
            }
        }

        if (state.pairingRaw.isNotBlank()) {
            item {
                CookingSectionLabel("ВКУСОВЫЕ СОЧЕТАНИЯ")
                Spacer(modifier = Modifier.height(8.dp))
                PairingCard(raw = state.pairingRaw)
            }
        }

        if (state.recipeText.isNotBlank()) {
            item {
                CookingSectionLabel("РЕЦЕПТ")
                Spacer(modifier = Modifier.height(8.dp))
                RecipeCard(text = state.recipeText)
            }
        }

        item {
            Spacer(modifier = Modifier.height(4.dp))
            Button(
                onClick = onScanAgain,
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = AppColor.CardDark),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
            ) {
                Icon(
                    imageVector = Icons.Default.Refresh,
                    contentDescription = null,
                    tint = EpicureGold,
                    modifier = Modifier.size(18.dp),
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Сканировать снова",
                    color = EpicureGold,
                    fontWeight = FontWeight.Medium,
                )
            }
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

// ── ERROR ─────────────────────────────────────────────────────────────────────

@Composable
private fun ErrorSection(errorMessage: String?, onRetry: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Text(
            text = "Ошибка подключения к Epicure",
            color = AppColor.Red,
            fontSize = 18.sp,
            fontWeight = FontWeight.SemiBold,
            textAlign = TextAlign.Center,
        )
        if (errorMessage != null) {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = errorMessage,
                color = AppColor.SubtleText,
                fontSize = 13.sp,
                textAlign = TextAlign.Center,
            )
        }
        Spacer(modifier = Modifier.height(24.dp))
        Button(
            onClick = onRetry,
            shape = RoundedCornerShape(14.dp),
            colors = ButtonDefaults.buttonColors(containerColor = EpicureGold),
        ) {
            Text("Попробовать снова", color = Color.Black, fontWeight = FontWeight.SemiBold)
        }
    }
}

// ── Sub-components ───────────────────────────────────────────────────────────

@Composable
private fun IngredientChip(name: String) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(EpicureGoldBg)
            .padding(horizontal = 12.dp, vertical = 6.dp),
    ) {
        Text(
            text = name,
            color = EpicureGold,
            fontSize = 13.sp,
            fontWeight = FontWeight.Medium,
        )
    }
}

@Composable
private fun PairingCard(raw: String) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = AppColor.CardDark),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(EpicureTeal),
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Epicure MCP",
                    color = EpicureTeal,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = raw,
                color = Color.White.copy(alpha = 0.88f),
                fontSize = 13.sp,
                lineHeight = 19.sp,
            )
        }
    }
}

@Composable
private fun RecipeCard(text: String) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = EpicureGoldBg),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.AutoAwesome,
                    contentDescription = null,
                    tint = EpicureGold,
                    modifier = Modifier.size(16.dp),
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Gemini · Epicure",
                    color = EpicureGold,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = text,
                color = Color.White.copy(alpha = 0.90f),
                fontSize = 14.sp,
                lineHeight = 21.sp,
            )
        }
    }
}
