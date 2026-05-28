import { useState } from "react";
import {
  ChevronLeft, Wifi, Battery, Signal,
  WandSparkles, ChefHat, Crown,
  Plus, X, Search, Sparkles, GitBranch, Shuffle
} from "lucide-react";

const SUGGESTED = ["Salmon", "Lemon", "Dill", "Capers", "Cream cheese"];
const ALL_INGREDIENTS = [
  "Garlic", "Butter", "Thyme", "White wine", "Shallots",
  "Avocado", "Cucumber", "Yogurt", "Honey", "Walnuts",
  "Anchovies", "Olives", "Tuna", "Beetroot", "Parsley",
];

type Tab = "wizard" | "epicure" | "pro";

export function EpicureScreen() {
  const [tab, setTab] = useState<Tab>("epicure");
  const [vegetarian, setVegetarian] = useState(false);
  const [plantBased, setPlantBased] = useState(false);
  const [selected, setSelected] = useState<string[]>(["Salmon", "Lemon", "Dill"]);
  const [search, setSearch] = useState("");

  const toggle = (ing: string) => {
    setSelected((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]
    );
  };

  const filtered = ALL_INGREDIENTS.filter(
    (i) => i.toLowerCase().includes(search.toLowerCase()) && !SUGGESTED.includes(i)
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "#111" }}>

      {/* Phone frame */}
      <div
        className="relative overflow-hidden flex flex-col"
        style={{
          width: 390,
          height: 844,
          borderRadius: 48,
          background: "#0a0a0a",
          border: "10px solid #1c1c1c",
          boxShadow: "0 40px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
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
          <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>Epicure</span>
          <div className="w-9" />
        </div>

        {/* Tab bar */}
        <div className="px-5 mb-4 flex-shrink-0">
          <div
            className="flex rounded-xl p-1 gap-1"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {(["wizard", "epicure", "pro"] as Tab[]).map((t) => {
              const Icon = t === "wizard" ? WandSparkles : t === "epicure" ? ChefHat : Crown;
              const label = t === "wizard" ? "Wizard" : t === "epicure" ? "Epicure" : "Pro";
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                  style={{
                    background: active ? "rgba(255,255,255,0.12)" : "transparent",
                    color: active ? "#fff" : "rgba(255,255,255,0.4)",
                    border: active ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
                    boxShadow: active ? "0 2px 8px rgba(0,0,0,0.3)" : "none",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main card */}
        <div className="flex-1 mx-5 rounded-2xl flex flex-col overflow-hidden mb-3" style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          minHeight: 0,
        }}>
          {/* Card header */}
          <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{
            borderBottom: "1px solid rgba(255,255,255,0.06)"
          }}>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full" style={{
              background: "rgba(134,239,172,0.08)",
              border: "1px solid rgba(134,239,172,0.15)",
            }}>
              <ChefHat className="w-3.5 h-3.5" style={{ color: "#86efac" }} />
              <span className="text-xs font-semibold" style={{ color: "#86efac" }}>Epicure</span>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-3">
              {[
                { label: "Veg", val: vegetarian, set: setVegetarian },
                { label: "Plant", val: plantBased, set: setPlantBased },
              ].map(({ label, val, set }) => (
                <button
                  key={label}
                  onClick={() => set(!val)}
                  className="flex items-center gap-1.5"
                >
                  <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
                  <div
                    className="relative transition-all duration-200"
                    style={{
                      width: 36, height: 20, borderRadius: 10,
                      background: val ? "#86efac" : "rgba(255,255,255,0.12)",
                    }}
                  >
                    <div
                      className="absolute top-1 transition-all duration-200 rounded-full"
                      style={{
                        width: 14, height: 14,
                        background: "#fff",
                        left: val ? 18 : 3,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* From Vision section */}
          <div className="px-4 pt-3 pb-2 flex-shrink-0">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3 h-3" style={{ color: "#86efac" }} />
              <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
                FROM CAMERA
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED.map((ing) => {
                const active = selected.includes(ing);
                return (
                  <button
                    key={ing}
                    onClick={() => toggle(ing)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                    style={{
                      background: active ? "rgba(134,239,172,0.12)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${active ? "rgba(134,239,172,0.35)" : "rgba(255,255,255,0.09)"}`,
                      color: active ? "#86efac" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {active
                      ? <X className="w-2.5 h-2.5" />
                      : <Plus className="w-2.5 h-2.5" />}
                    {ing}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mx-4 my-2 flex-shrink-0" style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

          {/* Search */}
          <div className="px-4 pb-2 flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Add ingredient…"
                className="flex-1 bg-transparent text-xs outline-none"
                style={{ color: "rgba(255,255,255,0.7)" }}
              />
            </div>
          </div>

          {/* Add-on ingredients */}
          <div className="px-4 pb-2 flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
            <div className="flex flex-wrap gap-1.5">
              {filtered.slice(0, 12).map((ing) => {
                const active = selected.includes(ing);
                return (
                  <button
                    key={ing}
                    onClick={() => toggle(ing)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                    style={{
                      background: active ? "rgba(96,165,250,0.12)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active ? "rgba(96,165,250,0.3)" : "rgba(255,255,255,0.07)"}`,
                      color: active ? "#93c5fd" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {active ? <X className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                    {ing}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 mb-3 flex gap-2 flex-shrink-0">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <Shuffle className="w-3.5 h-3.5" />
            Suggest
          </button>
          <button
            className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all duration-300"
            style={{
              background: selected.length >= 2
                ? "linear-gradient(135deg, #4ade80, #22c55e)"
                : "rgba(255,255,255,0.07)",
              color: selected.length >= 2 ? "#0a0a0a" : "rgba(255,255,255,0.25)",
              border: selected.length >= 2 ? "none" : "1px solid rgba(255,255,255,0.08)",
              boxShadow: selected.length >= 2 ? "0 8px 24px rgba(74,222,128,0.3)" : "none",
            }}
          >
            <GitBranch className="w-4 h-4" />
            Find Pairings ({selected.length})
          </button>
        </div>

        {/* Home indicator */}
        <div className="flex-shrink-0 pb-2 flex justify-center">
          <div className="rounded-full" style={{ width: 120, height: 5, background: "rgba(255,255,255,0.25)" }} />
        </div>
      </div>
    </div>
  );
}
