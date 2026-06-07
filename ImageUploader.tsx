import React, { useState, useRef } from "react";
import { Upload, FileImage, X, Sparkles, RefreshCw } from "lucide-react";

interface ImageUploaderProps {
  onPredict: (imageDataUrl: string) => void;
  isLoading: boolean;
}

export default function ImageUploader({ onPredict, isLoading }: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = (file: File) => {
    // Validate file type
    const validTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid format! Please upload a valid PNG or JPG character image.");
      return;
    }

    // Validate size (5 MB max)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert("File is too large! Maximum allowed image file size is 5 MB.");
      return;
    }

    setSelectedFile(file);

    // Read to draw preview URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerPrediction = () => {
    if (!previewUrl) return;
    onPredict(previewUrl);
  };

  return (
    <div id="image-upload-wrapper" className="flex flex-col items-center justify-center w-full max-w-[340px] mx-auto gap-5">
      {/* Target input */}
      <input
        id="character-image-file-input"
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept=".png, .jpg, .jpeg"
        className="hidden"
      />

      {/* Main Drag-Drop Box or Preview Box */}
      {!previewUrl ? (
        <div
          id="upload-dropbox-area"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`relative w-full max-w-[320px] aspect-square rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center p-6 text-center transition-all ${
            isDragActive
              ? "border-blue-500 bg-blue-500/10 scale-[1.01] shadow-lg shadow-blue-500/10"
              : "border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700"
          }`}
        >
          <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-400 mb-4 transition-all border border-slate-700/50">
            <Upload className="w-6 h-6" />
          </div>
          
          <h3 className="text-sm font-semibold text-slate-200 mb-1">
            Drag & Drop image here
          </h3>
          <p className="text-xs text-slate-400 mb-4 px-4 leading-relaxed">
            or click to browse your local files
          </p>
          
          <div className="text-[10px] uppercase tracking-wider font-mono bg-slate-800 px-3 py-1 text-slate-400 rounded-full border border-slate-700/40">
            PNG, JPG (MAX 5MB)
          </div>
        </div>
      ) : (
        <div id="uploaded-image-preview-frame" className="relative w-full max-w-[320px] aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2.5 flex flex-col justify-between items-center group">
          
          {/* Main preview body */}
          <div className="relative w-full flex-grow rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center overflow-hidden">
            <img
              id="character-preview-img"
              src={previewUrl}
              alt="Handwritten letter preview"
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain filter drop-shadow hover:scale-105 duration-300"
            />
          </div>

          {/* Action buttons at base */}
          <div className="w-full flex gap-2 mt-3 select-none">
            {/* Trash option */}
            <button
              id="clear-selected-image-btn"
              type="button"
              onClick={clearSelection}
              className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-slate-200 transition-all flex items-center justify-center"
              title="Clear Image"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Run Prediction */}
            <button
              id="execute-upload-classify-btn"
              type="button"
              disabled={isLoading}
              onClick={triggerPrediction}
              className="flex-grow py-3 px-4 font-semibold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 transition-all rounded-xl shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Analyze and Predict
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
