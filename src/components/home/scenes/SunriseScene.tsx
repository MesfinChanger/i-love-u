"use client";

export default function SunriseScene() {
  return (
    <div
      className="
        absolute inset-0
        bg-gradient-to-br
        from-orange-100
        via-pink-100
        to-blue-100
      "
    >
      <div
        className="
          absolute
          top-20
          left-1/2
          -translate-x-1/2
          w-72
          h-72
          rounded-full
          bg-yellow-300/40
          blur-3xl
          animate-pulse
        "
      />

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-b
          from-white/40
          to-transparent
        "
      />
    </div>
  );
}
