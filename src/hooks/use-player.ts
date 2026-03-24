"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/player.store";

export function usePlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    currentSong,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    playNext,
  } = usePlayerStore();

  // ─── Init audio element once ────────────────────────────────────
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  // ─── Load new song when currentSong changes ──────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = currentSong.audioUrl;
    audio.load();

    if (isPlaying) {
      audio.play().catch(console.error);
    }
  }, [currentSong]);

  // ─── Play / Pause ────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // ─── Volume / Mute ───────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ─── Seek when currentTime is set externally (seek bar drag) ─────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (Math.abs(audio.currentTime - currentTime) > 1) {
      audio.currentTime = currentTime;
    }
  }, [currentTime]);

  // ─── Audio event listeners ───────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDuration   = () => setDuration(audio.duration);
    const onEnded      = () => playNext();
    const onPause      = () => setIsPlaying(false);
    const onPlay       = () => setIsPlaying(true);

    audio.addEventListener("timeupdate",        onTimeUpdate);
    audio.addEventListener("durationchange",    onDuration);
    audio.addEventListener("ended",             onEnded);
    audio.addEventListener("pause",             onPause);
    audio.addEventListener("play",              onPlay);

    return () => {
      audio.removeEventListener("timeupdate",      onTimeUpdate);
      audio.removeEventListener("durationchange",  onDuration);
      audio.removeEventListener("ended",           onEnded);
      audio.removeEventListener("pause",           onPause);
      audio.removeEventListener("play",            onPlay);
    };
  }, []);

  return { audioRef };
}