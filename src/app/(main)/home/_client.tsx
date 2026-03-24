"use client";

import { api } from "@/trpc/react";
import { SongCard } from "@/components/song/song-card";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeClient() {
  const { data: songs, isLoading } = api.song.getAll.useQuery();

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Discover</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md bg-zinc-800" />
          ))}
        </div>
      ) : !songs?.length ? (
        <p className="text-zinc-400">No songs uploaded yet. Be the first!</p>
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