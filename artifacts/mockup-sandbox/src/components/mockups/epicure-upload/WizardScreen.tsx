import { useState } from "react";
import {
  ChevronLeft, ChevronRight, Wifi, Battery, Signal,
  WandSparkles, Flame, Leaf, Fish, Wheat, Milk, Egg,
  Check, Sparkles,
} from "lucide-react";

// ─── Step data ───────────────────────────────────────────────────────────────

const CUISINES = [
  { label: "Italian", emoji: "🍝" },
  { label: "Japanese", emoji: "🍣" },
  { label: "French", emoji: "🥐" },
  { label: "Mexican", emoji: "🌮" },
  { label: "Indian", emoji: "🍛" },
  { label: "Mediterranean", emoji: "🫒" },
];

const MOODS = [
  { label: "Comfort", emoji: "🫂" },
  { label: "Light", emoji: "🥗" },
  { label: "Festive", emoji: "🥂" },
  { label: "Quick", emoji: "⚡" },
  { label: "Romantic", emoji: "🕯️" },
  { label: "Spicy", emoji: "🌶️" },
];

const BASE_INGREDIENTS = [
  { label: "Salmon", Icon: Fish, color: "#f97316" },
  { label: "Chicken", Icon: Flame, color: "#eab308" },
  { label: "Lentils", Icon: Leaf, color: "#22c55e" },
  { label: "Pasta", Icon: Wheat, color: "#a78bfa" },
  { label: "Tofu", Icon: Leaf, color: "#34d399" },
  { label: "Cheese", Icon: Milk, color: "#fbbf24" },
  { label: "Eggs", Icon: Egg, color: "#fb923c" },
  { label: "Shrimp", Icon: Fish, color: "#f43f5e" },
];

const SUGGESTIONS = [
  { name: "Lemon & Dill", score: 96, why: "Classic Nordic pairing" },
  { name: "Miso & Ginger", score: 91, why: "Umami depth contrast" },
  { name: "Capers & Cream", score: 88, why: "Briny richness balance" },
  { name: "Avocado & Lime", score: 84, why: "Creamy acid harmony" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function WizardScreen() {
  const [step, setStep] = useState(0); // 0 cuisine, 1 mood, 2 base, 3 results
  const [vegetarian, setVegetarian] = useState(false);
  const [plantBased, setPlantBased] = useState(false);
  const [cuisine, setCuisine] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [base, setBase] = useState<string | null>(null);

  const canNext =
    (step === 0 && cuisine) ||
    (step === 1 && mood) ||
    (step === 2 && base);

  const stepLabels = ["Cuisine", "Mood", "Base", "Pairings"];

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "#111" }}>

      {/* Phone frame */}
      <div className="relative overflow-hidden flex flex-col"
        style={{
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
            background: "rgba(168,139,250,0.08)", border: "1px solid rgba(168,139,250,0.18)",
          }}>
            <WandSparkles className="w-3.5 h-3.5" style={{ color: "#c4b5fd" }} />
            <span className="text-xs font-semibold" style={{ color: "#c4b5fd" }}>Epicure Wizard</span>
          </div>
          <div className="w-9" />
        </div>

        {/* Toggles row */}
        <div className="flex items-center justify-end gap-4 px-5 mb-4 flex-shrink-0">
          {[
            { label: "Veg", val: vegetarian, set: setVegetarian },
            { label: "Plant", val: plantBased, set: setPlantBased },
          ].map(({ label, val, set }) => (
            <button key={label} onClick={() => set(!val)} className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
              <div className="relative transition-all duration-200" style={{
                width: 36, height: 20, borderRadius: 10,
                background: val ? "#c4b5fd" : "rgba(255,255,255,0.12)",
              }}>
                <div className="absolute top-1 transition-all duration-200 rounded-full" style={{
                  width: 14, height: 14, background: "#fff",
                  left: val ? 18 : 3, boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                }} />
              </div>
            </button>
          ))}
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 px-5 mb-5 flex-shrink-0">
          {stepLabels.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={label} className="flex items-center" style={{ flex: i < stepLabels.length - 1 ? 1 : "none" }}>
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-200" style={{
                    background: done ? "#c4b5fd" : active ? "rgba(196,181,253,0.15)" : "rgba(255,255,255,0.06)",
                    border: `1.5px solid ${done ? "#c4b5fd" : active ? "rgba(196,181,253,0.5)" : "rgba(255,255,255,0.1)"}`,
                    color: done ? "#0a0a0a" : active ? "#c4b5fd" : "rgba(255,255,255,0.3)",
                  }}>
                    {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className="text-[9px] mt-1 font-medium" style={{
                    color: active ? "#c4b5fd" : done ? "rgba(196,181,253,0.6)" : "rgba(255,255,255,0.25)",
                  }}>
                    {label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className="flex-1 mx-1 mb-3 h-px transition-all duration-300" style={{
                    background: done ? "rgba(196,181,253,0.4)" : "rgba(255,255,255,0.07)",
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Step content ── */}
        <div className="flex-1 px-5 overflow-hidden flex flex-col" style={{ minHeight: 0 }}>

          {/* Step 0 — Cuisine */}
          {step === 0 && (
            <div className="flex flex-col h-full">
              <p className="text-base font-semibold mb-1" style={{ color: "#fff" }}>
                What cuisine inspires you?
              </p>
              <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                Sets the flavour context for pairings
              </p>
              <div className="grid grid-cols-3 gap-2">
                {CUISINES.map(({ label, emoji }) => (
                  <button key={label} onClick={() => setCuisine(label)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all duration-200"
                    style={{
                      background: cuisine === label ? "rgba(196,181,253,0.12)" : "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${cuisine === label ? "rgba(196,181,253,0.45)" : "rgba(255,255,255,0.07)"}`,
                      boxShadow: cuisine === label ? "0 0 14px rgba(196,181,253,0.15)" : "none",
                    }}>
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-[11px] font-medium" style={{
                      color: cuisine === label ? "#c4b5fd" : "rgba(255,255,255,0.55)",
                    }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Mood */}
          {step === 1 && (
            <div className="flex flex-col h-full">
              <p className="text-base font-semibold mb-1" style={{ color: "#fff" }}>
                What's the occasion?
              </p>
              <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                Guides texture and intensity of pairings
              </p>
              <div className="grid grid-cols-3 gap-2">
                {MOODS.map(({ label, emoji }) => (
                  <button key={label} onClick={() => setMood(label)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all duration-200"
                    style={{
                      background: mood === label ? "rgba(196,181,253,0.12)" : "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${mood === label ? "rgba(196,181,253,0.45)" : "rgba(255,255,255,0.07)"}`,
                      boxShadow: mood === label ? "0 0 14px rgba(196,181,253,0.15)" : "none",
                    }}>
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-[11px] font-medium" style={{
                      color: mood === label ? "#c4b5fd" : "rgba(255,255,255,0.55)",
                    }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Base ingredient */}
          {step === 2 && (
            <div className="flex flex-col h-full">
              <p className="text-base font-semibold mb-1" style={{ color: "#fff" }}>
                Choose your base ingredient
              </p>
              <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                The anchor around which pairings are built
              </p>
              <div className="grid grid-cols-4 gap-2">
                {BASE_INGREDIENTS.map(({ label, Icon, color }) => (
                  <button key={label} onClick={() => setBase(label)}
                    className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all duration-200"
                    style={{
                      background: base === label ? color + "18" : "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${base === label ? color + "55" : "rgba(255,255,255,0.07)"}`,
                      boxShadow: base === label ? `0 0 14px ${color}22` : "none",
                    }}>
                    <Icon className="w-5 h-5" style={{ color: base === label ? color : "rgba(255,255,255,0.35)" }} />
                    <span className="text-[10px] font-medium leading-tight text-center" style={{
                      color: base === label ? color : "rgba(255,255,255,0.5)",
                    }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Results */}
          {step === 3 && (
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4" style={{ color: "#c4b5fd" }} />
                <p className="text-base font-semibold" style={{ color: "#fff" }}>
                  Wizard Pairings
                </p>
              </div>
              <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                {cuisine} · {mood} · {base}
              </p>
              <div className="flex flex-col gap-2.5">
                {SUGGESTIONS.map(({ name, score, why }, i) => (
                  <div key={name} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}>
                    <span className="text-xs font-bold w-5 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{name}</p>
                      <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>{why}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-bold" style={{ color: "#c4b5fd" }}>{score}%</span>
                      <div className="h-1 w-12 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full" style={{
                          width: `${score}%`,
                          background: "linear-gradient(90deg, #c4b5fd, #a78bfa)",
                        }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Bottom nav */}
        <div className="px-5 pb-3 pt-3 flex gap-2 flex-shrink-0">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "rgba(255,255,255,0.5)",
              }}>
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => canNext && setStep(step + 1)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all duration-300"
              style={{
                background: canNext
                  ? "linear-gradient(135deg, #c4b5fd, #a78bfa)"
                  : "rgba(255,255,255,0.07)",
                color: canNext ? "#0a0a0a" : "rgba(255,255,255,0.25)",
                border: canNext ? "none" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: canNext ? "0 8px 24px rgba(196,181,253,0.3)" : "none",
                cursor: canNext ? "pointer" : "default",
              }}>
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold"
              style={{
                background: "linear-gradient(135deg, #c4b5fd, #a78bfa)",
                color: "#0a0a0a",
                boxShadow: "0 8px 24px rgba(196,181,253,0.3)",
              }}>
              <WandSparkles className="w-4 h-4" />
              Generate Recipe
            </button>
          )}
        </div>

        {/* Home indicator */}
        <div className="flex-shrink-0 pb-2 flex justify-center">
          <div className="rounded-full" style={{ width: 120, height: 5, background: "rgba(255,255,255,0.25)" }} />
        </div>
      </div>
    </div>
  );
}
