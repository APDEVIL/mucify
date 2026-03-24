"use client";

import Link from "next/link";
import Image from "next/image";
import { ListMusic, Play } from "lucide-react";
import { type Playlist } from "@/server/db/schema";
import { useQueue } from "@/hooks/use-queue";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";

interface PlaylistCardProps {
  playlist: Playlist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const { playAll }                       = useQueue();
  const { data, isLoading }               = api.playlist.getById.useQuery({ id: playlist.id });

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!data?.songs?.length) return;
    playAll(data.songs);
  };

  return (
    <Link href={`/playlist/${playlist.id}`}>
      <div className={cn(
        "group relative flex flex-col gap-3 rounded-md bg-zinc-800/50 p-4",
        "cursor-pointer transition-colors hover:bg-zinc-800"
      )}>

        {/* Cover */}
        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-zinc-700">
          {playlist.coverUrl ? (
            <Image
              src={playlist.coverUrl}
              alt={playlist.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ListMusic className="h-12 w-12 text-zinc-500" />
            </div>
          )}

          {/* Play button on hover */}
          <button
            onClick={handlePlay}
            className={cn(
              "absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center",
              "rounded-full bg-green-500 text-black shadow-lg",
              "translate-y-2 opacity-0 transition-all",
              "group-hover:translate-y-0 group-hover:opacity-100"
            )}
          >
            <Play className="h-5 w-5 fill-black" />
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1">
          <p className="truncate font-medium text-white">{playlist.name}</p>
          {playlist.description && (
            <p className="truncate text-sm text-zinc-400">{playlist.description}</p>
          )}
        </div>

      </div>
    </Link>
  );
}