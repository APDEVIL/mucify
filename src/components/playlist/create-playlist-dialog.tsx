"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreatePlaylistDialogProps {
  children: React.ReactNode;
}

export function CreatePlaylistDialog({ children }: CreatePlaylistDialogProps) {
  const [open, setOpen]               = useState(false);
  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const router                        = useRouter();
  const utils                         = api.useUtils();

  const create = api.playlist.create.useMutation({
    onSuccess: (playlist) => {
      if (!playlist) return;
      utils.playlist.getMine.invalidate();
      toast.success("Playlist created!");
      setOpen(false);
      setName("");
      setDescription("");
      router.push(`/playlist/${playlist.id}`);
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    create.mutate({
      name:        name.trim(),
      description: description.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-zinc-800 bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>Create Playlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-zinc-300">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Playlist"
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="text-zinc-300">
              Description
              <span className="ml-1 text-xs text-zinc-500">(optional)</span>
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add an optional description"
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || create.isPending}
              className="bg-green-500 text-black hover:bg-green-400"
            >
              {create.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}