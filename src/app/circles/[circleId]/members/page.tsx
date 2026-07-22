'use client';


import {
useEffect,
useState
} from "react";


import {
useParams
} from "next/navigation";


import {
Users,
ShieldCheck,
Crown,
Loader2
} from "lucide-react";


import {
Card,
CardContent
} from "@/components/ui/Card";


import {
Badge
} from "@/components/ui/badge";


import {
Header
} from "@/components/Header";


import {
BottomNav
} from "@/components/BottomNav";


import GuestAccessGuard from "@/components/GuestAccessGuard";


import {
getCircleMembers
} from "@/services/circle.service";



export default function MembersPage(){


const params = useParams();


const circleId =
params?.circleId as string;



const [
members,
setMembers
]=useState<any[]>([]);



const [
loading,
setLoading
]=useState(true);



useEffect(()=>{


async function load(){


if(!circleId)
return;


try{


const data =
await getCircleMembers(circleId);


setMembers(data);


}

catch(error){

console.error(error);

}

finally{

setLoading(false);

}


}


load();


},[circleId]);




return (

<GuestAccessGuard feature="circle">


<div className="min-h-screen bg-muted/30 pb-24">


<Header/>


<main className="
container
mx-auto
px-6
py-10
max-w-5xl
space-y-8
">


<h1 className="
text-5xl
font-black
flex
items-center
gap-4
">

<Users className="text-primary"/>

Members

</h1>



{
loading ?

<div className="flex justify-center py-40">

<Loader2 className="
animate-spin
w-12
h-12
"/>

</div>


:


<div className="
grid
md:grid-cols-2
gap-6
">


{
members.map(member=>(


<Card
key={member.id}
className="
rounded-[2rem]
border-none
shadow-lg
"
>


<CardContent className="
p-8
flex
items-center
gap-5
">


<div className="
w-20
h-20
rounded-full
bg-primary/10
flex
items-center
justify-center
text-3xl
font-black
">


{
member.profile?.displayName
?.charAt(0)
||
"?"
}


</div>




<div>


<h2 className="
text-xl
font-black
">

{
member.profile?.displayName
||
"Unknown Heart"
}

</h2>


<Badge
className="mt-2"
>


{
member.role==="owner"
&&
<Crown className="w-3 h-3 mr-1"/>
}


{
member.role==="admin"
&&
<ShieldCheck className="w-3 h-3 mr-1"/>
}



{
member.role
}


</Badge>


</div>


</CardContent>


</Card>


))

}


</div>


}



</main>


<BottomNav/>


</div>


</GuestAccessGuard>

);


}