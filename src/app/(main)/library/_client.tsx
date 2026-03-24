"use client";

import { api } from "@/trpc/react";
import { SongCard } from "@/components/song/song-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Music } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LibraryClient() {
  const { data: songs, isLoading } = api.song.getMine.useQuery();

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Your Library</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md bg-zinc-800" />
          ))}
        </div>
      ) : !songs?.length ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
            <Music className="h-8 w-8 text-zinc-500" />
          </div>
          <p className="text-zinc-400">You haven't uploaded any songs yet</p>
          <Button asChild className="bg-green-500 text-black hover:bg-green-400">
            <Link href="/upload">Upload your first song</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} queue={songs} />
          ))}
        </div>
      )}
    </div>
  );
}