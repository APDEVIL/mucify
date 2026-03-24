"use client";

import Image from "next/image";
import { Play, Pause, Music } from "lucide-react";
import { type Song } from "@/server/db/schema";
import { usePlayerStore } from "@/store/player.store";
import { useQueue } from "@/hooks/use-queue";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format";
import { SongOptions } from "./song-options";

interface SongRowProps {
  song:        Song;
  index:       number;
  queue?:      Song[];
  playlistId?: string;
}

export function SongRow({ song, index, queue, playlistId }: SongRowProps) {
  const { currentSong, isPlaying, togglePlay } = usePlayerStore();
  const { playAll, isCurrentSong }             = useQueue();

  const isActive = isCurrentSong(song.id);

  const handlePlay = () => {
    if (isActive) {
      togglePlay();
    } else {
      playAll(queue ?? [song], song);
    }
  };

  return (
    <div
      onClick={handlePlay}
      className={cn(
        "group flex cursor-pointer items-center gap-4 rounded-md px-4 py-2 transition-colors hover:bg-zinc-800",
        isActive && "bg-zinc-800/60"
      )}
    >
      {/* Index / Play indicator */}
      <div className="flex w-6 shrink-0 items-center justify-center">
        {isActive && isPlaying ? (
          <Pause className="h-4 w-4 text-green-400" />
        ) : (
          <>
            <span className={cn(
              "text-sm group-hover:hidden",
              isActive ? "text-green-400" : "text-zinc-400"
            )}>
              {index + 1}
            </span>
            <Play className="hidden h-4 w-4 fill-white text-white group-hover:block" />
          </>
        )}
      </div>

      {/* Cover */}
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-zinc-700">
        {song.coverUrl ? (
          <Image
            src={song.coverUrl}
            alt={song.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music className="h-4 w-4 text-zinc-500" />
          </div>
        )}
      </div>

      {/* Title + Artist */}
      <div className="min-w-0 flex-1">
        <p className={cn(
          "truncate text-sm font-medium",
          isActive ? "text-green-400" : "text-white"
        )}>
          {song.title}
        </p>
        <p className="truncate text-xs text-zinc-400">{song.artist}</p>
      </div>

      {/* Album */}
      {song.album && (
        <p className="hidden w-40 truncate text-sm text-zinc-400 md:block">
          {song.album}
        </p>
      )}

      {/* Duration + Options */}
      <div className="flex shrink-0 items-center gap-3">
        {song.duration && (
          <span className="text-sm text-zinc-400">
            {formatDuration(song.duration)}
          </span>
        )}
        <span onClick={(e) => e.stopPropagation()}>
          <SongOptions song={song} playlistId={playlistId} />
        </span>
      </div>

    </div>
  );
}