
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menu = [
  {
    name: "🏠 Home",
    path: "/"
  },
  {
    name: "❤️ Spark",
    path: "/spark"
  },
  {
    name: "🤝 Circle",
    path: "/circle"
  },
  {
    name: "🛒 Shopping",
    path: "/shopping"
  },
  {
    name: "💡 Idea Pool",
    path: "/ideas"
  },
  {
    name: "💬 Messages",
    path: "/messages"
  },
  {
    name: "👤 Profile",
    path: "/profile"
  }
];

export default function MainNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 p-4 border-b bg-white">
      {menu.map((item) => {
        const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "px-4 py-2 rounded-xl transition-colors font-bold text-sm",
              isActive ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
