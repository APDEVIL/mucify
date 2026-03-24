import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { songs } from "@/server/db/schema";

export const songRouter = createTRPCRouter({

  // Upload metadata after uploadthing gives us the url
  create: protectedProcedure
    .input(z.object({
      title:    z.string().min(1),
      artist:   z.string().min(1),
      album:    z.string().optional(),
      genre:    z.string().optional(),
      duration: z.number().optional(),
      audioUrl: z.string().url(),
      audioKey: z.string(),
      coverUrl: z.string().url().optional(),
      coverKey: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [song] = await ctx.db
        .insert(songs)
        .values({ ...input, userId: ctx.session.user.id })
        .returning();
      return song;
    }),

  // Get all songs (for discover / home feed)
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      return ctx.db
        .select()
        .from(songs)
        .orderBy(desc(songs.createdAt));
    }),

  // Get songs uploaded by the logged-in user
  getMine: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db
        .select()
        .from(songs)
        .where(eq(songs.userId, ctx.session.user.id))
        .orderBy(desc(songs.createdAt));
    }),

  // Get single song by id
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [song] = await ctx.db
        .select()
        .from(songs)
        .where(eq(songs.id, input.id));
      return song ?? null;
    }),

  // Delete a song (only owner can delete)
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(songs)
        .where(and(
          eq(songs.id, input.id),
          eq(songs.userId, ctx.session.user.id)
        ))
        .returning();
      return deleted;
    }),

  // Update song metadata
  update: protectedProcedure
    .input(z.object({
      id:     z.string().uuid(),
      title:  z.string().min(1).optional(),
      artist: z.string().min(1).optional(),
      album:  z.string().optional(),
      genre:  z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [updated] = await ctx.db
        .update(songs)
        .set({ ...data, updatedAt: new Date() })
        .where(and(
          eq(songs.id, id),
          eq(songs.userId, ctx.session.user.id)
        ))
        .returning();
      return updated;
    }),
});