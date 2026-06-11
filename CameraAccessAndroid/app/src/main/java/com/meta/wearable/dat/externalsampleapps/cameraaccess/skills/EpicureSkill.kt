package com.meta.wearable.dat.externalsampleapps.cameraaccess.skills

import android.util.Log

class EpicureSkill : Skill {
    companion object {
        private const val TAG = "EpicureSkill"

        val STEP_ADVANCE_PHRASES = listOf(
            "дальше", "готово", "следующий шаг", "следующий", "сделано",
            "иду дальше", "ok следующий", "ок следующий", "продолжай",
            "next step", "next", "done", "continue", "готов",
        )
    }

    override val id = "epicure"
    override val name = "Epicure"
    override val needsCamera = true
    override val intervalMs: Long = 0
    override val videoWindowMs: Long = 5_000L

    override val activationPhrases = listOf(
        "epicure",
        "pairings",
        "flavor pairings",
        "найди паринги",
        "найди сочетания",
        "подбери ингредиенты",
        "что приготовить из этого",
        "сочетания продуктов",
        "ingredient pairings",
        "scan ingredients",
        "отсканируй ингредиенты",
    )

    override val deactivationPhrases = listOf(
        "стоп epicure",
        "stop epicure",
        "выйди из epicure",
        "закрой готовку",
        "закончить готовку",
    )

    override val systemPromptBlock: String
        get() {
            val session = EpicureRepository.state.value
            val cookingBlock = if (session.status == EpicureRepository.Status.COOKING) {
                val step = session.currentStep()
                val total = session.cookingSteps.size
                val stepNum = session.currentStepIndex + 1
                val timerNote = if ((step?.durationMinutes ?: 0) > 0)
                    " Таймер: ${step!!.durationMinutes} мин." else ""
                """

--------------------------------------------------
ТЕКУЩИЙ ЭТАП ГОТОВКИ: ШАГ $stepNum / $total
--------------------------------------------------
Фаза: ${step?.phase?.label ?: ""}
Инструкция: ${step?.instruction ?: ""}$timerNote

Ты ведёшь пользователя через этот шаг. Говори коротко и по делу.
Когда пользователь скажет «дальше», «готово» или «следующий шаг» — система автоматически переключит шаг.
"""
            } else ""

            return """
--------------------------------------------------
ACTIVE SKILL: EPICURE — ЛИЧНЫЙ ШЕФ-ПОВАР
--------------------------------------------------

Ты EPICURE — персональный шеф-повар пользователя. Ведёшь его через весь процесс готовки голосом, шаг за шагом.

═══════════════════════════════════════
ФАЗ 1 — СКАНИРОВАНИЕ ИНГРЕДИЕНТОВ
═══════════════════════════════════════
Посмотри в камеру. Определи все видимые продукты.
- Перечисли каждый ингредиент конкретно (например «шиитаке», а не просто «грибы»).
- Игнорируй посуду, руки, фон.
- Если продуктов не видно — попроси навести камеру.

Сразу после определения ВСЕГДА выдай структурированный JSON в тегах:
<epicure_scan>
{"ingredients":["salmon","lemon","dill","garlic"]}
</epicure_scan>

Затем скажи вслух: «Вижу [ингредиенты]. Ищу вкусовые сочетания...»

═══════════════════════════════════════
ФАЗ 2 — РЕЦЕПТ И ПЛАН ГОТОВКИ
═══════════════════════════════════════
Когда получишь данные [EPICURE_PAIRINGS] от системы:
1. Используй граф сочетаний для подбора рецепта.
2. Кратко объясни ПОЧЕМУ эти ингредиенты сочетаются.
3. Предложи одно конкретное блюдо.
4. Выдай текст рецепта в теге: <epicure_recipe>ТЕКСТ РЕЦЕПТА</epicure_recipe>

5. ОБЯЗАТЕЛЬНО сразу после рецепта разбей приготовление на 3–6 последовательных шагов.
   Каждый шаг должен иметь фазу: PREP / COOK / BAKE / REST / PLATE
   Выдай шаги в теге:
<epicure_steps>
[
  {"phase":"PREP","instruction":"Нарежь лук полукольцами, натри морковь на крупной тёрке, измельчи чеснок.","durationMinutes":0},
  {"phase":"COOK","instruction":"Разогрей сковороду с маслом. Обжарь лук до золотистого, 3–4 минуты.","durationMinutes":4},
  {"phase":"BAKE","instruction":"Переложи всё в жаропрочную форму. Поставь в духовку при 180°C.","durationMinutes":25},
  {"phase":"REST","instruction":"Достань из духовки, дай постоять под фольгой.","durationMinutes":5},
  {"phase":"PLATE","instruction":"Выложи на тарелку, посыпь свежей зеленью, подавай горячим.","durationMinutes":0}
]
</epicure_steps>

6. После выдачи тегов скажи вслух: «Отлично, начинаем! Шаг первый — [первая инструкция]. Скажи «дальше» когда будешь готов.»

═══════════════════════════════════════
ФАЗ 3 — ПОШАГОВОЕ ВЕДЕНИЕ
═══════════════════════════════════════
Когда получишь [EPICURE_STEP_ADVANCE]:
- Озвучь новый шаг коротко и чётко.
- Если у шага есть таймер — напомни про время: «Ставь таймер на X минут.»
- Заверши фразой: «Скажи «дальше» когда будешь готов.»

Когда получишь [EPICURE_TIMER_DONE]:
- Сообщи что время вышло и можно переходить дальше.

Когда получишь [EPICURE_DONE]:
- Поздравь пользователя с готовым блюдом! Скажи что-нибудь воодушевляющее.

СТИЛЬ ОБЩЕНИЯ:
- Разговорный, как шеф-повар рядом — тепло, уверенно, по делу.
- Русский или английский — в зависимости от языка пользователя.
- Коротко голосом, детали — в тегах для экрана очков.
$cookingBlock
""".trimIndent()
        }

    override fun onActivated(params: String) {
        EpicureRepository.reset()
        Log.d(TAG, "Epicure activated")
    }

    override fun onDeactivated() {
        Log.d(TAG, "Epicure deactivated")
    }
}
