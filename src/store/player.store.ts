import { create } from "zustand";
import { type Song } from "@/server/db/schema";

export type RepeatMode = "none" | "one" | "all";

interface PlayerState {
  // ─── Current Track ───────────────────────────────────────────────
  currentSong:    Song | null;
  isPlaying:      boolean;
  duration:       number;
  currentTime:    number;

  // ─── Queue ───────────────────────────────────────────────────────
  queue:          Song[];
  queueIndex:     number;

  // ─── Controls ────────────────────────────────────────────────────
  volume:         number;
  isMuted:        boolean;
  shuffle:        boolean;
  repeat:         RepeatMode;

  // ─── Actions: Playback ───────────────────────────────────────────
  play:           (song: Song, queue?: Song[]) => void;
  togglePlay:     () => void;
  setIsPlaying:   (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration:    (duration: number) => void;

  // ─── Actions: Queue ──────────────────────────────────────────────
  playNext:       () => void;
  playPrev:       () => void;
  setQueue:       (songs: Song[], index?: number) => void;
  addToQueue:     (song: Song) => void;

  // ─── Actions: Controls ───────────────────────────────────────────
  setVolume:      (volume: number) => void;
  toggleMute:     () => void;
  toggleShuffle:  () => void;
  toggleRepeat:   () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  // ─── Initial State ───────────────────────────────────────────────
  currentSong:  null,
  isPlaying:    false,
  duration:     0,
  currentTime:  0,
  queue:        [],
  queueIndex:   0,
  volume:       0.8,
  isMuted:      false,
  shuffle:      false,
  repeat:       "none",

  // ─── Playback Actions ────────────────────────────────────────────

  play: (song, queue) => {
    const songs = queue ?? [song];
    const index = songs.findIndex((s) => s.id === song.id);
    set({
      currentSong: song,
      isPlaying:   true,
      queue:       songs,
      queueIndex:  index === -1 ? 0 : index,
      currentTime: 0,
    });
  },

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  // ─── Queue Actions ───────────────────────────────────────────────

  playNext: () => {
    const { queue, queueIndex, shuffle, repeat, currentSong } = get();
    if (!queue.length) return;

    if (repeat === "one") {
      // restart same song — signal via currentTime reset
      set({ currentTime: 0, isPlaying: true });
      return;
    }

    let nextIndex: number;

    if (shuffle) {
      // pick random index that isn't current
      const options = queue
        .map((_, i) => i)
        .filter((i) => i !== queueIndex);
      nextIndex = options[Math.floor(Math.random() * options.length)] ?? 0;
    } else {
      nextIndex = queueIndex + 1;
    }

    if (nextIndex >= queue.length) {
      if (repeat === "all") {
        nextIndex = 0;
      } else {
        // end of queue
        set({ isPlaying: false });
        return;
      }
    }

    set({
      currentSong: queue[nextIndex],
      queueIndex:  nextIndex,
      currentTime: 0,
      isPlaying:   true,
    });
  },

  playPrev: () => {
    const { queue, queueIndex, currentTime } = get();
    if (!queue.length) return;

    // if more than 3s in, restart current song instead
    if (currentTime > 3) {
      set({ currentTime: 0 });
      return;
    }

    const prevIndex = queueIndex - 1 < 0 ? queue.length - 1 : queueIndex - 1;
    set({
      currentSong: queue[prevIndex],
      queueIndex:  prevIndex,
      currentTime: 0,
      isPlaying:   true,
    });
  },

  setQueue: (songs, index = 0) => set({ queue: songs, queueIndex: index }),

  addToQueue: (song) =>
    set((s) => ({ queue: [...s.queue, song] })),

  // ─── Control Actions ─────────────────────────────────────────────

  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),

  toggleMute: () =>
    set((s) => ({ isMuted: !s.isMuted })),

  toggleShuffle: () =>
    set((s) => ({ shuffle: !s.shuffle })),

  toggleRepeat: () =>
    set((s) => {
      const next: RepeatMode =
        s.repeat === "none" ? "all" : s.repeat === "all" ? "one" : "none";
      return { repeat: next };
    }),
}));