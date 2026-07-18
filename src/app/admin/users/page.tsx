"use client";


import {
useEffect,
useState
}
from "react";


import {
collection,
getDocs
}
from "firebase/firestore";


import {
db
}
from "@/lib/firebase";


import AdminGuard
from "@/components/AdminGuard";


export default function UsersPage(){


const [users,setUsers]
=
useState<any[]>([]);



useEffect(()=>{


async function load(){


const result =
await getDocs(
collection(db,"users")
);


setUsers(

result.docs.map(
d=>({

id:d.id,
...d.data()

})
)

);


}


load();


},[]);



return (

<AdminGuard>


<main className="
p-8
">


<h1 className="
text-4xl
font-bold
">

👥 Users

</h1>



<div className="
mt-6 space-y-4
">


{
users.map(user=>(

<div

key={user.id}

className="
border
rounded-xl
p-5
"

>


<h2 className="font-bold">

{user.displayName || user.name}

</h2>


<p>
{user.email}
</p>


<p>
Role:
{user.role || "user"}
</p>


</div>


))
}


</div>


</main>


</AdminGuard>

)

}