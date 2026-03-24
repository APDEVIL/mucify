"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, Heart, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/home",    label: "Home",    icon: Home    },
  { href: "/library", label: "Library", icon: Library },
  { href: "/liked",   label: "Liked",   icon: Heart   },
  { href: "/upload",  label: "Upload",  icon: Upload  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-black pb-safe md:hidden">
      <div className="flex items-center justify-around py-2">
        {navLinks.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 text-xs transition-colors",
              pathname === href
                ? "text-white"
                : "text-zinc-500 hover:text-white"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}