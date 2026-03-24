"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/server/better-auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await authClient.signUp.email({ name, email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message ?? "Sign up failed");
      return;
    }
    toast.success("Account created! Welcome to Musify.");
    router.push("/home");
  };

  const handleGithub = async () => {
    await authClient.signIn.social({ provider: "github", callbackURL: "/home" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Musify</h1>
          <p className="mt-2 text-sm text-zinc-400">Create your account</p>
        </div>

        <Button
          onClick={handleGithub}
          variant="outline"
          className="mb-6 w-full border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
        >
          <GithubIcon />
          Continue with GitHub
        </Button>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="text-xs text-zinc-500">or</span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-zinc-300">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-zinc-300">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
              className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-500"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-green-500 text-black hover:bg-green-400 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-white underline hover:text-green-400">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}