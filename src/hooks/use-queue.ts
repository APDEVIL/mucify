"use client";

import { usePlayerStore } from "@/store/player.store";
import { type Song } from "@/server/db/schema";

export function useQueue() {
  const {
    queue,
    queueIndex,
    currentSong,
    play,
    addToQueue,
    setQueue,
  } = usePlayerStore();

  // Play entire list starting from a specific song
  const playAll = (songs: Song[], startSong?: Song) => {
    if (!songs.length) return;
    const song = startSong ?? songs[0];
    if (!song) return;
    play(song, songs);
  };

  // Play a single song without changing the queue
  const playSingle = (song: Song) => {
    play(song, [song]);
  };

  // Add song to end of queue
  const addNext = (song: Song) => {
    addToQueue(song);
  };

  // Check if a song is currently active
  const isCurrentSong = (songId: string) => {
    return currentSong?.id === songId;
  };

  // Get upcoming songs in queue
  const upcoming = queue.slice(queueIndex + 1);

  return {
    queue,
    queueIndex,
    upcoming,
    currentSong,
    playAll,
    playSingle,
    addNext,
    isCurrentSong,
    setQueue,
  };
}