"use client";

import Link from "next/link";

/**
 * @fileOverview Redundant Navigation Cleanup.
 * Consolidates routing and replaces legacy labels.
 */

const menu = [
  { name: "🏠 Home", path: "/" },
  { name: "❤️ Spark", path: "/spark" },
  { name: "🤝 Circle", path: "/circle" },
  { name: "🛒 Shopping", path: "/shopping" },
  { name: "💡 Idea Pool", path: "/ideas" },
  { name: "💬 Messages", path: "/messages" }
];

export default function MainNavigation() {
  return (
    <nav className="flex gap-4 p-4 border-b bg-white" role="navigation">
      {menu.map(item => (
        <Link
          key={item.path}
          href={item.path}
          className="px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors font-bold text-sm"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}