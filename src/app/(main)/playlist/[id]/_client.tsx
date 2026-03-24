"use client";

import Image from "next/image";
import { Play, Pause, ListMusic } from "lucide-react";
import { api } from "@/trpc/react";
import { SongRow } from "@/components/song/song-row";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useQueue } from "@/hooks/use-queue";
import { usePlayerStore } from "@/store/player.store";

interface PlaylistClientProps {
  id: string;
}

export function PlaylistClient({ id }: PlaylistClientProps) {
  const { data: playlist, isLoading } = api.playlist.getById.useQuery({ id });
  const { playAll }                   = useQueue();
  const { isPlaying, currentSong }    = usePlayerStore();

  const isPlaylistPlaying =
    isPlaying && playlist?.songs?.some((s) => s.id === currentSong?.id);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8 flex items-center gap-6">
          <Skeleton className="h-32 w-32 rounded-md bg-zinc-800" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24 bg-zinc-800" />
            <Skeleton className="h-10 w-64 bg-zinc-800" />
            <Skeleton className="h-4 w-32 bg-zinc-800" />
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-14 w-full rounded-md bg-zinc-800" />
        ))}
      </div>
    );
  }

  if (!playlist) return (
    <div className="p-6">
      <p className="text-zinc-400">Playlist not found</p>
    </div>
  );

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-8 flex items-end gap-6">
        <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-md bg-zinc-800 shadow-2xl">
          {playlist.coverUrl ? (
            <Image
              src={playlist.coverUrl}
              alt={playlist.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ListMusic className="h-16 w-16 text-zinc-500" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium uppercase text-zinc-400">Playlist</p>
          <h1 className="text-4xl font-bold text-white">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-sm text-zinc-400">{playlist.description}</p>
          )}
          <p className="text-sm text-zinc-400">{playlist.songs?.length ?? 0} songs</p>
        </div>
      </div>

      {/* Play button */}
      {!!playlist.songs?.length && (
        <div className="mb-6">
          <Button
            onClick={() => playAll(playlist.songs!, playlist.songs![0])}
            className="h-14 w-14 rounded-full bg-green-500 p-0 text-black hover:bg-green-400 hover:scale-105 transition-transform"
          >
            {isPlaylistPlaying ? (
              <Pause className="h-6 w-6 fill-black" />
            ) : (
              <Play className="h-6 w-6 fill-black" />
            )}
          </Button>
        </div>
      )}

      {/* Songs */}
      {!playlist.songs?.length ? (
        <p className="text-zinc-400">No songs in this playlist yet</p>
      ) : (
        <div className="flex flex-col">
          {playlist.songs.map((song, index) => (
            <SongRow
              key={song.id}
              song={song}
              index={index}
              queue={playlist.songs}
              playlistId={id}
            />
          ))}
        </div>
      )}

    </div>
  );
}