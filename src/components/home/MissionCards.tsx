"use client";

const missions = [
  {
    icon:"🌍",
    title:"Zero Poverty",
    text:"Eliminating world poverty through global job creation."
  },
  {
    icon:"🔒",
    title:"Safe Spaces",
    text:"End-to-End encrypted conversations for your security."
  },
  {
    icon:"🌱",
    title:"Reach Every Village",
    text:"Extending prosperity to the furthest corners of the globe."
  },
  {
    icon:"❤️",
    title:"Support The Fund",
    text:"Eliminating world poverty together."
  }
];


export default function MissionCards(){

 return (

<section className="
px-6
pb-20
max-w-6xl
mx-auto
">

<div className="
grid
md:grid-cols-4
gap-6
">

{missions.map((m)=>(
<div
key={m.title}
className="
bg-white/10
backdrop-blur-xl
border
border-white/20
rounded-3xl
p-6
text-center
text-white
hover:scale-105
transition
shadow-xl
"
>

<div className="text-5xl mb-4">
{m.icon}
</div>

<h3 className="
font-black
text-xl
">
{m.title}
</h3>

<p className="
mt-3
text-sm
text-white/70
">
{m.text}
</p>

</div>
))}

</div>

</section>

 );

}
