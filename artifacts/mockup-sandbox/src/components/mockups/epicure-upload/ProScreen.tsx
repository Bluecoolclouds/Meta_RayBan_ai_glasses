import { useState } from "react";
import {
  ChevronLeft, Wifi, Battery, Signal,
  Sparkles, GitBranch, Shuffle, MapPin, Zap, Plus, X,
  ArrowRight, Sliders, BarChart3, Globe,
} from "lucide-react";

const BASE = "Salmon";

const NEIGHBORS = [
  { name: "Red Snapper", sim: 0.312, label: "p75+" },
  { name: "Crab",        sim: 0.305, label: "p75+" },
  { name: "Mackerel",    sim: 0.303, label: "p75+" },
  { name: "Ponzu",       sim: 0.298, label: "p75+" },
];

const MORPH_TARGETS = [
  { label: "More savory",  axis: "cf_savory",  emoji: "🧂" },
  { label: "Smoky",        axis: "cf_woody",   emoji: "🪵" },
  { label: "Spicier",      axis: "cf_spicy",   emoji: "🌶️" },
  { label: "More citrus",  axis: "cf_citrus",  emoji: "🍋" },
  { label: "Sweeter",      axis: "cf_sweet",   emoji: "🍯" },
  { label: "Herbaceous",   axis: "cf_green",   emoji: "🌿" },
];

const MORPH_RESULTS: Record<string, string[]> = {
  cf_savory:  ["Soy sauce", "Mirin", "Bonito flakes", "Ponzu", "Mentsuyu"],
  cf_woody:   ["Smoked paprika", "Chipotle", "Liquid smoke", "Mesquite", "Alder"],
  cf_spicy:   ["Gochujang", "Jalapeño", "Sriracha", "Cayenne", "Chili flakes"],
  cf_citrus:  ["Yuzu", "Lemon zest", "Lime leaf", "Bergamot", "Grapefruit"],
  cf_sweet:   ["Orange", "Mango", "Honey glaze", "Teriyaki", "Cherry"],
  cf_green:   ["Dill", "Tarragon", "Chervil", "Sorrel", "Green onion"],
};

const ATLAS_FACTORS = [
  { label: "Cuisine identity", axis: "Indonesian vs Other", side: "B", pct: 28, note: "Universal / non-regional" },
  { label: "Processing level", axis: "Processed vs Artisanal", side: "A", pct: 74, note: "Lean artisanal / natural" },
  { label: "Flavour cluster",  axis: "Savory Meal Components", side: "A", pct: 84, note: "Mediterranean dominant" },
];

const ATLAS_NEIGHBORS = [
  { name: "Scallop", dist: 0.087, region: "Universal", group: "Seafood" },
  { name: "Oyster",  dist: 0.087, region: "Universal", group: "Seafood" },
  { name: "Crab",    dist: 0.098, region: "Universal", group: "Seafood" },
  { name: "Cod",     dist: 0.133, region: "Universal", group: "Fish"    },
];

type Mode = "neighbors" | "morph" | "atlas";

export function ProScreen() {
  const [mode, setMode] = useState<Mode>("neighbors");
  const [vegetarian, setVegetarian] = useState(false);
  const [plantBased, setPlantBased] = useState(false);
  const [morphed, setMorphed] = useState<string | null>(null);
  const [pinnedNeighbor, setPinnedNeighbor] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "#111" }}>

      <div className="relative overflow-hidden flex flex-col"
        style={{
          width: 390, height: 844, borderRadius: 48,
          background: "#0a0a0a", border: "10px solid #1c1c1c",
          boxShadow: "0 40px 80px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}>

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

        <div className="px-5 mb-3 flex gap-1.5 flex-shrink-0">
          {([
            { key: "neighbors", Icon: GitBranch, label: "Neighbors" },
            { key: "morph",     Icon: Shuffle,   label: "Morph" },
            { key: "atlas",     Icon: Globe,      label: "Atlas" },
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

        <div className="flex-1 px-5 overflow-y-auto" style={{ minHeight: 0 }}>

          {mode === "neighbors" && (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                via <code style={{ color: "rgba(251,191,36,0.6)" }}>neighbors(salmon, top_k=4)</code> — cosine similarity
              </p>
              {NEIGHBORS.map(({ name, sim, label }) => {
                const pinned = pinnedNeighbor === name;
                const barW = Math.round((sim / 0.6) * 100);
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
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>sim {sim}</span>
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{
                            background: "rgba(251,191,36,0.1)",
                            border: "1px solid rgba(251,191,36,0.2)",
                            color: "#fbbf24",
                          }}>{label}</span>
                        </div>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                        <div className="h-full rounded-full" style={{
                          width: `${barW}%`,
                          background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
                        }} />
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

          {mode === "morph" && (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                via <code style={{ color: "rgba(251,191,36,0.6)" }}>morph(seed, target: direction, angle_deg=30)</code>
              </p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {MORPH_TARGETS.map(({ label, axis, emoji }) => {
                  const active = morphed === axis;
                  return (
                    <button
                      key={axis}
                      onClick={() => setMorphed(active ? null : axis)}
                      className="flex items-center gap-2 px-3 py-3 rounded-2xl text-left transition-all duration-200"
                      style={{
                        background: active ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${active ? "rgba(251,191,36,0.35)" : "rgba(255,255,255,0.07)"}`,
                      }}>
                      <span className="text-base">{emoji}</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium" style={{ color: active ? "#fbbf24" : "rgba(255,255,255,0.6)" }}>
                          {label}
                        </span>
                        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>{axis}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {morphed && (
                <div className="px-4 py-3 rounded-2xl" style={{
                  background: "rgba(251,191,36,0.06)",
                  border: "1px solid rgba(251,191,36,0.18)",
                }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: "#fbbf24" }}>
                    {BASE} nudged toward <code style={{ fontSize: 10 }}>{morphed}</code>
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {(MORPH_RESULTS[morphed] ?? []).map((s) => (
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

          {mode === "atlas" && (
            <div className="flex flex-col gap-3">
              <p className="text-[10px] mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                via <code style={{ color: "rgba(251,191,36,0.6)" }}>where_on_atlas + ingredient_on_factor</code>
              </p>

              <div className="px-4 py-3 rounded-2xl" style={{
                background: "rgba(251,191,36,0.05)",
                border: "1px solid rgba(251,191,36,0.18)",
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-3.5 h-3.5" style={{ color: "#fbbf24" }} />
                  <span className="text-xs font-semibold" style={{ color: "#fbbf24" }}>Atlas Position</span>
                  <span className="ml-auto text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>xy [6.07, 7.39]</span>
                </div>
                <div className="flex gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>🐟 Fish</span>
                  <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>🌍 Universal</span>
                </div>
              </div>

              <p className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>ICA Factor Axes</p>

              {ATLAS_FACTORS.map(({ label, axis, side, pct, note }) => (
                <div key={label} className="px-4 py-3 rounded-2xl" style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.8)" }}>{label}</span>
                    <span className="text-xs font-bold" style={{ color: "#fbbf24" }}>Side {side} · {pct}th pct</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div className="h-full rounded-full" style={{
                      width: `${pct}%`,
                      background: "linear-gradient(90deg, #fbbf24cc, #f59e0b66)",
                    }} />
                  </div>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>{axis} — {note}</p>
                </div>
              ))}

              <p className="text-[10px] font-semibold mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>2D Atlas Neighbors</p>
              <div className="flex flex-col gap-1.5">
                {ATLAS_NEIGHBORS.map(({ name, dist, region, group }) => (
                  <div key={name} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <span className="text-xs font-medium flex-1" style={{ color: "rgba(255,255,255,0.7)" }}>{name}</span>
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{group}</span>
                    <span className="text-[10px] font-mono" style={{ color: "rgba(251,191,36,0.6)" }}>{dist}</span>
                  </div>
                ))}
              </div>

              <div className="px-4 py-3 rounded-2xl" style={{
                background: "rgba(251,191,36,0.05)",
                border: "1px solid rgba(251,191,36,0.12)",
              }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <BarChart3 className="w-3.5 h-3.5" style={{ color: "#fbbf24" }} />
                  <span className="text-xs font-semibold" style={{ color: "#fbbf24" }}>Pro insight</span>
                </div>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                  Salmon sits at p74 on the Artisanal axis and clusters tightly with universal seafood. Pair with Japanese cf_ directions for the strongest cultural lift.
                </p>
              </div>
            </div>
          )}

        </div>

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

        <div className="flex-shrink-0 pb-2 flex justify-center">
          <div className="rounded-full" style={{ width: 120, height: 5, background: "rgba(255,255,255,0.25)" }} />
        </div>
      </div>
    </div>
  );
}
