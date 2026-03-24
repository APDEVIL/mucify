import { HydrateClient, api } from "@/trpc/server";
import { HomeClient } from "./_client";

export default async function HomePage() {
  await api.song.getAll.prefetch();

  return (
    <HydrateClient>
      <HomeClient />
    </HydrateClient>
  );
}