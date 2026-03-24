"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, Heart, Upload, ListMusic, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CreatePlaylistDialog } from "@/components/playlist/create-playlist-dialog";

const navLinks = [
  { href: "/home",    label: "Home",        icon: Home        },
  { href: "/library", label: "Your Library", icon: Library     },
  { href: "/liked",   label: "Liked Songs",  icon: Heart       },
  { href: "/upload",  label: "Upload",       icon: Upload      },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: playlists, isLoading } = api.playlist.getMine.useQuery();

  return (
    <aside className="flex h-full w-64 flex-col gap-2 bg-black p-4">

      {/* Logo */}
      <div className="px-2 py-4">
        <h1 className="text-2xl font-bold text-white">Musify</h1>
      </div>

      {/* Main Nav */}
      <nav className="flex flex-col gap-1">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>

      <Separator className="bg-zinc-800" />

      {/* Playlists */}
      <div className="flex items-center justify-between px-2">
        <span className="text-sm font-semibold text-zinc-400">Playlists</span>
        <CreatePlaylistDialog>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-zinc-400 hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CreatePlaylistDialog>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-md bg-zinc-800" />
              ))
            : playlists?.map((playlist) => (
                <Link
                  key={playlist.id}
                  href={`/playlist/${playlist.id}`}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    pathname === `/playlist/${playlist.id}`
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  )}
                >
                  <ListMusic className="h-4 w-4 shrink-0" />
                  <span className="truncate">{playlist.name}</span>
                </Link>
              ))}
        </div>
      </ScrollArea>

    </aside>
  );
}