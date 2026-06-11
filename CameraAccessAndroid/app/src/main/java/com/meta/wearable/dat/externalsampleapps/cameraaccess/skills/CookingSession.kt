package com.meta.wearable.dat.externalsampleapps.cameraaccess.skills

enum class CookingPhase(val label: String, val emoji: String) {
    PREP("Подготовка", "🔪"),
    COOK("Готовка", "🍳"),
    BAKE("Духовка", "🌡️"),
    REST("Отдых", "⏱️"),
    PLATE("Подача", "🍽️"),
}

data class CookingStep(
    val index: Int,
    val phase: CookingPhase,
    val instruction: String,
    val durationMinutes: Int = 0,
)

fun cookingPhaseFromString(s: String): CookingPhase = when (s.uppercase().trim()) {
    "COOK" -> CookingPhase.COOK
    "BAKE" -> CookingPhase.BAKE
    "REST" -> CookingPhase.REST
    "PLATE" -> CookingPhase.PLATE
    else -> CookingPhase.PREP
}
