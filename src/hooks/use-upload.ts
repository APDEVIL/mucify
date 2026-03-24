"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { api } from "@/trpc/react";
import { toast } from "sonner";

interface UploadSongInput {
  title:    string;
  artist:   string;
  album?:   string;
  genre?:   string;
}

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [audioFile,   setAudioFile]   = useState<File | null>(null);
  const [coverFile,   setCoverFile]   = useState<File | null>(null);

  const utils = api.useUtils();

  const { startUpload: startAudioUpload } = useUploadThing("audioUploader");
  const { startUpload: startCoverUpload } = useUploadThing("coverUploader");

  const createSong = api.song.create.useMutation({
    onSuccess: () => {
      utils.song.getAll.invalidate();
      utils.song.getMine.invalidate();
      toast.success("Song uploaded successfully!");
    },
    onError: (e) => toast.error(e.message),
  });

  const upload = async (input: UploadSongInput) => {
    if (!audioFile) {
      toast.error("Please select an audio file");
      return;
    }

    try {
      setIsUploading(true);

      // Upload audio first (required)
      const audioRes = await startAudioUpload([audioFile]);
      if (!audioRes?.[0]) throw new Error("Audio upload failed");

      const { url: audioUrl, key: audioKey, name } = audioRes[0];

      // Upload cover if provided (optional)
      let coverUrl: string | undefined;
      let coverKey: string | undefined;

      if (coverFile) {
        const coverRes = await startCoverUpload([coverFile]);
        if (coverRes?.[0]) {
          coverUrl = coverRes[0].url;
          coverKey = coverRes[0].key;
        }
      }

      // Save metadata to db via tRPC
      await createSong.mutateAsync({
        title:    input.title || name,
        artist:   input.artist,
        album:    input.album,
        genre:    input.genre,
        audioUrl,
        audioKey,
        coverUrl,
        coverKey,
      });

      // Reset files
      setAudioFile(null);
      setCoverFile(null);

    } catch (err) {
      toast.error("Upload failed, please try again");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    upload,
    isUploading,
    audioFile,
    coverFile,
    setAudioFile,
    setCoverFile,
  };
}