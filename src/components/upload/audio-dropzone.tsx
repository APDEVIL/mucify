"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Music, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format";

interface AudioDropzoneProps {
  file:      File | null;
  onFile:    (file: File) => void;
  onRemove:  () => void;
}

export function AudioDropzone({ file, onFile, onRemove }: AudioDropzoneProps) {
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) onFile(accepted[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:   { "audio/*": [".mp3", ".wav", ".flac", ".aac", ".ogg"] },
    maxFiles: 1,
    maxSize:  64 * 1024 * 1024, // 64MB
  });

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-green-500/10">
          <Music className="h-5 w-5 text-green-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{file.name}</p>
          <p className="text-xs text-zinc-400">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 text-zinc-400 transition-colors hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed px-6 py-10 transition-colors",
        isDragActive
          ? "border-green-500 bg-green-500/5"
          : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500 hover:bg-zinc-800"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-700">
        <Upload className="h-6 w-6 text-zinc-400" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-white">
          {isDragActive ? "Drop your audio file here" : "Drag & drop your audio file"}
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          MP3, WAV, FLAC, AAC, OGG — max 64MB
        </p>
      </div>
    </div>
  );
}