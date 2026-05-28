import { useState, useRef } from "react";
import { Eye, Sparkles, Camera, Image, X, ChevronLeft, Wifi, Battery, Signal } from "lucide-react";

export function VisionBlock() {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFileName(file.name);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setImage(URL.createObjectURL(file));
    }
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(null);
    setFileName(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "#111" }}>

      {/* Phone frame */}
      <div
        className="relative overflow-hidden"
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
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>9:41</span>
          <div
            className="w-24 h-6 rounded-full"
            style={{
              background: "#0a0a0a",
              border: "1.5px solid #222",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: 12,
            }}
          />
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.9)" }} />
            <Wifi className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.9)" }} />
            <Battery className="w-4 h-4" style={{ color: "rgba(255,255,255,0.9)" }} />
          </div>
        </div>

        {/* Top nav */}
        <div className="flex items-center justify-between px-5 pt-2 pb-3">
          <button className="p-2 -ml-2 rounded-full" style={{ color: "rgba(255,255,255,0.6)" }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{
                background: "rgba(134,239,172,0.08)",
                border: "1px solid rgba(134,239,172,0.18)",
              }}
            >
              <Eye className="w-3.5 h-3.5" style={{ color: "#86efac" }} />
              <span className="text-xs font-semibold" style={{ color: "#86efac" }}>Vision</span>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(134,239,172,0.15)",
                  color: "#86efac",
                  letterSpacing: "0.06em",
                }}
              >BETA</span>
            </div>
          </div>
          <div className="w-9" />
        </div>

        {/* Title */}
        <div className="px-6 mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: "#fff" }}>
            Identify Ingredients
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Photo your fridge, pantry, or shopping haul
          </p>
        </div>

        {/* Main drop / preview area */}
        <div className="px-5 mb-4">
          <div
            className="relative w-full rounded-3xl flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all duration-300"
            style={{
              height: 280,
              border: isDragging
                ? "2px dashed rgba(134,239,172,0.6)"
                : image
                ? "2px solid rgba(134,239,172,0.25)"
                : "2px dashed rgba(255,255,255,0.12)",
              background: isDragging
                ? "rgba(134,239,172,0.05)"
                : image
                ? "transparent"
                : "rgba(255,255,255,0.03)",
            }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !image && fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />

            {image ? (
              <>
                <img
                  src={image}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradient */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(10,10,10,0.6) 0%, transparent 40%)" }}
                />
                {/* Clear btn */}
                <button
                  onClick={clear}
                  className="absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-sm"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fff",
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
                {/* File name */}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {fileName}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <Image className="w-7 h-7" style={{ color: "rgba(255,255,255,0.4)" }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium mb-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Drop image here
                  </p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                    or tap to browse
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Or use camera */}
        <div className="px-5 mb-5">
          <button
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl transition-all duration-200 active:scale-98"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            <Camera className="w-4 h-4" />
            <span className="text-sm font-medium">Use glasses camera</span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full ml-1"
              style={{
                background: "rgba(96,165,250,0.12)",
                border: "1px solid rgba(96,165,250,0.2)",
                color: "#93c5fd",
              }}
            >
              Ray-Ban
            </span>
          </button>
        </div>

        {/* Analyse button */}
        <div className="px-5">
          <button
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-bold transition-all duration-300 active:scale-97"
            style={{
              background: image
                ? "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)"
                : "rgba(255,255,255,0.07)",
              color: image ? "#0a0a0a" : "rgba(255,255,255,0.25)",
              border: image ? "none" : "1px solid rgba(255,255,255,0.08)",
              boxShadow: image ? "0 8px 30px rgba(74,222,128,0.35)" : "none",
              cursor: image ? "pointer" : "default",
              pointerEvents: image ? "auto" : "none",
            }}
          >
            <Sparkles className="w-5 h-5" />
            Analyse Ingredients
          </button>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-xs mt-4 px-6" style={{ color: "rgba(255,255,255,0.2)" }}>
          Powered by Gemini Vision · Epicure MCP
        </p>

        {/* Home indicator */}
        <div
          className="absolute bottom-2 left-1/2 rounded-full"
          style={{
            width: 120,
            height: 5,
            transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.25)",
          }}
        />
      </div>
    </div>
  );
}
