"use client";

import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1,
} from "lucide-react";
import { usePlayerStore } from "@/store/player.store";
import { cn } from "@/lib/utils";

export function PlayerControls() {
  const {
    isPlaying,
    shuffle,
    repeat,
    currentSong,
    togglePlay,
    playNext,
    playPrev,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  return (
    <div className="flex items-center gap-4">

      {/* Shuffle */}
      <button
        onClick={toggleShuffle}
        disabled={!currentSong}
        className={cn(
          "transition-colors disabled:cursor-not-allowed disabled:opacity-30",
          shuffle ? "text-green-400 hover:text-green-300" : "text-zinc-400 hover:text-white"
        )}
      >
        <Shuffle className="h-4 w-4" />
      </button>

      {/* Previous */}
      <button
        onClick={playPrev}
        disabled={!currentSong}
        className="text-zinc-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        <SkipBack className="h-5 w-5 fill-current" />
      </button>

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        disabled={!currentSong}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full bg-white text-black",
          "transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30"
        )}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 fill-black" />
        ) : (
          <Play className="h-4 w-4 fill-black" />
        )}
      </button>

      {/* Next */}
      <button
        onClick={playNext}
        disabled={!currentSong}
        className="text-zinc-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        <SkipForward className="h-5 w-5 fill-current" />
      </button>

      {/* Repeat */}
      <button
        onClick={toggleRepeat}
        disabled={!currentSong}
        className={cn(
          "transition-colors disabled:cursor-not-allowed disabled:opacity-30",
          repeat !== "none"
            ? "text-green-400 hover:text-green-300"
            : "text-zinc-400 hover:text-white"
        )}
      >
        {repeat === "one" ? (
          <Repeat1 className="h-4 w-4" />
        ) : (
          <Repeat className="h-4 w-4" />
        )}
      </button>

    </div>
  );
}