"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Global Navigation Bridge.
 * Orchestrates platform-wide routing for every heart.
 */

const menu = [
  { name: "🏠 Home", path: "/" },
  { name: "❤️ Spark", path: "/spark" },
  { name: "🤝 Circle", path: "/circle" },
  { name: "🛒 Shopping", path: "/shopping" },
  { name: "💡 Ideas", path: "/ideas" },
  { name: "💬 Messages", path: "/messages" },
  { name: "👤 Identity Hub", path: "/identity" }
];

export default function MainNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 p-4 border-b bg-white overflow-x-auto no-scrollbar" role="navigation" aria-label="Primary Navigation">
      {menu.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={cn(
            "px-4 py-2 rounded-xl transition-all font-bold text-sm whitespace-nowrap",
            pathname === item.path ? "bg-primary text-white shadow-md" : "hover:bg-gray-100 text-slate-600"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}