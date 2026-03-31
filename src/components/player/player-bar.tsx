"use client";

import Image from "next/image";
import { Music, Heart } from "lucide-react";
import { usePlayer } from "@/hooks/use-player";
import { usePlayerStore } from "@/store/player.store";
import { api } from "@/trpc/react";
import { PlayerControls } from "./player-controls";
import { PlayerProgress } from "./player-progress";
import { PlayerVolume } from "./player-volume";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function PlayerBar() {
  usePlayer();

  const { currentSong }    = usePlayerStore();
  const utils              = api.useUtils();

  const { data: isLiked }  = api.user.isLiked.useQuery(
    { songId: currentSong?.id ?? "" },
    { enabled: !!currentSong }
  );

  const likeSong = api.user.likeSong.useMutation({
    onSuccess: () => {
      utils.user.isLiked.invalidate({ songId: currentSong?.id });
      utils.user.getLikedSongs.invalidate();
      toast.success("Added to Liked Songs");
    },
    onError: (e) => toast.error(e.message),
  });

  const unlikeSong = api.user.unlikeSong.useMutation({
    onSuccess: () => {
      utils.user.isLiked.invalidate({ songId: currentSong?.id });
      utils.user.getLikedSongs.invalidate();
      toast.success("Removed from Liked Songs");
    },
    onError: (e) => toast.error(e.message),
  });

  const handleLike = () => {
    if (!currentSong) return;
    if (isLiked) {
      unlikeSong.mutate({ songId: currentSong.id });
    } else {
      likeSong.mutate({ songId: currentSong.id });
    }
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "border-t border-zinc-800 bg-zinc-900 px-4 py-3",
      "grid grid-cols-3 items-center gap-4",
      "mb-16 md:mb-0"
    )}>

      {/* Left — current song info + like */}
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
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {currentSong.title}
              </p>
              <p className="truncate text-xs text-zinc-400">
                {currentSong.artist}
              </p>
            </div>
            {/* Like button */}
            <button
              onClick={handleLike}
              className="shrink-0 transition-colors hover:scale-110"
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  isLiked
                    ? "fill-green-400 text-green-400"
                    : "text-zinc-400 hover:text-white"
                )}
              />
            </button>
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