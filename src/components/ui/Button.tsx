"use client";

import React from "react";

/**
 * @fileOverview Universal Button Component.
 * Provides a standardized visual container for interactions with consistent hover and active states.
 */
export default function Button({
  children,
  onClick
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        rounded-xl
        px-6
        py-3
        border
        font-semibold
        hover:opacity-80
        transition-all
        active:scale-95
      "
    >
      {children}
    </button>
  );
}
