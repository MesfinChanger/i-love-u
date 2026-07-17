"use client";


import Link from "next/link";


export default function SparkPage(){


return (

<main className="
p-6
space-y-6
pb-24
">


<section className="
rounded-2xl
border
p-6
">


<h1 className="
text-4xl
font-bold
">

❤️ Spark

</h1>


<p className="mt-3">

Discover meaningful connections built on
respect, compatibility, and shared values.

</p>


</section>



<section className="
grid
md:grid-cols-3
gap-5
">


<Link
href="/spark/discover"
className="
rounded-2xl
border
p-6
"
>

<h2 className="text-2xl font-bold">

🌎 Discover Hearts

</h2>


<p className="mt-2">

Explore people who share your values.

</p>

</Link>




<Link
href="/spark/preferences"
className="
rounded-2xl
border
p-6
"
>

<h2 className="text-2xl font-bold">

❤️ Preferences

</h2>


<p className="mt-2">

Define your connection goals.

</p>

</Link>





<Link
href="/spark/connections"
className="
rounded-2xl
border
p-6
"
>

<h2 className="text-2xl font-bold">

🤝 Connections

</h2>


<p className="mt-2">

Manage your relationships.

</p>

</Link>



</section>





<section className="
rounded-2xl
border
p-6
">


<h2 className="text-2xl font-bold">

🔐 Secure Communication

</h2>


<p className="mt-3">

Messages are designed for private,
end-to-end encrypted conversations.

</p>


<Link
href="/messages"
className="
inline-block
mt-4
border
rounded-xl
px-5
py-2
"
>

💬 Open Messages

</Link>


</section>


</main>

);


}
