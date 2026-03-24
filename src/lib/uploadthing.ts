import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/server/uploadthing/core";

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();