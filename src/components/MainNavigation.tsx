"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signOut
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import { useRouter } from "next/navigation";


export default function MainNavigation(){

const [user,setUser]=useState<any>(null);

const router=useRouter();


useEffect(()=>{

return onAuthStateChanged(
auth,
(currentUser)=>{

setUser(currentUser);

});

},[]);



async function logout(){

await signOut(auth);

router.push("/");

}



return (

<header className="
border-b
bg-white
sticky
top-0
z-50
">


<nav className="
flex
items-center
justify-between
p-4
">


{/* Logo */}

<Link
href={user ? "/dashboard" : "/"}
className="font-bold text-xl"
>

❤️ I LOVE U

</Link>



{/* Main Menu */}

<div className="
hidden
md:flex
gap-5
">


<Link href="/dashboard">
🏠 Home
</Link>


{user && (

<>

<Link href="/spark">
❤️ Spark
</Link>


<Link href="/circle">
🤝 Circle
</Link>


<Link href="/shopping">
🛒 Shopping
</Link>


</>

)}



<Link href="/ideas">
💡 Ideas
</Link>



{user && (

<Link href="/messages">
💬 Messages
</Link>

)}



{user && (

<Link href="/identity">
👤 Identity Hub
</Link>

)}


</div>





{/* Account Area */}

<div>


{user ? (

<div className="flex gap-3 items-center">


<span>

👤
{user.isAnonymous
?
"Guest Heart"
:
"Member"}

</span>



<button
onClick={logout}
className="
border
rounded-xl
px-3
py-2
"
>

🚪

</button>


</div>


):(


<div className="flex gap-3">


<Link
href="/login"
>

🔐 Sign In

</Link>



<Link
href="/signup"
>

✨ Join

</Link>


</div>


)}


</div>



</nav>


</header>

);

}