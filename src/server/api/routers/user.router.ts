import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { likes, songs, users } from "@/server/db/schema";

export const userRouter = createTRPCRouter({

  // Get logged-in user profile
  getMe: protectedProcedure
    .query(async ({ ctx }) => {
      const [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, ctx.session.user.id));
      return user ?? null;
    }),

  // Like a song
  likeSong: protectedProcedure
    .input(z.object({ songId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [like] = await ctx.db
        .insert(likes)
        .values({ songId: input.songId, userId: ctx.session.user.id })
        .onConflictDoNothing()
        .returning();
      return like;
    }),

  // Unlike a song
  unlikeSong: protectedProcedure
    .input(z.object({ songId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [removed] = await ctx.db
        .delete(likes)
        .where(and(
          eq(likes.songId, input.songId),
          eq(likes.userId, ctx.session.user.id)
        ))
        .returning();
      return removed;
    }),

  // Get all liked songs
  getLikedSongs: protectedProcedure
    .query(async ({ ctx }) => {
      const entries = await ctx.db
        .select({ song: songs, likedAt: likes.createdAt })
        .from(likes)
        .innerJoin(songs, eq(likes.songId, songs.id))
        .where(eq(likes.userId, ctx.session.user.id))
        .orderBy(desc(likes.createdAt));
      return entries.map(e => ({ ...e.song, likedAt: e.likedAt }));
    }),

  // Check if a specific song is liked
  isLiked: protectedProcedure
    .input(z.object({ songId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [like] = await ctx.db
        .select()
        .from(likes)
        .where(and(
          eq(likes.songId, input.songId),
          eq(likes.userId, ctx.session.user.id)
        ));
      return !!like;
    }),
});