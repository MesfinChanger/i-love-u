'use client';

import { useEffect, useState, use } from "react";

import {
  Users,
  ShieldCheck,
  Crown,
  Loader2,
  Lock,
  ArrowLeft,
  UserRound,
  MapPin,
  BadgeCheck
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import GuestAccessGuard from "@/components/GuestAccessGuard";
import { Button } from "@/components/ui/button";

import Link from "next/link";

import { getCircleMembers } from "@/services/circle.service";
import {
  canManageMembers,
  canModerate,
  isOwner,
  isModerator
} from "@/services/circle-permission.service";
import { useUser } from "@/firebase";



function RoleBadge({
  role
}:{
  role:string
}){

  if(role === "owner"){

    return (
      <Badge className="bg-yellow-500 text-black">
        <Crown className="w-3 h-3 mr-1"/>
        Owner
      </Badge>
    );

  }


  if(role === "moderator"){

    return (
      <Badge className="bg-blue-600 text-white">
        <ShieldCheck className="w-3 h-3 mr-1"/>
        Moderator
      </Badge>
    );

  }


  return (
    <Badge variant="outline">

      <UserRound className="w-3 h-3 mr-1"/>

      Member

    </Badge>
  );

}




/**
 * Circle Members Registry
 *
 * Protected members-only area.
 * Displays public identity profiles
 * synchronized with circle membership.
 */
export default function MembersPage(
{
 params
}:{
 params: Promise<{
  circleId:string
 }>
}){


const {
 circleId
} = use(params);



const {
 user
} = useUser();



const [
 members,
 setMembers
] = useState<any[]>([]);



const [
 loading,
 setLoading
] = useState(true);



const [
 authorized,
 setAuthorized
] = useState(false);



const [
 checking,
 setChecking
] = useState(true);





useEffect(()=>{


async function verifyAndLoad(){


if(
 !circleId ||
 !user?.uid
){
 return;
}



try{


const role =
await getCircleRole(
 circleId,
 user.uid
);



const isMember =
role !== null &&
role !== "guest";



setAuthorized(isMember);



if(isMember){


const data =
await getCircleMembers(
 circleId
);


setMembers(data);


}



}
catch(error){

console.error(
 "Circle Registry Error:",
 error
);

}
finally{


setLoading(false);

setChecking(false);


}


}



verifyAndLoad();


},[
 circleId,
 user?.uid
]);






if(checking){


return (

<div className="
min-h-screen
bg-muted/30
flex
flex-col
items-center
justify-center
">


<Loader2
className="
animate-spin
w-12
h-12
text-primary
opacity-20
"
/>


<p className="
text-[10px]
font-black
uppercase
tracking-widest
text-muted-foreground
mt-4
">

Synchronizing Registry...

</p>


</div>

);


}





if(!authorized){


return (

<div className="
min-h-screen
bg-muted/30
pb-24
">


<Header/>


<main className="
container
mx-auto
max-w-lg
p-6
flex
items-center
justify-center
min-h-[60vh]
">


<Card className="
p-12
text-center
rounded-[3.5rem]
border-none
shadow-2xl
bg-white
space-y-8
">


<div className="
w-24
h-24
bg-primary/5
rounded-[2.5rem]
flex
items-center
justify-center
mx-auto
">


<Lock
className="
w-10
h-10
text-primary
opacity-20
"
/>


</div>



<h1 className="
text-3xl
font-black
uppercase
">

Members Only

</h1>


<p className="
text-muted-foreground
italic
">

Only synchronized members can access this registry.

</p>



<Button
asChild
className="
h-16
w-full
rounded-2xl
gradient-bg
font-black
uppercase
"
>


<Link href={`/circles/${circleId}`}>

<ArrowLeft className="w-4 h-4 mr-2"/>

Return to Circle

</Link>


</Button>



</Card>


</main>


<BottomNav/>


</div>

);


}





return (

<GuestAccessGuard feature="circle">


<div className="
min-h-screen
bg-muted/30
pb-24
">


<Header/>




<main className="
container
mx-auto
px-6
py-10
max-w-5xl
space-y-10
">



<div>

<h1 className="
text-5xl
font-black
flex
items-center
gap-4
uppercase
">

<Users
className="
text-primary
w-12
h-12
"/>

Registry

</h1>


<p className="
text-muted-foreground
italic
">

Every heart synchronized with this community.

</p>


</div>





{
loading ?


<div className="
flex
justify-center
py-40
">


<Loader2
className="
animate-spin
w-12
h-12
text-primary
opacity-20
"
/>


</div>



:


<div className="
grid
md:grid-cols-2
gap-6
">


{

members.length > 0 ?



members.map(member=>(


<Card
key={member.id}
className="
rounded-[2.5rem]
border-none
shadow-lg
bg-white
"
>


<CardContent
className="
p-8
flex
items-center
gap-6
"
>



<div className="
w-20
h-20
rounded-full
overflow-hidden
bg-primary/10
flex
items-center
justify-center
shrink-0
">


{

member.profile?.photoURL ?


<img

src={member.profile.photoURL}

alt="profile"

className="
w-full
h-full
object-cover
"

/>


:


<UserRound
className="
w-8
h-8
text-primary/40
"
/>


}



</div>





<div className="
space-y-3
"
>


<div className="
flex
items-center
gap-2
">


<h2 className="
font-black
text-xl
">

{

member.profile?.displayName ||

member.profile?.username ||

"Unknown Heart"

}

</h2>



{

member.profile?.verified &&

<BadgeCheck
className="
w-5
h-5
text-blue-500
"
/>

}


</div>




<RoleBadge
role={member.role}
/>





<div className="
flex
items-center
gap-1
text-xs
text-muted-foreground
">


<MapPin
className="w-3 h-3"
/>


{
member.profile?.country ||
"Global"
}


</div>




<p className="
text-xs
opacity-60
">


Reputation:

{member.reputation || 0}


</p>



</div>



</CardContent>


</Card>


))


:


<div className="
col-span-full
text-center
py-32
opacity-40
">


<p className="
font-black
uppercase
">

The registry is waiting.

</p>


</div>


}



</div>


}



</main>




<BottomNav/>


</div>


</GuestAccessGuard>

);


}