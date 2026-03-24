"use client";

import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { usePlayerStore } from "@/store/player.store";
import { Slider } from "@/components/ui/slider";

export function PlayerVolume() {
  const { volume, isMuted, setVolume, toggleMute } = usePlayerStore();

  const displayVolume = isMuted ? 0 : volume;

  const VolumeIcon =
    isMuted || displayVolume === 0 ? VolumeX  :
    displayVolume < 0.33            ? Volume   :
    displayVolume < 0.66            ? Volume1  :
                                      Volume2;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMute}
        className="text-zinc-400 transition-colors hover:text-white"
      >
        <VolumeIcon className="h-4 w-4" />
      </button>
      <Slider
        value={[displayVolume * 100]}
        min={0}
        max={100}
        step={1}
        onValueChange={(val) => setVolume((val[0] ?? 0) / 100)}
        className="w-24 cursor-pointer"
      />
    </div>
  );
}