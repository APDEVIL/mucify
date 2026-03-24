"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { ImageIcon, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoverDropzoneProps {
  file:     File | null;
  onFile:   (file: File) => void;
  onRemove: () => void;
}

export function CoverDropzone({ file, onFile, onRemove }: CoverDropzoneProps) {
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) onFile(accepted[0]);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:   { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize:  4 * 1024 * 1024, // 4MB
  });

  if (file) {
    const preview = URL.createObjectURL(file);
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-zinc-800">
        <Image
          src={preview}
          alt="Cover preview"
          fill
          className="object-cover"
        />
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            "absolute right-2 top-2 flex h-6 w-6 items-center justify-center",
            "rounded-full bg-black/60 text-white transition-colors hover:bg-black"
          )}
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed transition-colors",
        isDragActive
          ? "border-green-500 bg-green-500/5"
          : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-500 hover:bg-zinc-800"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700">
        {isDragActive ? (
          <Upload className="h-5 w-5 text-green-400" />
        ) : (
          <ImageIcon className="h-5 w-5 text-zinc-400" />
        )}
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-white">
          {isDragActive ? "Drop cover art" : "Cover Art"}
        </p>
        <p className="mt-0.5 text-xs text-zinc-500">JPG, PNG, WEBP — max 4MB</p>
      </div>
    </div>
  );
}