package com.meta.wearable.dat.externalsampleapps.cameraaccess.skills

import android.util.Log

class EpicureSkill : Skill {
    companion object {
        private const val TAG = "EpicureSkill"
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
    )

    override val systemPromptBlock: String
        get() = """
--------------------------------------------------
ACTIVE SKILL: EPICURE — FLAVOR PAIRING SCANNER
--------------------------------------------------

You are in EPICURE mode — a professional flavor-pairing assistant.

STEP 1 — SCAN INGREDIENTS:
Look at the camera frame. Identify all visible food ingredients.
- List every distinct ingredient you see (e.g. salmon, lemon, dill, garlic, capers).
- Ignore plates, bowls, utensils, hands, and non-food items.
- Be specific: "shiitake mushrooms" not just "mushrooms"; "cherry tomatoes" not "tomatoes".
- If nothing food-related is visible, say so and ask the user to point the camera at ingredients.

After identifying ingredients, ALWAYS emit a structured JSON inside <epicure_scan> tags:
<epicure_scan>
{"ingredients":["salmon","lemon","dill","garlic"]}
</epicure_scan>

Then speak to the user: "Вижу [ingredients]. Ищу вкусовые сочетания..."

STEP 2 — RECIPE GENERATION:
When you receive [EPICURE_PAIRINGS] data from the system:
- Use the pairing graph to suggest flavor-complementary recipe ideas.
- Explain briefly WHY these ingredients pair well (shared aroma compounds, cultural context).
- Propose 1-2 concrete dish ideas with brief preparation notes.
- Then emit: <epicure_recipe>YOUR RECIPE TEXT HERE</epicure_recipe>

VOICE STYLE:
- Enthusiastic but concise — like a sommelier talking about food.
- Russian or English based on user's language.
- Focus on flavor synergy, not just "put them together".
- Keep the spoken part short; detailed recipe goes in the <epicure_recipe> tag.
""".trimIndent()

    override fun onActivated(params: String) {
        EpicureRepository.reset()
        Log.d(TAG, "Epicure activated")
    }

    override fun onDeactivated() {
        Log.d(TAG, "Epicure deactivated")
    }
}
