"use client";

import Link from "next/link";

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
  return (
    <nav className="flex gap-4 p-4 border-b bg-white">
      {menu.map((item) => (
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
