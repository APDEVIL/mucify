import { HydrateClient, api } from "@/trpc/server";
import { LikedClient } from "./_client";

export default async function LikedPage() {
  await api.user.getLikedSongs.prefetch();

  return (
    <HydrateClient>
      <LikedClient />
    </HydrateClient>
  );
}