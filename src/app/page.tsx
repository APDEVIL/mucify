import { redirect } from "next/navigation";
import { getSession } from "@/server/better-auth/server";

export default async function RootPage() {
  const session = await getSession();
  if (session) redirect("/home");
  redirect("/sign-in");
}