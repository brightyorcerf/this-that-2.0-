"use client";

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";

interface ImageUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
}

export default function ImageUploader({ onFilesSelected, maxFiles = 20 }: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, maxFiles);
      onFilesSelected(selectedFiles);

      // Generate local previews
      const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  return (
    <div className="w-full space-y-4">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <p className="mb-2 text-sm text-gray-500 font-semibold">Click to upload images</p>
          <p className="text-xs text-gray-400">PNG, JPG or WEBP (Max {maxFiles})</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          multiple 
          accept="image/*" 
          onChange={handleFileChange} 
        />
      </label>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {previews.map((src, i) => (
            <div key={i} className="aspect-square relative rounded-md overflow-hidden border">
              <img src={src} alt="preview" className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}