"use client";

/**
 * @fileOverview Universal Card Component.
 * Provides a standardized visual container with mandatory rounded corners and elevation.
 */
export default function Card({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        rounded-[2rem]
        border
        p-8
        bg-white
        shadow-sm
        hover:shadow-md
        transition-all
        ${className}
      `}
    >
      {children}
    </div>
  );
}
