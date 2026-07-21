"use client";

export default function FlowerScene() {
  return (
    <div
      className="
        absolute inset-0
        bg-gradient-to-br
        from-pink-100
        via-green-50
        to-blue-100
      "
    >
      <div
        className="
          absolute
          bottom-0
          w-full
          h-1/3
          bg-gradient-to-t
          from-green-200/70
          to-transparent
        "
      />
    </div>
  );
}
