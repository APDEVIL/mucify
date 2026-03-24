"use client";

import Image from "next/image";
import { Music } from "lucide-react";
import { usePlayer } from "@/hooks/use-player";
import { usePlayerStore } from "@/store/player.store";
import { PlayerControls } from "./player-controls";
import { PlayerProgress } from "./player-progress";
import { PlayerVolume } from "./player-volume";
import { cn } from "@/lib/utils";

export function PlayerBar() {
  // mount audio engine
  usePlayer();

  const { currentSong } = usePlayerStore();

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "border-t border-zinc-800 bg-zinc-900 px-4 py-3",
      "grid grid-cols-3 items-center gap-4",
      // push up on mobile to sit above bottom nav
      "mb-16 md:mb-0"
    )}>

      {/* Left — current song info */}
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-zinc-800">
          {currentSong?.coverUrl ? (
            <Image
              src={currentSong.coverUrl}
              alt={currentSong.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Music className="h-5 w-5 text-zinc-500" />
            </div>
          )}
        </div>
        {currentSong ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {currentSong.title}
            </p>
            <p className="truncate text-xs text-zinc-400">
              {currentSong.artist}
            </p>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No song playing</p>
        )}
      </div>

      {/* Center — controls + progress */}
      <div className="flex flex-col items-center gap-2">
        <PlayerControls />
        <PlayerProgress />
      </div>

      {/* Right — volume */}
      <div className="flex justify-end">
        <PlayerVolume />
      </div>

    </div>
  );
}