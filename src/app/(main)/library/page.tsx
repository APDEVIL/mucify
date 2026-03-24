import { HydrateClient, api } from "@/trpc/server";
import { LibraryClient } from "./_client";

export default async function LibraryPage() {
  await api.song.getMine.prefetch();

  return (
    <HydrateClient>
      <LibraryClient />
    </HydrateClient>
  );
}