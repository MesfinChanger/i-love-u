"use client";

export default function NightScene() {
  return (
    <div
      className="
        absolute inset-0
        bg-gradient-to-br
        from-indigo-200
        via-purple-100
        to-blue-200
      "
    >

      {/* Moon glow */}
      <div
        className="
          absolute
          top-20
          right-20
          w-40
          h-40
          rounded-full
          bg-white/60
          blur-2xl
        "
      />


      {/* Stars */}
      <div
        className="
          absolute
          top-10
          left-20
          w-2
          h-2
          rounded-full
          bg-white
          animate-pulse
        "
      />

      <div
        className="
          absolute
          top-40
          right-1/3
          w-3
          h-3
          rounded-full
          bg-white
          animate-pulse
        "
      />

    </div>
  );
}

