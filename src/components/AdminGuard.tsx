"use client";


import {
useEffect,
useState
}
from "react";


import {
onAuthStateChanged
}
from "firebase/auth";


import {
auth
}
from "@/lib/firebase";


import {
checkAdmin
}
from "@/lib/admin";


import {
useRouter
}
from "next/navigation";


export default function AdminGuard({

children

}:{

children:React.ReactNode

}){


const router =
useRouter();


const [loading,setLoading]
=
useState(true);



useEffect(()=>{


const unsub =
onAuthStateChanged(

auth,

async(user)=>{


if(!user){

router.push("/login");

return;

}



const allowed =
await checkAdmin(
user.uid
);



if(!allowed){

router.push("/");

return;

}


setLoading(false);


}


);



return ()=>unsub();


},[router]);



if(loading){

return (

<div className="
p-10 text-center
">

Checking Admin Permission...

</div>

)

}



return children;


}