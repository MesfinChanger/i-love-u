"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Global Navigation Bridge.
 * Orchestrates platform-wide routing for every heart.
 * This component is hidden on public pages (/, /login, /signup).
 * Removed Identity Hub to prevent redundancy with BottomNav.
 */

const menu = [
  { name: "🏠 Home", path: "/dashboard" },
  { name: "❤️ Spark", path: "/spark" },
  { name: "🤝 Circle", path: "/circles" },
  { name: "🛒 Shopping", path: "/shopping" },
  { name: "💡 Ideas", path: "/ideas" },
  { name: "💬 Messages", path: "/messages" }
];

export default function MainNavigation() {
  const pathname = usePathname();
  
  // Public pages where the top navigation bridge should be deactivated
  const publicPages = ["/", "/login", "/signup"];
  
  if (publicPages.includes(pathname)) {
    return null;
  }

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
