import { redirect } from "next/navigation";
import { getSession } from "@/server/better-auth/server";
import { MainLayout } from "@/components/layout/main-layout";
import { PlayerBar } from "@/components/player/player-bar";

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) redirect("/sign-in");

  return (
    <MainLayout>
      {children}
      <PlayerBar />
    </MainLayout>
  );
}