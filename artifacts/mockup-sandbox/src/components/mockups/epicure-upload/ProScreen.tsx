import { useState } from "react";
import {
  ChevronLeft, Wifi, Battery, Signal,
  Sparkles, GitBranch, Shuffle, Zap, Plus, X,
  ArrowRight, Sliders, BarChart3, Atom,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const BASE = "Salmon";

const NEIGHBORS = [
  { name: "Trout", score: 94, shared: 18 },
  { name: "Tuna", score: 88, shared: 14 },
  { name: "Sea bass", score: 82, shared: 11 },
  { name: "Halibut", score: 79, shared: 9 },
];

const MORPH_TARGETS = [
  { label: "More umami", direction: "umami" },
  { label: "Lighter", direction: "lighter" },
  { label: "Smoky", direction: "smoky" },
  { label: "Acidic", direction: "acidic" },
  { label: "Sweet", direction: "sweet" },
  { label: "Herbaceous", direction: "herbal" },
];

const COMPOUNDS = [
  { name: "Trimethylamine", pct: 82, color: "#f97316" },
  { name: "Linalool", pct: 67, color: "#a78bfa" },
  { name: "Hexanal", pct: 54, color: "#22c55e" },
  { name: "Geraniol", pct: 41, color: "#38bdf8" },
];

type Mode = "neighbors" | "morph" | "compounds";

// ─── Component ───────────────────────────────────────────────────────────────

export function ProScreen() {
  const [mode, setMode] = useState<Mode>("neighbors");
  const [vegetarian, setVegetarian] = useState(false);
  const [plantBased, setPlantBased] = useState(false);
  const [morphed, setMorphed] = useState<string | null>(null);
  const [pinnedNeighbor, setPinnedNeighbor] = useState<string | null>(null);

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
        <div className="flex items-center justify-between px-5 pt-2 pb-2 flex-shrink-0">
          <button className="p-2 -ml-2" style={{ color: "rgba(255,255,255,0.5)" }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{
            background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)",
          }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: "#fbbf24" }} />
            <span className="text-xs font-semibold" style={{ color: "#fbbf24" }}>Epicure Pro</span>
          </div>
          <div className="w-9" />
        </div>

        {/* Toggles */}
        <div className="flex items-center justify-end gap-4 px-5 mb-3 flex-shrink-0">
          {[{ label: "Veg", val: vegetarian, set: setVegetarian },
            { label: "Plant", val: plantBased, set: setPlantBased }].map(({ label, val, set }) => (
            <button key={label} onClick={() => set(!val)} className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
              <div style={{ width: 36, height: 20, borderRadius: 10, background: val ? "#fbbf24" : "rgba(255,255,255,0.12)", position: "relative", transition: "background .2s" }}>
                <div style={{ position: "absolute", top: 3, left: val ? 19 : 3, width: 14, height: 14, borderRadius: 7, background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,0.4)" }} />
              </div>
            </button>
          ))}
        </div>

        {/* Base ingredient pill */}
        <div className="px-5 mb-3 flex-shrink-0">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl" style={{
            background: "rgba(251,191,36,0.07)",
            border: "1px solid rgba(251,191,36,0.18)",
          }}>
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#f97316" }} />
            <span className="text-sm font-semibold flex-1" style={{ color: "rgba(255,255,255,0.85)" }}>{BASE}</span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>base ingredient</span>
            <button>
              <X className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />
            </button>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="px-5 mb-3 flex gap-1.5 flex-shrink-0">
          {([
            { key: "neighbors", Icon: GitBranch, label: "Neighbors" },
            { key: "morph",     Icon: Shuffle,   label: "Morph" },
            { key: "compounds", Icon: Atom,       label: "Compounds" },
          ] as { key: Mode; Icon: any; label: string }[]).map(({ key, Icon, label }) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-semibold transition-all duration-200"
              style={{
                background: mode === key ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${mode === key ? "rgba(251,191,36,0.35)" : "rgba(255,255,255,0.07)"}`,
                color: mode === key ? "#fbbf24" : "rgba(255,255,255,0.4)",
              }}>
              <Icon className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Content area ── */}
        <div className="flex-1 px-5 overflow-y-auto" style={{ minHeight: 0 }}>

          {/* Neighbors */}
          {mode === "neighbors" && (
            <div className="flex flex-col gap-2">
              <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                Ingredients with similar flavour compound profiles to <span style={{ color: "#f97316" }}>Salmon</span>
              </p>
              {NEIGHBORS.map(({ name, score, shared }) => {
                const pinned = pinnedNeighbor === name;
                return (
                  <button
                    key={name}
                    onClick={() => setPinnedNeighbor(pinned ? null : name)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200"
                    style={{
                      background: pinned ? "rgba(251,191,36,0.08)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${pinned ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.07)"}`,
                    }}>
                    <div className="flex flex-col flex-1 gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>{name}</span>
                        <span className="text-xs font-bold" style={{ color: "#fbbf24" }}>{score}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                          <div className="h-full rounded-full" style={{
                            width: `${score}%`,
                            background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
                          }} />
                        </div>
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{shared} shared</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: pinned ? "#fbbf24" : "rgba(255,255,255,0.2)" }} />
                  </button>
                );
              })}

              {pinnedNeighbor && (
                <div className="mt-1 px-4 py-3 rounded-2xl" style={{
                  background: "rgba(251,191,36,0.05)",
                  border: "1px solid rgba(251,191,36,0.15)",
                }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: "#fbbf24" }}>
                    Swap {BASE} → {pinnedNeighbor}
                  </p>
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                    All current pairings recalculated for {pinnedNeighbor}. Same dish, different protein.
                  </p>
                  <button className="mt-2 flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#fbbf24" }}>
                    <Zap className="w-3 h-3" /> Apply swap
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Morph */}
          {mode === "morph" && (
            <div className="flex flex-col gap-2">
              <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                Nudge <span style={{ color: "#f97316" }}>{BASE}</span>'s flavour profile in a direction
              </p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {MORPH_TARGETS.map(({ label, direction }) => {
                  const active = morphed === direction;
                  return (
                    <button
                      key={direction}
                      onClick={() => setMorphed(active ? null : direction)}
                      className="flex items-center gap-2 px-3 py-3 rounded-2xl text-left transition-all duration-200"
                      style={{
                        background: active ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${active ? "rgba(251,191,36,0.35)" : "rgba(255,255,255,0.07)"}`,
                      }}>
                      <Sliders className="w-3.5 h-3.5 flex-shrink-0" style={{ color: active ? "#fbbf24" : "rgba(255,255,255,0.3)" }} />
                      <span className="text-xs font-medium" style={{ color: active ? "#fbbf24" : "rgba(255,255,255,0.6)" }}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {morphed && (
                <div className="px-4 py-3 rounded-2xl" style={{
                  background: "rgba(251,191,36,0.06)",
                  border: "1px solid rgba(251,191,36,0.18)",
                }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: "#fbbf24" }}>
                    {BASE} → <span style={{ textTransform: "capitalize" }}>{morphed}</span> variant
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {["Smoked paprika", "Chipotle", "Miso glaze"].map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <Plus className="w-3 h-3 flex-shrink-0" style={{ color: "#fbbf24" }} />
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>{s}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 w-full py-2 rounded-xl text-xs font-bold" style={{
                    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                    color: "#0a0a0a",
                  }}>
                    Apply morph
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Compounds */}
          {mode === "compounds" && (
            <div className="flex flex-col gap-3">
              <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                Dominant aroma compounds in <span style={{ color: "#f97316" }}>{BASE}</span>
              </p>
              {COMPOUNDS.map(({ name, pct, color }) => (
                <div key={name} className="px-4 py-3 rounded-2xl" style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>{name}</span>
                    <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${color}cc, ${color}66)`,
                    }} />
                  </div>
                </div>
              ))}

              <div className="px-4 py-3 rounded-2xl" style={{
                background: "rgba(251,191,36,0.05)",
                border: "1px solid rgba(251,191,36,0.12)",
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-3.5 h-3.5" style={{ color: "#fbbf24" }} />
                  <span className="text-xs font-semibold" style={{ color: "#fbbf24" }}>Pro insight</span>
                </div>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                  Trimethylamine drives the marine character. Pair with lemon or capers to suppress it and amplify linalool's floral notes.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Bottom CTA */}
        <div className="px-5 pb-3 pt-3 flex-shrink-0">
          <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200" style={{
            background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
            color: "#0a0a0a",
            boxShadow: "0 8px 24px rgba(251,191,36,0.28)",
          }}>
            <Sparkles className="w-4 h-4" />
            Generate Pro Recipe
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
