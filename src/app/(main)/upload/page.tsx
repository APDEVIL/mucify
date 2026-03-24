"use client";

import { useState } from "react";
import { AudioDropzone } from "@/components/upload/audio-dropzone";
import { CoverDropzone } from "@/components/upload/cover-dropzone";
import { useUpload } from "@/hooks/use-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UploadPage() {
  const {
    upload,
    isUploading,
    audioFile,
    coverFile,
    setAudioFile,
    setCoverFile,
  } = useUpload();

  const [title,  setTitle]  = useState("");
  const [artist, setArtist] = useState("");
  const [album,  setAlbum]  = useState("");
  const [genre,  setGenre]  = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await upload({ title, artist, album, genre });
    setTitle("");
    setArtist("");
    setAlbum("");
    setGenre("");
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-8 text-2xl font-bold text-white">Upload Song</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Cover + Audio side by side */}
        <div className="flex gap-4">
          <div className="w-40 shrink-0">
            <Label className="mb-2 block text-zinc-300">Cover Art</Label>
            <CoverDropzone
              file={coverFile}
              onFile={setCoverFile}
              onRemove={() => setCoverFile(null)}
            />
          </div>
          <div className="flex-1">
            <Label className="mb-2 block text-zinc-300">Audio File</Label>
            <AudioDropzone
              file={audioFile}
              onFile={setAudioFile}
              onRemove={() => setAudioFile(null)}
            />
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-zinc-300">
              Title <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Song title"
              required
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="artist" className="text-zinc-300">
              Artist <span className="text-red-400">*</span>
            </Label>
            <Input
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Artist name"
              required
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="album" className="text-zinc-300">
              Album
              <span className="ml-1 text-xs text-zinc-500">(optional)</span>
            </Label>
            <Input
              id="album"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              placeholder="Album name"
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="genre" className="text-zinc-300">
              Genre
              <span className="ml-1 text-xs text-zinc-500">(optional)</span>
            </Label>
            <Input
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g. Hip-Hop, Pop, Jazz"
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={!audioFile || !title || !artist || isUploading}
          className="w-full bg-green-500 text-black hover:bg-green-400 disabled:opacity-50"
        >
          {isUploading ? "Uploading..." : "Upload Song"}
        </Button>

      </form>
    </div>
  );
}