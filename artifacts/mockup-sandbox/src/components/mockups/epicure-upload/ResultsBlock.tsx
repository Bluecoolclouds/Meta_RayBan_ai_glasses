import { useState } from "react";
import { ChevronLeft, Wifi, Battery, Signal, Sparkles, Search, RefreshCw, GitBranch } from "lucide-react";

const DETECTED = ["Salmon", "Lemon", "Dill", "Capers", "Cream cheese"];

const PAIRINGS: Record<string, { items: string[]; color: string }> = {
  Salmon: {
    color: "#f97316",
    items: ["Dill", "Lemon", "Capers", "White wine", "Crème fraîche", "Beetroot", "Avocado"],
  },
  Lemon: {
    color: "#eab308",
    items: ["Thyme", "Ginger", "Capers", "Parsley", "Olive oil", "Garlic", "Honey"],
  },
  Dill: {
    color: "#22c55e",
    items: ["Salmon", "Cucumber", "Yogurt", "Mustard", "Beetroot", "Cream cheese"],
  },
  Capers: {
    color: "#a78bfa",
    items: ["Salmon", "Lemon", "Anchovies", "Olives", "Tuna", "Tomato"],
  },
  "Cream cheese": {
    color: "#f9a8d4",
    items: ["Smoked salmon", "Dill", "Chives", "Lemon zest", "Honey", "Walnuts"],
  },
};

const FILTERS = [
  { label: "All", active: true },
  { label: "Popular", icon: <Sparkles className="w-3 h-3" /> },
  { label: "Graph", icon: <GitBranch className="w-3 h-3" /> },
];

export function ResultsBlock() {
  const [selected, setSelected] = useState("Salmon");
  const [activeFilter, setActiveFilter] = useState("All");
  const current = PAIRINGS[selected];

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
          <button className="p-2 -ml-2 rounded-full" style={{ color: "rgba(255,255,255,0.6)" }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>Flavour Pairings</span>
          <button className="p-2 -mr-2 rounded-full" style={{ color: "rgba(255,255,255,0.4)" }}>
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Detected ingredients */}
        <div className="px-5 mb-3 flex-shrink-0">
          <p className="text-xs mb-2 font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
            DETECTED INGREDIENTS
          </p>
          <div className="flex flex-wrap gap-2">
            {DETECTED.map((ing) => (
              <button
                key={ing}
                onClick={() => setSelected(ing)}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
                style={{
                  background: selected === ing
                    ? PAIRINGS[ing].color + "22"
                    : "rgba(255,255,255,0.06)",
                  border: `1px solid ${selected === ing ? PAIRINGS[ing].color + "55" : "rgba(255,255,255,0.1)"}`,
                  color: selected === ing ? PAIRINGS[ing].color : "rgba(255,255,255,0.55)",
                  boxShadow: selected === ing ? `0 0 12px ${PAIRINGS[ing].color}22` : "none",
                }}
              >
                {ing}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 mb-3 flex-shrink-0" style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* Filter row */}
        <div className="px-5 mb-3 flex items-center gap-2 flex-shrink-0">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                background: activeFilter === f.label
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${activeFilter === f.label ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}`,
                color: activeFilter === f.label ? "#fff" : "rgba(255,255,255,0.4)",
              }}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
          {/* Rainbow "More" */}
          <button
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              background: "linear-gradient(75deg, rgba(149,3,3,0.2), rgba(149,106,3,0.2), rgba(38,149,3,0.2), rgba(3,123,149,0.2), rgba(89,3,149,0.2))",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            More
          </button>
        </div>

        {/* Pairing graph — visual node map */}
        <div className="flex-1 mx-5 mb-3 rounded-2xl relative overflow-hidden" style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.06)",
          minHeight: 0,
        }}>
          {/* Central node */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Glow */}
            <div className="absolute rounded-full" style={{
              width: 140, height: 140,
              background: `radial-gradient(circle, ${current.color}18 0%, transparent 70%)`,
            }} />
            {/* Center circle */}
            <div
              className="absolute z-10 rounded-full flex items-center justify-center text-xs font-bold text-center px-2"
              style={{
                width: 72, height: 72,
                background: `${current.color}22`,
                border: `2px solid ${current.color}66`,
                color: current.color,
                boxShadow: `0 0 20px ${current.color}33`,
              }}
            >
              {selected.split(" ")[0]}
            </div>

            {/* Satellite nodes */}
            {current.items.map((item, i) => {
              const total = current.items.length;
              const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
              const r = 105;
              const cx = Math.cos(angle) * r;
              const cy = Math.sin(angle) * r;
              return (
                <div key={item}>
                  {/* Line */}
                  <svg
                    className="absolute"
                    style={{
                      left: "50%", top: "50%",
                      width: 0, height: 0,
                      overflow: "visible",
                      pointerEvents: "none",
                    }}
                  >
                    <line
                      x1={0} y1={0}
                      x2={cx} y2={cy}
                      stroke={current.color}
                      strokeWidth={1}
                      strokeOpacity={0.2}
                    />
                  </svg>
                  {/* Node */}
                  <div
                    className="absolute rounded-full flex items-center justify-center text-[9px] font-semibold text-center"
                    style={{
                      width: 46, height: 46,
                      left: `calc(50% + ${cx}px - 23px)`,
                      top: `calc(50% + ${cy}px - 23px)`,
                      background: "rgba(255,255,255,0.06)",
                      border: `1px solid ${current.color}33`,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {item.split(" ")[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pairing list */}
        <div className="px-5 mb-3 flex-shrink-0">
          <p className="text-xs mb-2 font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
            TOP PAIRINGS FOR <span style={{ color: current.color }}>{selected.toUpperCase()}</span>
          </p>
          <div className="flex flex-col gap-1.5">
            {current.items.slice(0, 4).map((item, i) => (
              <div
                key={item}
                className="flex items-center gap-3 px-3 py-2 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span className="text-xs font-bold w-5 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {i + 1}
                </span>
                <span className="text-sm font-medium flex-1" style={{ color: "rgba(255,255,255,0.8)" }}>
                  {item}
                </span>
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${72 - i * 14}px`,
                    background: `linear-gradient(90deg, ${current.color}99, ${current.color}44)`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex-shrink-0 pb-2 flex justify-center">
          <div className="rounded-full" style={{ width: 120, height: 5, background: "rgba(255,255,255,0.25)" }} />
        </div>
      </div>
    </div>
  );
}
