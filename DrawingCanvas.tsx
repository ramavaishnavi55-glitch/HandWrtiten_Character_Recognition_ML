import React, { useRef, useState, useEffect } from "react";
import { Trash2, Edit2, Eraser, Sparkles, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface DrawingCanvasProps {
  onPredict: (imageDataUrl: string) => void;
  isLoading: boolean;
}

export default function DrawingCanvas({ onPredict, isLoading }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState<number>(14);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  // Default to chalkboard (white stroke on black paper like EMNIST standard)
  const [canvasMode, setCanvasMode] = useState<"chalkboard" | "paper">("chalkboard");

  // Keep track of coordinates to handle drawing velocity/curves
  const lastXRef = useRef<number>(0);
  const lastYRef = useRef<number>(0);

  // Set up high-contrast default background color inside the canvas bounds
  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Standard scale matches 280x280
    ctx.fillStyle = canvasMode === "chalkboard" ? "#0f172a" : "#f8fafc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Re-render when mode changes
  useEffect(() => {
    resetCanvas();
  }, [canvasMode]);

  // Support responsive resize alignment
  useEffect(() => {
    resetCanvas();
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // Scale local calculations mapped to coordinate space 280x280
    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      const touch = e.touches[0];
      return {
        x: ((touch.clientX - rect.left) / rect.width) * canvas.width,
        y: ((touch.clientY - rect.top) / rect.height) * canvas.height,
      };
    } else {
      return {
        x: ((e.clientX - rect.left) / rect.width) * canvas.width,
        y: ((e.clientY - rect.top) / rect.height) * canvas.height,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent default mobile touch scrolling
    if (e.cancelable) e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coords = getCoordinates(e);
    lastXRef.current = coords.x;
    lastYRef.current = coords.y;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const coords = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(lastXRef.current, lastYRef.current);
    ctx.lineTo(coords.x, coords.y);

    // EMNIST expects solid strokes
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;

    if (isEraser) {
      ctx.strokeStyle = canvasMode === "chalkboard" ? "#0f172a" : "#f8fafc";
    } else {
      ctx.strokeStyle = canvasMode === "chalkboard" ? "#ffffff" : "#0f172a";
    }

    ctx.stroke();

    lastXRef.current = coords.x;
    lastYRef.current = coords.y;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Convert Drawn canvas to base64 and fire onPredict
  const handlePredictClick = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if user actually drew anything (does canvas only container the background?)
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // Detect if canvas is completely empty (all pixels are background color)
    let hasStrokes = false;
    const bgR = canvasMode === "chalkboard" ? 15 : 248;
    const bgG = canvasMode === "chalkboard" ? 23 : 250;
    const bgB = canvasMode === "chalkboard" ? 42 : 252;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i+1];
      const b = data[i+2];
      
      // If some pixels significantly differ from the background
      if (Math.abs(r - bgR) > 10 || Math.abs(g - bgG) > 10 || Math.abs(b - bgB) > 10) {
        hasStrokes = true;
        break;
      }
    }

    if (!hasStrokes) {
      alert("Please draw an uppercase English character first!");
      return;
    }

    // Capture Base64 JPG/PNG representation to send
    const dataUrl = canvas.toDataURL("image/png");
    onPredict(dataUrl);
  };

  return (
    <div id="drawing-canvas-control-container" className="flex flex-col items-center gap-6" ref={containerRef}>
      {/* Canvas Frame with glowing effect in high-tech theme */}
      <div className="relative group rounded-2xl p-1.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-2xl transition-all duration-300 hover:scale-[1.01]">
        <canvas
          id="character-drawing-viewport"
          ref={canvasRef}
          width={280}
          height={280}
          className="rounded-xl cursor-crosshair touch-none overflow-hidden max-w-[280px] max-h-[280px]"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {/* Absolute indicators */}
        <div className="absolute top-3 right-3 select-none flex space-x-2">
          <span className="text-[10px] font-mono tracking-wider bg-slate-900/80 backdrop-blur-md text-slate-300 py-1 px-2.5 rounded-full border border-slate-700/50 uppercase">
            {canvasMode} Mode
          </span>
          <span className="text-[10px] font-mono tracking-wider bg-indigo-900/80 backdrop-blur-md text-indigo-200 py-1 px-2.5 rounded-full border border-indigo-700/50">
            280x280
          </span>
        </div>
      </div>

      {/* Control Utility Toolbar */}
      <div id="canvas-toolbar" className="w-full max-w-[320px] bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4">
        {/* Toggle Mode and Tools Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Draw Pencil */}
            <button
              id="tool-select-pencil"
              type="button"
              onClick={() => setIsEraser(false)}
              className={`p-2.5 rounded-xl transition-all ${
                !isEraser 
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/40" 
                  : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
              title="Draw Tool"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            {/* Eraser */}
            <button
              id="tool-select-eraser"
              type="button"
              onClick={() => setIsEraser(true)}
              className={`p-2.5 rounded-xl transition-all ${
                isEraser 
                  ? "bg-purple-600/20 text-purple-400 border border-purple-500/40" 
                  : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-transparent"
              }`}
              title="Eraser Tool"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>

          {/* Preset Canvas Styles */}
          <div className="flex items-center bg-slate-800 rounded-xl p-1 gap-1">
            <button
              id="canvas-style-dark"
              type="button"
              onClick={() => setCanvasMode("chalkboard")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                canvasMode === "chalkboard"
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Chalk
            </button>
            <button
              id="canvas-style-light"
              type="button"
              onClick={() => setCanvasMode("paper")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                canvasMode === "paper"
                  ? "bg-slate-200 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-250"
              }`}
            >
              Ink
            </button>
          </div>
        </div>

        {/* Brush Size Adjustment */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Stroke Size</span>
            <span className="text-slate-300 font-semibold">{brushSize}px</span>
          </div>
          <input
            id="stroke-thickness-slider"
            type="range"
            min={8}
            max={28}
            step={2}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Core Buttons */}
        <div className="flex gap-2.5 pt-1">
          {/* Clear Canvas */}
          <button
            id="clear-slate-btn"
            type="button"
            onClick={resetCanvas}
            className="flex-1 py-3 px-4 rounded-xl font-medium text-xs bg-slate-800 text-slate-300 hover:bg-slate-700/80 transition-all border border-slate-700/30 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Canvas
          </button>

          {/* Trigger Predict API */}
          <button
            id="classify-drawing-btn"
            type="button"
            disabled={isLoading}
            onClick={handlePredictClick}
            className="flex-2 py-3 px-4 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Inference...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Predict Character
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
