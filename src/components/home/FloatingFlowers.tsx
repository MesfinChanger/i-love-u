"use client";

const flowers = [
  { emoji: "🌸", left: "10%", top: "20%", size: "32px", delay: "0s", duration: "18s" },
  { emoji: "🌷", left: "75%", top: "15%", size: "36px", delay: "2s", duration: "22s" },
  { emoji: "🌺", left: "25%", top: "70%", size: "30px", delay: "4s", duration: "20s" },
  { emoji: "🌼", left: "85%", top: "65%", size: "34px", delay: "1s", duration: "25s" },
  { emoji: "🌸", left: "50%", top: "35%", size: "28px", delay: "3s", duration: "19s" },
  { emoji: "🌷", left: "15%", top: "85%", size: "38px", delay: "5s", duration: "24s" },
];

export default function FloatingFlowers() {
  return (
    <>
      {flowers.map((flower, index) => (
        <div
          key={index}
          className="absolute opacity-70 animate-float pointer-events-none"
          style={{
            left: flower.left,
            top: flower.top,
            fontSize: flower.size,
            animationDelay: flower.delay,
            animationDuration: flower.duration,
          }}
        >
          {flower.emoji}
        </div>
      ))}
    </>
  );
}
