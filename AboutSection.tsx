import React from "react";
import { Cpu, Library, GraduationCap, Globe2, Layers, CheckCircle2, Zap } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about-the-project-section" className="w-full bg-slate-900 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-xl mt-6">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/20">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            About This Neural Infrastructure
          </h2>
          <p className="text-xs text-slate-400">
            Learn the mathematical and computational layers powering handwritten recognition.
          </p>
        </div>
      </div>

      {/* Grid Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CNN Architecture */}
        <div id="card-cnn-explanation" className="bg-slate-950 p-5 rounded-2xl border border-slate-800/60 flex flex-col gap-3 hover:border-slate-700/60 transition-all group">
          <div className="flex items-center gap-2.5 text-blue-400">
            <Cpu className="w-4 h-4" />
            <h3 className="font-semibold text-sm text-slate-100 group-hover:text-blue-300 transition-colors">
              Convolutional Neural Networks (CNNs)
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Unlike standard feed-forward networks, CNNs are biologically inspired models engineered specifically for grid-structured topological data like images.
          </p>
          <div className="bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-800/80">
            <h4 className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Structural Layers
            </h4>
            <ul className="text-[11px] font-mono text-slate-400 space-y-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Convolutional filters learn local edges & curves
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                MaxPooling aggregates spatial invariance
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Linear layers output 26 softmax probabilities
              </li>
            </ul>
          </div>
        </div>

        {/* EMNIST Letters Dataset */}
        <div id="card-emnist-explanation" className="bg-slate-950 p-5 rounded-2xl border border-slate-800/60 flex flex-col gap-3 hover:border-slate-700/60 transition-all group">
          <div className="flex items-center gap-2.5 text-indigo-400">
            <Library className="w-4 h-4" />
            <h3 className="font-semibold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">
              The EMNIST Letters Dataset
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            An extension of the classic MNIST digits database, EMNIST (Extended MNIST) contains hand-drawn images of the English alphabet.
          </p>
          <div className="bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-800/80">
            <h4 className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              EMNIST Core Spec
            </h4>
            <ul className="text-[11px] font-mono text-slate-400 space-y-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Image Resolution: 28 x 28 pixels (784 features)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Target Classes: 26 (A-Z uppercase / balanced)
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Single channel 8-bit grayscaled tensors
              </li>
            </ul>
          </div>
        </div>

        {/* Deep Learning Pipeline */}
        <div id="card-dl-pipeline-explanation" className="bg-slate-950 p-5 rounded-2xl border border-slate-800/60 flex flex-col gap-3 hover:border-slate-700/60 transition-all group">
          <div className="flex items-center gap-2.5 text-purple-400">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="font-semibold text-sm text-slate-100 group-hover:text-purple-300 transition-colors">
              The Preprocessing Pipeline
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Raw drawn inputs or files require standard algebraic normalization to align with standard training hyperparameters:
          </p>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 font-mono text-[10px] text-slate-400 space-y-1.5">
            <div>
              <span className="text-blue-400 font-semibold">1. Grayscale:</span> Maps channels RGB to 1 grayscale byte.
            </div>
            <div>
              <span className="text-indigo-400 font-semibold">2. Downscale:</span> Scales boundary vectors to exactly 28x28.
            </div>
            <div>
              <span className="text-purple-400 font-semibold">3. Normalize:</span> Shifts pixel ranges from [0.0, 1.0] to [-1.0, 1.0].
            </div>
          </div>
        </div>

        {/* Real-World Applications */}
        <div id="card-ocr-explanation" className="bg-slate-950 p-5 rounded-2xl border border-slate-800/60 flex flex-col gap-3 hover:border-slate-700/60 transition-all group">
          <div className="flex items-center gap-2.5 text-emerald-400">
            <Globe2 className="w-4 h-4" />
            <h3 className="font-semibold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
              OCR & Real-World Applications
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Machine Learning classifiers trained on letters represent the absolute core of large-scale Optical Character Recognition systems:
          </p>
          <div className="bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-800/80">
            <h4 className="text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-300 mb-1.5">
              Production Use-cases
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-300">
              <div className="bg-slate-950 px-2 py-1 rounded border border-slate-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Postal Routes
              </div>
              <div className="bg-slate-950 px-2 py-1 rounded border border-slate-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Check Scanning
              </div>
              <div className="bg-slate-950 px-2 py-1 rounded border border-slate-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Invoice Parsing
              </div>
              <div className="bg-slate-950 px-2 py-1 rounded border border-slate-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Medical Forms
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
