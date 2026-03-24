import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { songRouter }     from "@/server/api/routers/song.router";
import { playlistRouter } from "@/server/api/routers/playlist.router";
import { userRouter }     from "@/server/api/routers/user.router";

export const appRouter = createTRPCRouter({
  song:     songRouter,
  playlist: playlistRouter,
  user:     userRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);