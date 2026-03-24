import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/server/uploadthing/core";
import { env } from "@/env";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: env.UPLOADTHING_TOKEN,
  },
});