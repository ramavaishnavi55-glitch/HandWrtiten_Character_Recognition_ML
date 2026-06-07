import React from "react";
import { Award, ListOrdered, Percent, Sparkles } from "lucide-react";
import { PredictionResult } from "../types";

interface ResultCardProps {
  result: PredictionResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const { prediction, confidence, top_predictions } = result;

  return (
    <div id="prediction-result-visualization-card" className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 animate-fade-in">
      
      {/* Primary result header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-100 text-lg">CNN Classification Result</h3>
          <p className="text-xs text-slate-400">EMNIST standard softmax model outputs</p>
        </div>
      </div>

      {/* Main classification layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-950 p-5 rounded-2xl border border-slate-900">
        
        {/* Big visual predicted letter */}
        <div id="predicted-character-giant-display" className="flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-900/80 pb-5 sm:pb-0 sm:pr-5 select-none">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 mb-1.5 font-semibold">
            Predicted Character
          </span>
          <div className="relative flex items-center justify-center">
            {/* Soft background blue glow */}
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full w-24 h-24 mx-auto" />
            <span className="relative text-8xl font-black bg-gradient-to-tr from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent transform hover:scale-110 duration-300 font-mono">
              {prediction}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-4 uppercase tracking-wider">
            Predicted Label (A–Z)
          </span>
        </div>

        {/* Core confidence progress details */}
        <div id="confidence-bar-gauges-section" className="flex flex-col justify-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-semibold">
              Confidence Score
            </span>
            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {confidence.toFixed(2)}
              </span>
              <span className="text-xl font-bold bg-gradient-to-tr from-purple-400 to-indigo-400 bg-clip-text text-transparent font-mono">%</span>
            </div>
          </div>

          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              id="top-prediction-percentage-fill"
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed italic">
            Computed by mapping the logits vector from our fully connected hidden layer to an exponential probability vector using PyTorch Softmax.
          </p>
        </div>

      </div>

      {/* Top 3 Predictions Rank Table */}
      <div id="top-predictions-rank-table" className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-slate-300 text-xs font-mono font-semibold uppercase tracking-wider pl-1">
          <ListOrdered className="w-4 h-4 text-indigo-400" />
          <span>Top 3 Probabilities Distribution</span>
        </div>

        <div className="flex flex-col gap-2">
          {top_predictions.map(([className, probability], index) => {
            return (
              <div
                key={className}
                id={`prediction-rank-row-${index}`}
                className="flex items-center justify-between gap-4 bg-slate-950 px-4 py-3 rounded-xl border border-slate-900/60 transition-all hover:bg-slate-900/50"
              >
                {/* Visual rank Badge & Symbol */}
                <div className="flex items-center gap-3 select-none">
                  <span className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center border ${
                    index === 0 
                      ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                      : index === 1 
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                      : "bg-slate-800 text-slate-400 border-transparent"
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-extrabold text-sm text-slate-200 font-mono">
                    Character {className}
                  </span>
                </div>

                {/* Percentage bar & score */}
                <div className="flex items-center gap-3 flex-grow max-w-[140px] sm:max-w-xs justify-end">
                  <div className="hidden sm:block w-24 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        index === 0 
                          ? "bg-blue-500" 
                          : index === 1 
                          ? "bg-indigo-500" 
                          : "bg-purple-500"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, probability))}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-300 min-w-[55px] text-right">
                    {probability.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
