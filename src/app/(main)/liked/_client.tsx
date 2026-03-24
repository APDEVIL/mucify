"use client";

import { api } from "@/trpc/react";
import { SongRow } from "@/components/song/song-row";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";

export function LikedClient() {
  const { data: songs, isLoading } = api.user.getLikedSongs.useQuery();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-6">
        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-700">
          <Heart className="h-16 w-16 fill-white text-white" />
        </div>
        <div>
          <p className="text-sm font-medium uppercase text-zinc-400">Playlist</p>
          <h1 className="text-4xl font-bold text-white">Liked Songs</h1>
          <p className="mt-2 text-sm text-zinc-400">{songs?.length ?? 0} songs</p>
        </div>
      </div>

      {/* Song list */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-md bg-zinc-800" />
          ))}
        </div>
      ) : !songs?.length ? (
        <p className="text-zinc-400">Songs you like will appear here</p>
      ) : (
        <div className="flex flex-col">
          {songs.map((song, index) => (
            <SongRow
              key={song.id}
              song={song}
              index={index}
              queue={songs}
            />
          ))}
        </div>
      )}
    </div>
  );
}