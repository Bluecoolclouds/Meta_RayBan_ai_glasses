import { useEffect, useState, useRef } from "react";
import {
  Wifi, Battery, Signal, GitBranch,
  Carrot, Beef, Cake, Apple, Fish, Salad, Egg,
  Cherry, Grape, Cookie, Croissant, Pizza, IceCream,
  Sandwich, Soup, Wheat, Citrus, Banana, Nut,
} from "lucide-react";

// ─── Ingredient icon strip ────────────────────────────────────────────────────

const ICONS = [
  Carrot, Beef, Cake, Apple, Fish, Salad, Egg,
  Cherry, Grape, Cookie, Croissant, Pizza, IceCream,
  Sandwich, Soup, Wheat, Citrus, Banana, Nut,
  Carrot, Beef, Fish, Apple, Salad, Egg, Cake,
];

const LABELS = [
  "Salmon", "Lemon", "Dill", "Capers", "Cream cheese",
];

// ─── Ticker using CSS animation ───────────────────────────────────────────────
function IngredientTicker() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{
        height: 56,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker 14s linear infinite;
          display: flex;
          align-items: center;
          width: max-content;
        }
      `}</style>
      <div className="ticker-track h-full items-center" style={{ paddingTop: 4 }}>
        {[...ICONS, ...ICONS].map((Icon, i) => {
          const pos = i % ICONS.length;
          const center = ICONS.length / 2;
          const dist = Math.abs(pos - center) / center;
          const scale = 1 - dist * 0.3;
          const opacity = 1 - dist * 0.45;
          return (
            <div
              key={i}
              className="flex-shrink-0 mx-3 flex items-center justify-center"
              style={{
                transform: `scale(${scale})`,
                opacity,
                transition: "transform 0.05s linear",
              }}
            >
              <Icon
                size={26}
                strokeWidth={1.5}
                style={{ color: "hsl(90 70% 90% / 0.8)" }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Animated dots ────────────────────────────────────────────────────────────
function Dots() {
  return (
    <span className="inline-flex gap-1 ml-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{
            background: "#86efac",
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50%       { opacity: 1;    transform: scale(1.15); }
        }
      `}</style>
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function LoadingScreen() {
  const [phase, setPhase] = useState(0);
  // phases: 0=scanning compounds, 1=matching pairings, 2=ranking results
  const phases = [
    "Scanning flavour compounds",
    "Matching ingredient pairs",
    "Ranking by harmony score",
  ];

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % phases.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "#111" }}
    >
      {/* Phone frame */}
      <div
        className="relative overflow-hidden flex flex-col"
        style={{
          width: 390, height: 844,
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

        {/* Centre content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">

          {/* Orbital animation */}
          <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full" style={{
              border: "1.5px solid rgba(134,239,172,0.15)",
              animation: "spin 8s linear infinite",
            }} />
            {/* Middle ring */}
            <div className="absolute rounded-full" style={{
              inset: 20,
              border: "1.5px dashed rgba(134,239,172,0.1)",
              animation: "spin 5s linear infinite reverse",
            }} />
            {/* Inner glow */}
            <div className="absolute rounded-full" style={{
              inset: 44,
              background: "radial-gradient(circle, rgba(134,239,172,0.18) 0%, transparent 70%)",
              animation: "breathe 2s ease-in-out infinite",
            }} />
            {/* Centre icon */}
            <GitBranch
              size={32}
              strokeWidth={1.5}
              style={{ color: "#86efac", position: "relative", zIndex: 2 }}
            />
            {/* Orbiting dots */}
            {[0, 72, 144, 216, 288].map((deg, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  width: 6, height: 6,
                  borderRadius: "50%",
                  background: "#86efac",
                  opacity: 0.5 + i * 0.1,
                  top: "50%", left: "50%",
                  transformOrigin: "0 0",
                  transform: `rotate(${deg}deg) translateX(65px)`,
                  animation: `orbit 3s linear ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>

          <style>{`
            @keyframes spin    { to { transform: rotate(360deg); } }
            @keyframes breathe { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.12)} }
            @keyframes orbit   { to { transform: rotate(360deg) translateX(65px); } }
          `}</style>

          {/* Status text */}
          <div className="text-center">
            <p className="text-base font-semibold mb-1.5 flex items-center justify-center gap-1"
              style={{ color: "rgba(255,255,255,0.85)" }}>
              Finding Pairings
              <Dots />
            </p>
            <p
              className="text-sm transition-all duration-500"
              style={{ color: "rgba(255,255,255,0.35)" }}
              key={phase}
            >
              {phases[phase]}
            </p>
          </div>

          {/* Selected ingredients */}
          <div className="w-full px-2">
            <p className="text-[11px] text-center mb-3 font-medium" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>
              ANALYSING
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {LABELS.map((label, i) => (
                <div
                  key={label}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: "rgba(134,239,172,0.08)",
                    border: "1px solid rgba(134,239,172,0.18)",
                    color: "#86efac",
                    animation: `fadeIn 0.4s ease ${i * 0.1}s both`,
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
            <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
          </div>
        </div>

        {/* Bottom ticker */}
        <div className="px-5 pb-5 flex-shrink-0">
          <IngredientTicker />
          <p className="text-center text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.18)" }}>
            Epicure MCP · Flavour graph engine
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
