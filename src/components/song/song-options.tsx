"use client";

import { MoreHorizontal, Heart, HeartOff, ListPlus, Trash2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { type Song } from "@/server/db/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface SongOptionsProps {
  song:        Song;
  playlistId?: string; // if inside a playlist, show remove option
}

export function SongOptions({ song, playlistId }: SongOptionsProps) {
  const utils = api.useUtils();

  // ─── Like / Unlike ───────────────────────────────────────────────
  const { data: isLiked } = api.user.isLiked.useQuery({ songId: song.id });

  const likeSong = api.user.likeSong.useMutation({
    onSuccess: () => {
      utils.user.isLiked.invalidate({ songId: song.id });
      utils.user.getLikedSongs.invalidate();
      toast.success("Added to Liked Songs");
    },
    onError: (e) => toast.error(e.message),
  });

  const unlikeSong = api.user.unlikeSong.useMutation({
    onSuccess: () => {
      utils.user.isLiked.invalidate({ songId: song.id });
      utils.user.getLikedSongs.invalidate();
      toast.success("Removed from Liked Songs");
    },
    onError: (e) => toast.error(e.message),
  });

  // ─── Delete song ─────────────────────────────────────────────────
  const deleteSong = api.song.delete.useMutation({
    onSuccess: () => {
      utils.song.getAll.invalidate();
      utils.song.getMine.invalidate();
      toast.success("Song deleted");
    },
    onError: (e) => toast.error(e.message),
  });

  // ─── Playlists ───────────────────────────────────────────────────
  const { data: playlists }   = api.playlist.getMine.useQuery();

  const addToPlaylist = api.playlist.addSong.useMutation({
    onSuccess: () => {
      utils.playlist.getById.invalidate();
      toast.success("Added to playlist");
    },
    onError: (e) => toast.error(e.message),
  });

  const removeFromPlaylist = api.playlist.removeSong.useMutation({
    onSuccess: () => {
      utils.playlist.getById.invalidate();
      toast.success("Removed from playlist");
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-white data-[state=open]:opacity-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52 border-zinc-700 bg-zinc-800 text-white"
      >
        {/* Like / Unlike */}
        {isLiked ? (
          <DropdownMenuItem
            onClick={() => unlikeSong.mutate({ songId: song.id })}
            className="cursor-pointer gap-2 hover:bg-zinc-700 focus:bg-zinc-700"
          >
            <HeartOff className="h-4 w-4 text-green-400" />
            Remove from Liked
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => likeSong.mutate({ songId: song.id })}
            className="cursor-pointer gap-2 hover:bg-zinc-700 focus:bg-zinc-700"
          >
            <Heart className="h-4 w-4" />
            Like Song
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-zinc-700" />

        {/* Add to Playlist */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer gap-2 hover:bg-zinc-700 focus:bg-zinc-700">
            <ListPlus className="h-4 w-4" />
            Add to Playlist
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="border-zinc-700 bg-zinc-800 text-white">
            {playlists?.length ? (
              playlists.map((playlist) => (
                <DropdownMenuItem
                  key={playlist.id}
                  onClick={() => addToPlaylist.mutate({
                    playlistId: playlist.id,
                    songId:     song.id,
                  })}
                  className="cursor-pointer hover:bg-zinc-700 focus:bg-zinc-700"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {playlist.name}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled className="text-zinc-500">
                No playlists yet
              </DropdownMenuItem>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Remove from current playlist */}
        {playlistId && (
          <>
            <DropdownMenuSeparator className="bg-zinc-700" />
            <DropdownMenuItem
              onClick={() => removeFromPlaylist.mutate({
                playlistId,
                songId: song.id,
              })}
              className="cursor-pointer gap-2 text-red-400 hover:bg-zinc-700 focus:bg-zinc-700"
            >
              <Trash2 className="h-4 w-4" />
              Remove from Playlist
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="bg-zinc-700" />

        {/* Delete song */}
        <DropdownMenuItem
          onClick={() => deleteSong.mutate({ id: song.id })}
          className="cursor-pointer gap-2 text-red-400 hover:bg-zinc-700 focus:bg-zinc-700"
        >
          <Trash2 className="h-4 w-4" />
          Delete Song
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}