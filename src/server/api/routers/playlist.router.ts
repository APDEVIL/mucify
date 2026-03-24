import { z } from "zod";
import { eq, and, asc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { playlists, playlistSongs, songs } from "@/server/db/schema";

export const playlistRouter = createTRPCRouter({

  // Create a new playlist
  create: protectedProcedure
    .input(z.object({
      name:        z.string().min(1),
      description: z.string().optional(),
      coverUrl:    z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [playlist] = await ctx.db
        .insert(playlists)
        .values({ ...input, userId: ctx.session.user.id })
        .returning();
      return playlist;
    }),

  // Get all playlists of logged-in user
  getMine: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db
        .select()
        .from(playlists)
        .where(eq(playlists.userId, ctx.session.user.id));
    }),

  // Get single playlist with all its songs
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const playlist = await ctx.db.query.playlists.findFirst({
        where: eq(playlists.id, input.id),
      });
      if (!playlist) return null;

      const entries = await ctx.db
        .select({ song: songs, order: playlistSongs.order })
        .from(playlistSongs)
        .innerJoin(songs, eq(playlistSongs.songId, songs.id))
        .where(eq(playlistSongs.playlistId, input.id))
        .orderBy(asc(playlistSongs.order));

      return { ...playlist, songs: entries.map(e => ({ ...e.song, order: e.order })) };
    }),

  // Add a song to a playlist
  addSong: protectedProcedure
    .input(z.object({
      playlistId: z.string().uuid(),
      songId:     z.string().uuid(),
      order:      z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [entry] = await ctx.db
        .insert(playlistSongs)
        .values(input)
        .returning();
      return entry;
    }),

  // Remove a song from a playlist
  removeSong: protectedProcedure
    .input(z.object({
      playlistId: z.string().uuid(),
      songId:     z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [removed] = await ctx.db
        .delete(playlistSongs)
        .where(and(
          eq(playlistSongs.playlistId, input.playlistId),
          eq(playlistSongs.songId, input.songId)
        ))
        .returning();
      return removed;
    }),

  // Delete a playlist
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(playlists)
        .where(and(
          eq(playlists.id, input.id),
          eq(playlists.userId, ctx.session.user.id)
        ))
        .returning();
      return deleted;
    }),

  // Update playlist name / description
  update: protectedProcedure
    .input(z.object({
      id:          z.string().uuid(),
      name:        z.string().min(1).optional(),
      description: z.string().optional(),
      coverUrl:    z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(playlists)
        .set({ ...data, updatedAt: new Date() })
        .where(and(
          eq(playlists.id, id),
          eq(playlists.userId, ctx.session.user.id)
        ))
        .returning();
      return updated;
    }),
});