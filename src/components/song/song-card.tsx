"use client";

import Image from "next/image";
import { Play, Pause, Music } from "lucide-react";
import { type Song } from "@/server/db/schema";
import { usePlayerStore } from "@/store/player.store";
import { useQueue } from "@/hooks/use-queue";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format";
import { SongOptions } from "./song-options";

interface SongCardProps {
  song:   Song;
  queue?: Song[];
}

export function SongCard({ song, queue }: SongCardProps) {
  const { currentSong, isPlaying, togglePlay } = usePlayerStore();
  const { playAll, isCurrentSong }             = useQueue();

  const isActive = isCurrentSong(song.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isActive) {
      togglePlay();
    } else {
      playAll(queue ?? [song], song);
    }
  };

  return (
    <div className={cn(
      "group relative flex flex-col gap-3 rounded-md bg-zinc-800/50 p-4",
      "cursor-pointer transition-colors hover:bg-zinc-800",
      isActive && "bg-zinc-800"
    )}>

      {/* Cover Art */}
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-zinc-700">
        {song.coverUrl ? (
          <Image
            src={song.coverUrl}
            alt={song.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music className="h-12 w-12 text-zinc-500" />
          </div>
        )}

        {/* Play / Pause button */}
        <button
          onClick={handlePlay}
          className={cn(
            "absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center",
            "rounded-full bg-green-500 text-black shadow-lg transition-all",
            isActive
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          )}
        >
          {isActive && isPlaying ? (
            <Pause className="h-5 w-5 fill-black" />
          ) : (
            <Play className="h-5 w-5 fill-black" />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className={cn(
            "truncate font-medium",
            isActive ? "text-green-400" : "text-white"
          )}>
            {song.title}
          </p>
          <p className="truncate text-sm text-zinc-400">{song.artist}</p>
          {song.duration && (
            <p className="mt-1 text-xs text-zinc-500">{formatDuration(song.duration)}</p>
          )}
        </div>
        <SongOptions song={song} />
      </div>

    </div>
  );
}