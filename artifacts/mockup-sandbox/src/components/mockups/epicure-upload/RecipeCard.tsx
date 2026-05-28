import { useState } from "react";
import {
  Wifi, Battery, Signal, ChevronLeft,
  Sparkles, CloudUpload, Trash2, Clock, Users,
  ChefHat, Flame, CheckCircle2, BookOpen,
  Carrot, Beef, Cake, Apple, Fish, Egg,
  Cherry, Grape, Cookie, Croissant, Pizza,
  Sandwich, Wheat, Citrus, Banana,
} from "lucide-react";

// ─── Ticker ───────────────────────────────────────────────────────────────────
const TICKER_ICONS = [
  Fish, Carrot, Beef, Apple, Cake, Egg,
  Cherry, Grape, Cookie, Croissant, Pizza,
  Sandwich, Wheat, Citrus, Banana,
  Fish, Carrot, Beef, Apple, Cake, Egg,
  Cherry, Grape, Cookie, Croissant,
];

function IngredientTicker() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{
        height: 52,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <style>{`
        @keyframes ticker2 { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .tk2 { animation: ticker2 16s linear infinite; display:flex; align-items:center; width:max-content; }
      `}</style>
      <div className="tk2 h-full" style={{ paddingTop: 4 }}>
        {[...TICKER_ICONS, ...TICKER_ICONS].map((Icon, i) => {
          const pos = i % TICKER_ICONS.length;
          const center = TICKER_ICONS.length / 2;
          const dist = Math.abs(pos - center) / center;
          return (
            <div key={i} className="flex-shrink-0 mx-2.5" style={{
              transform: `scale(${1 - dist * 0.28})`,
              opacity: 1 - dist * 0.42,
            }}>
              <Icon size={24} strokeWidth={1.5} style={{ color: "hsl(90 70% 90% / 0.75)" }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Recipe data ──────────────────────────────────────────────────────────────
const RECIPE = {
  title: "Citrus-Dill Salmon with Caper Cream",
  time: "25 min",
  serves: "2",
  difficulty: "Easy",
  score: 94,
  ingredients: [
    { amount: "2 fillets", name: "Salmon (200g each)" },
    { amount: "1", name: "Lemon, zested & juiced" },
    { amount: "2 tbsp", name: "Fresh dill, chopped" },
    { amount: "1 tbsp", name: "Capers, drained" },
    { amount: "100g", name: "Cream cheese" },
    { amount: "1 tbsp", name: "Olive oil" },
  ],
  steps: [
    "Pat salmon dry and season with salt, pepper, and lemon zest.",
    "Heat oil in a pan over medium-high. Sear salmon 3 min each side until golden.",
    "Mix cream cheese, capers, dill, and lemon juice into a sauce.",
    "Plate salmon, spoon caper cream alongside. Garnish with fresh dill.",
  ],
};

// ─── Component ───────────────────────────────────────────────────────────────
export function RecipeCard() {
  const [saved, setSaved] = useState(true);
  const [tab, setTab] = useState<"ingredients" | "steps">("ingredients");

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#111" }}>
      {/* Phone frame */}
      <div className="relative overflow-hidden flex flex-col" style={{
        width: 390, height: 844, borderRadius: 48,
        background: "#0a0a0a", border: "10px solid #1c1c1c",
        boxShadow: "0 40px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.06)",
      }}>

        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 flex-shrink-0">
          <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>9:41</span>
          <div className="w-24 h-6 rounded-full" style={{
            background: "#0a0a0a", border: "1.5px solid #222",
            position: "absolute", left: "50%", transform: "translateX(-50%)", top: 12,
          }} />
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.9)" }} />
            <Wifi className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.9)" }} />
            <Battery className="w-4 h-4" style={{ color: "rgba(255,255,255,0.9)" }} />
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3 flex-shrink-0">
          <button className="p-2 -ml-2" style={{ color: "rgba(255,255,255,0.5)" }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{
            background: "rgba(134,239,172,0.08)", border: "1px solid rgba(134,239,172,0.15)",
          }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: "#86efac" }} />
            <span className="text-xs font-semibold" style={{ color: "#86efac" }}>Generated recipe</span>
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSaved(!saved)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200"
              style={{
                background: saved ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${saved ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.1)"}`,
                color: saved ? "#4ade80" : "rgba(255,255,255,0.4)",
              }}
            >
              {saved ? <CheckCircle2 className="w-3 h-3" /> : <CloudUpload className="w-3 h-3" />}
            </button>
            <button
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
              }}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Recipe header card */}
        <div className="mx-5 mb-3 px-4 py-3 rounded-2xl flex-shrink-0" style={{
          background: "rgba(134,239,172,0.05)",
          border: "1px solid rgba(134,239,172,0.12)",
        }}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-base font-bold leading-tight flex-1" style={{ color: "#fff" }}>
              {RECIPE.title}
            </h2>
            <div className="flex-shrink-0 px-2 py-1 rounded-full text-[11px] font-bold" style={{
              background: "rgba(134,239,172,0.15)",
              color: "#86efac",
              border: "1px solid rgba(134,239,172,0.2)",
            }}>
              {RECIPE.score}%
            </div>
          </div>
          <div className="flex items-center gap-3">
            {[
              { Icon: Clock, val: RECIPE.time },
              { Icon: Users, val: `${RECIPE.serves} servings` },
              { Icon: Flame, val: RECIPE.difficulty },
            ].map(({ Icon, val }) => (
              <div key={val} className="flex items-center gap-1">
                <Icon className="w-3 h-3" style={{ color: "rgba(255,255,255,0.3)" }} />
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-5 mb-3 flex gap-1.5 flex-shrink-0">
          {([
            { key: "ingredients", Icon: ChefHat, label: "Ingredients" },
            { key: "steps",       Icon: BookOpen, label: "Method" },
          ] as const).map(({ key, Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{
                background: tab === key ? "rgba(134,239,172,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${tab === key ? "rgba(134,239,172,0.3)" : "rgba(255,255,255,0.07)"}`,
                color: tab === key ? "#86efac" : "rgba(255,255,255,0.4)",
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 px-5 overflow-y-auto" style={{ minHeight: 0 }}>

          {tab === "ingredients" && (
            <div className="flex flex-col gap-2">
              {RECIPE.ingredients.map(({ amount, name }, i) => (
                <div
                  key={name}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
                  }}
                >
                  <span className="text-xs font-bold w-14 text-right flex-shrink-0" style={{ color: "#86efac" }}>
                    {amount}
                  </span>
                  <div className="w-px self-stretch" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{name}</span>
                </div>
              ))}
            </div>
          )}

          {tab === "steps" && (
            <div className="flex flex-col gap-3">
              {RECIPE.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-3 px-4 py-3 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    animation: `fadeUp 0.3s ease ${i * 0.08}s both`,
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5"
                    style={{
                      background: "rgba(134,239,172,0.12)",
                      border: "1px solid rgba(134,239,172,0.2)",
                      color: "#86efac",
                    }}
                  >
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          )}

          <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
        </div>

        {/* Bottom ticker */}
        <div className="px-5 pt-3 pb-3 flex-shrink-0">
          <IngredientTicker />
          <p className="text-center text-[10px] mt-1.5" style={{ color: "rgba(255,255,255,0.18)" }}>
            Saved in Recipe Collection
          </p>
        </div>

        {/* Home indicator */}
        <div className="flex-shrink-0 pb-2 flex justify-center">
          <div className="rounded-full" style={{ width: 120, height: 5, background: "rgba(255,255,255,0.25)" }} />
        </div>
      </div>
    </div>
  );
}
