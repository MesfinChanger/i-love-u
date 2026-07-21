"use client";

const hearts = [
  {left:"8%", top:"25%", size:"28px", delay:"0s"},
  {left:"80%", top:"20%", size:"36px", delay:"2s"},
  {left:"35%", top:"75%", size:"22px", delay:"4s"},
  {left:"65%", top:"55%", size:"32px", delay:"1s"},
  {left:"90%", top:"80%", size:"25px", delay:"3s"},
];

export default function FloatingHearts(){
  return (
    <>
      {hearts.map((heart,index)=>(
        <div
          key={index}
          className="absolute text-pink-400 opacity-40 animate-heartbeat pointer-events-none"
          style={{
            left:heart.left,
            top:heart.top,
            fontSize:heart.size,
            animationDelay:heart.delay
          }}
        >
          ❤️
        </div>
      ))}
    </>
  );
}
