"use client";

export default function WaterfallScene() {
  return (
    <div
      className="
        absolute inset-0
        bg-gradient-to-br
        from-blue-100
        via-cyan-50
        to-green-100
      "
    >
      <div
        className="
          absolute
          top-10
          left-1/2
          -translate-x-1/2
          w-40
          h-96
          rounded-full
          bg-blue-300/30
          blur-2xl
          animate-pulse
        "
      />
    </div>
  );
}
