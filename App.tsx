import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  PenTool, 
  Upload as UploadIcon, 
  History, 
  Trash2, 
  Layers, 
  Cpu, 
  Gauge, 
  Info,
  CheckCircle2,
  Dot,
  RotateCcw,
  BookOpen
} from "lucide-react";
import DrawingCanvas from "./components/DrawingCanvas";
import ImageUploader from "./components/ImageUploader";
import ResultCard from "./components/ResultCard";
import AboutSection from "./components/AboutSection";
import { PredictionResult, HistoryItem } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"draw" | "upload">("draw");
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load prediction history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("emnist_character_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load local storage history:", e);
    }
  }, []);

  // Save prediction history to localStorage
  const saveToHistory = (image: string, res: PredictionResult) => {
    try {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        image: image,
        prediction: res.prediction,
        confidence: res.confidence,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      };
      const updated = [newItem, ...history].slice(0, 8); // Keep last 8 entries
      setHistory(updated);
      localStorage.setItem("emnist_character_history", JSON.stringify(updated));
    } catch (err) {
      console.error("Local storage sync failure:", err);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("emnist_character_history");
  };

  // Run the API prediction request
  const handlePrediction = async (imageDataUrl: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setPredictionResult(null);
    setCurrentStep(1);

    // Simulate animated step indicators reflecting EMNIST standard preprocessing pipeline
    const pipelineSteps = [
      { step: 1, delay: 250 }, // Grayscale Convert
      { step: 2, delay: 450 }, // Resize 28x28
      { step: 3, delay: 650 }, // Tensor mapping
      { step: 4, delay: 850 }, // Tensor normalize (0.5, 0.5)
      { step: 5, delay: 1000 } // Batch dimension unsqueeze
    ];

    pipelineSteps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setCurrentStep(step);
      }, delay);
    });

    try {
      const response = await fetch("/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: imageDataUrl })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Prediction request failed on neural processor server.");
      }

      const result: PredictionResult = await response.json();
      
      // Delay slightly so the user visualizes the final pipeline execution step.
      setTimeout(() => {
        setPredictionResult(result);
        setIsLoading(false);
        saveToHistory(imageDataUrl, result);
      }, 1150);

    } catch (error: any) {
      console.error("OCR prediction exception:", error);
      setTimeout(() => {
        setErrorMessage(error.message || "Unable to process image. Please try again.");
        setIsLoading(false);
      }, 1150);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Decorative ambient background top-right light accent */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-purple-600/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        
        {/* Header Hero Section */}
        <header id="applet-hero-header" className="text-center mb-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4 backdrop-blur-md select-none">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EMNIST Convolutional Neural Network (CNN)</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-tr from-white via-slate-100 to-slate-400 bg-clip-text text-transparent mb-3 font-sans">
            Handwritten Character Recognition
          </h1>
          
          <p className="text-slate-400 text-sm leading-relaxed sm:px-4">
            Upload or draw a handwritten uppercase English character to predict the target letter classes. Preprocessing conversion and softmax probabilities are executed on-the-fly.
          </p>
        </header>

        {/* Outer Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Input Selection Panels */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Navigational Selector bar */}
            <div id="input-mode-selector-tabs" className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex gap-1 select-none">
              <button
                id="select-canvas-mode-tab"
                type="button"
                onClick={() => {
                  setActiveTab("draw");
                  setErrorMessage(null);
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeTab === "draw"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                Draw Canvas
              </button>
              <button
                id="select-upload-mode-tab"
                type="button"
                onClick={() => {
                  setActiveTab("upload");
                  setErrorMessage(null);
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  activeTab === "upload"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/10"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <UploadIcon className="w-3.5 h-3.5" />
                Upload Image
              </button>
            </div>

            {/* Input card frame */}
            <div id="character-input-source-frame" className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 shadow-xl flex flex-col items-center">
              
              <div className="w-full mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${activeTab === "draw" ? "bg-blue-500 animate-pulse" : "bg-purple-500 animate-pulse"}`} />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-350">
                    Source: {activeTab === "draw" ? "Interactive Board" : "File Ingest"}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  {activeTab === "draw" ? "Draw inside target bounds" : "Upload standard vector formats"}
                </span>
              </div>

              {activeTab === "draw" ? (
                <DrawingCanvas onPredict={handlePrediction} isLoading={isLoading} />
              ) : (
                <ImageUploader onPredict={handlePrediction} isLoading={isLoading} />
              )}
            </div>

          </div>

          {/* Right Column: Processing Pipelines, Predictions AND History */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Error Message Box */}
            {errorMessage && (
              <div id="prediction-error-banner" className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-2xl flex items-start gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center mt-0.5 shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-semibold text-red-300">Model Inference Suspended</p>
                  <p className="text-red-400/90 mt-0.5 leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Loading Pipeline State Section */}
            {isLoading && (
              <div id="nn-pipeline-tracker" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                    <h3 className="font-semibold text-slate-100 text-sm">Image Preprocessing & Model Evaluation</h3>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-950/80 text-blue-300 border border-blue-800/40 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {[
                    { step: 1, title: "1. Grayscale", desc: "RGB to 8-bit" },
                    { step: 2, title: "2. Resize", desc: "To exactly 28x28" },
                    { step: 3, title: "3. Tensorize", desc: "Pixel map vector" },
                    { step: 4, title: "4. Normalize", desc: "Mean & Std dev" },
                    { step: 5, title: "5. Unsqueeze", desc: "Batch shape" }
                  ].map((p) => {
                    const isDone = currentStep > p.step;
                    const isActive = currentStep === p.step;
                    return (
                      <div 
                        key={p.step} 
                        className={`p-3 rounded-xl border flex flex-col gap-1 transition-all ${
                          isDone 
                            ? "bg-slate-950 border-emerald-500/20 text-emerald-400" 
                            : isActive 
                            ? "bg-blue-950/20 border-blue-500/40 text-blue-300 scale-[1.02] shadow-md shadow-blue-500/5 animate-pulse" 
                            : "bg-slate-950/40 border-slate-900 text-slate-500"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono tracking-wider uppercase font-extrabold">
                            {p.title}
                          </span>
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono italic mt-1 leading-snug">
                          {p.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Animated progress strip */}
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div 
                    id="pipeline-progress-percentage-strip"
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Prediction Output displays */}
            {predictionResult ? (
              <ResultCard result={predictionResult} />
            ) : (
              !isLoading && !errorMessage && (
                <div id="awaiting-input-placeholder" className="bg-slate-900 border border-slate-800/80 rounded-3xl p-10 shadow-xl flex flex-col items-center justify-center text-center gap-4 border-dashed select-none min-h-[300px]">
                  <div className="w-14 h-14 rounded-full bg-slate-850 text-slate-500 border border-slate-800/60 flex items-center justify-center">
                    <Cpu className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200 text-sm">Classification System Ready</h3>
                    <p className="text-slate-400 text-xs mt-1 max-w-sm leading-relaxed px-4 mx-auto">
                      Provide handwritten alphabet character strokes or upload an image file. The preprocessed 28x28 grayscale tensor will be fed to our trained convolutional model.
                    </p>
                  </div>
                </div>
              )
            )}

            {/* Interactive Classification History List */}
            {history.length > 0 && (
              <div id="character-classification-history-module" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-4 animate-fade-in">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 select-none">
                  <div className="flex items-center gap-2 text-slate-200">
                    <History className="w-4 h-4 text-slate-400" />
                    <h3 className="font-semibold text-xs tracking-wider uppercase font-mono">
                      Recent Classified Letters
                    </h3>
                  </div>
                  <button
                    id="clear-logs-btn"
                    type="button"
                    onClick={clearHistory}
                    className="text-[10px] font-semibold text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear History
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60 flex items-center gap-3.5 hover:border-slate-700/60 duration-250 hover:bg-slate-950/80 group"
                    >
                      {/* Character image preview thumbnail */}
                      <div className="w-10 h-10 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                        <img 
                          src={item.image} 
                          alt="Thumbnail input" 
                          referrerPolicy="no-referrer"
                          className="max-w-full max-h-full object-contain filter contrast-125"
                        />
                      </div>

                      {/* Predicted output stats */}
                      <div className="flex flex-col select-none">
                        <div className="flex items-baseline gap-1 text-indigo-400">
                          <span className="text-xl font-black font-mono leading-none group-hover:scale-105 duration-200">
                            {item.prediction}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider">
                            Class
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-350 font-mono mt-0.5">
                          {item.confidence.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Informative About Section */}
        <footer id="educational-resources-footer">
          <AboutSection />
        </footer>

      </div>
    </div>
  );
}
