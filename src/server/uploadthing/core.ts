import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/server/better-auth";
import { headers } from "next/headers";

const f = createUploadthing();

export const ourFileRouter = {

  audioUploader: f({
    audio: {
      maxFileSize: "64MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url:        file.ufsUrl,
        key:        file.key,
        name:       file.name,
      };
    }),

  coverUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({ headers: await headers() });
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url:        file.ufsUrl,
        key:        file.key,
        name:       file.name,
      };
    }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;