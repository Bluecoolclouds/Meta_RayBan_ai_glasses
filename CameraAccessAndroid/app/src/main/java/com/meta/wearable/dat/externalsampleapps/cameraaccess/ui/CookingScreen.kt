package com.meta.wearable.dat.externalsampleapps.cameraaccess.ui

import androidx.compose.foundation.background
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.meta.wearable.dat.externalsampleapps.cameraaccess.skills.EpicureRepository
import com.meta.wearable.dat.externalsampleapps.cameraaccess.skills.EpicureViewModel

private val EpicureGold   = Color(0xFFD4A853)
private val EpicureGoldBg = Color(0xFF1E1708)
private val EpicureTeal   = Color(0xFF2ECFB1)

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
            when (state.status) {
                EpicureRepository.Status.IDLE ->
                    IdleSection(onScanClick = onScanClick)

                EpicureRepository.Status.SCANNING ->
                    LoadingSection(message = "Сканирую ингредиенты...")

                EpicureRepository.Status.FETCHING ->
                    LoadingSection(message = "Ищу вкусовые сочетания...")

                EpicureRepository.Status.READY ->
                    ResultsSection(state = state, onScanAgain = onScanClick)

                EpicureRepository.Status.ERROR ->
                    ErrorSection(
                        errorMessage = state.errorMessage,
                        onRetry = onScanClick,
                    )
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
            text = "Направьте камеру очков на ингредиенты — AI определит их и подберёт вкусовые сочетания по базе Epicure.",
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
        // ── Detected Ingredients ─────────────────────────────────────────
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

        // ── Pairing Results ──────────────────────────────────────────────
        if (state.pairingRaw.isNotBlank()) {
            item {
                CookingSectionLabel("ВКУСОВЫЕ СОЧЕТАНИЯ")
                Spacer(modifier = Modifier.height(8.dp))
                PairingCard(raw = state.pairingRaw)
            }
        }

        // ── Recipe from Gemini ───────────────────────────────────────────
        if (state.recipeText.isNotBlank()) {
            item {
                CookingSectionLabel("РЕЦЕПТ")
                Spacer(modifier = Modifier.height(8.dp))
                RecipeCard(text = state.recipeText)
            }
        }

        // ── Scan Again ───────────────────────────────────────────────────
        item {
            Spacer(modifier = Modifier.height(4.dp))
            Button(
                onClick = onScanAgain,
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = AppColor.CardDark,
                ),
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

// ── ERROR ────────────────────────────────────────────────────────────────────

@Composable
private fun ErrorSection(
    errorMessage: String?,
    onRetry: () -> Unit,
) {
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
