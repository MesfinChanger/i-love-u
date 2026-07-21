"use client";

export default function ForestScene() {
  return (
    <div
      className="
        absolute inset-0
        bg-gradient-to-br
        from-green-100
        via-emerald-50
        to-blue-100
      "
    >

      {/* Soft sunlight through trees */}
      <div
        className="
          absolute
          top-0
          left-1/2
          -translate-x-1/2
          w-[500px]
          h-[500px]
          rounded-full
          bg-yellow-100/40
          blur-3xl
          animate-pulse
        "
      />

      {/* Forest mist */}
      <div
        className="
          absolute
          bottom-0
          w-full
          h-1/3
          bg-gradient-to-t
          from-green-300/30
          to-transparent
        "
      />

    </div>
  );
}
