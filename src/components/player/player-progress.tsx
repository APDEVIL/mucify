"use client";

import { usePlayerStore } from "@/store/player.store";
import { Slider } from "@/components/ui/slider";
import { formatDuration } from "@/lib/format";

export function PlayerProgress() {
  const { currentTime, duration, setCurrentTime } = usePlayerStore();

  const handleSeek = (value: number[]) => {
    if (!value[0] === undefined) return;
    setCurrentTime(value[0]!);
  };

  return (
    <div className="flex w-full items-center gap-2">
      <span className="w-10 text-right text-xs text-zinc-400">
        {formatDuration(currentTime)}
      </span>
      <Slider
        value={[currentTime]}
        min={0}
        max={duration || 1}
        step={1}
        onValueChange={handleSeek}
        className="w-full cursor-pointer"
      />
      <span className="w-10 text-xs text-zinc-400">
        {formatDuration(duration)}
      </span>
    </div>
  );
}