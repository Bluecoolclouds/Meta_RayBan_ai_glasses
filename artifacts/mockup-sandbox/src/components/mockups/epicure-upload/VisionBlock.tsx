import { useState, useRef } from "react";
import { Eye, Sparkles, Upload, X } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: "#0a0a0a" }}>
      <div className="w-full max-w-3xl">

        {/* Vision Block */}
        <div
          className="relative rounded-2xl p-1 transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div className="flex flex-row h-[72px] items-center gap-0">

            {/* Left — Vision BETA */}
            <div className="w-[30%] flex items-center justify-center">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium select-none"
                style={{
                  background: "rgba(134,239,172,0.08)",
                  color: "#86efac",
                  border: "1px solid rgba(134,239,172,0.15)",
                }}
              >
                <Eye className="w-4 h-4" />
                Vision
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(134,239,172,0.12)",
                    color: "#86efac",
                    border: "1px solid rgba(134,239,172,0.2)",
                    letterSpacing: "0.05em",
                  }}
                >
                  BETA
                </span>
              </div>
            </div>

            {/* Middle — Drop zone */}
            <div className="flex-1 px-1">
              <div
                className="h-[56px] rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 relative overflow-hidden group"
                style={{
                  border: isDragging
                    ? "2px dashed rgba(134,239,172,0.5)"
                    : "2px dashed rgba(255,255,255,0.15)",
                  background: isDragging
                    ? "rgba(134,239,172,0.04)"
                    : image
                    ? "rgba(134,239,172,0.06)"
                    : "transparent",
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
                  <div className="flex items-center gap-2 px-4">
                    <img
                      src={image}
                      alt="preview"
                      className="h-9 w-9 rounded-lg object-cover"
                      style={{ border: "1px solid rgba(134,239,172,0.3)" }}
                    />
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-medium" style={{ color: "#86efac" }}>
                        {fileName}
                      </span>
                      <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                        Ready to analyse
                      </span>
                    </div>
                    <button
                      onClick={clear}
                      className="ml-2 p-1 rounded-full transition-colors"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center leading-tight">
                    <div className="flex items-center gap-1.5">
                      <Upload
                        className="w-3.5 h-3.5 transition-colors"
                        style={{ color: isDragging ? "#86efac" : "rgba(255,255,255,0.5)" }}
                      />
                      <span
                        className="text-sm font-medium transition-colors"
                        style={{ color: isDragging ? "#86efac" : "rgba(255,255,255,0.75)" }}
                      >
                        Drop image here
                      </span>
                    </div>
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                      a photo of your fridge or shopping haul
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right — Analyse button */}
            <div className="w-[25%] flex items-center justify-center px-1">
              <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95"
                style={{
                  background: image
                    ? "linear-gradient(135deg, #4ade80, #22c55e)"
                    : "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.07))",
                  color: image ? "#0a0a0a" : "rgba(255,255,255,0.6)",
                  border: image
                    ? "none"
                    : "1px solid rgba(255,255,255,0.12)",
                  boxShadow: image ? "0 4px 20px rgba(74,222,128,0.3)" : "none",
                  cursor: image ? "pointer" : "default",
                }}
              >
                <Sparkles className="w-4 h-4" />
                Analyse
              </button>
            </div>

          </div>
        </div>

        {/* Hint text */}
        <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.25)" }}>
          Upload a photo of your fridge, pantry, or market haul to identify ingredients
        </p>

      </div>
    </div>
  );
}
