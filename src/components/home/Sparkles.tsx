"use client";

export default function Sparkles(){

  return (
    <>
      {Array.from({length:60}).map((_,i)=>(

        <div
          key={i}
          className="
            absolute
            text-yellow-200
            animate-pulse
          "
          style={{
            left:`${Math.random()*100}%`,
            top:`${Math.random()*100}%`,
            fontSize:
              `${5+Math.random()*12}px`,
            animationDelay:
              `${Math.random()*5}s`
          }}
        >
          ✨
        </div>

      ))}
    </>
  );
}
