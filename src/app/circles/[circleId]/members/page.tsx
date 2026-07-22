'use client';

import { joinCircle } from "@/services/circle.service";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import GuestAccessGuard from "@/components/GuestAccessGuard";

import { Card, CardContent } from "@/components/ui/Card";

import { Users, Loader2 } from "lucide-react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";


export default function CircleMembersPage(){

  const params = useParams();
  const { user } = useUser();
const { toast } = useToast();

  const circleId = params?.circleId as string;

  const [members,setMembers] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);


  useEffect(()=>{

    async function loadMembers(){

      if(!circleId || !db) return;

      try{

        const snap = await getDocs(
          collection(
            db,
            "communities",
            circleId,
            "members"
          )
        );


        setMembers(
          snap.docs.map(doc=>({
            id:doc.id,
            ...doc.data()
          }))
        );


      }catch(error){

        console.error(error);

      }
      finally{

        setLoading(false);

      }

    }


    loadMembers();


  },[circleId]);



return (

<GuestAccessGuard feature="circle">

<div className="min-h-screen bg-muted/30 pb-24">

<Header/>


<main className="container mx-auto px-6 py-10 max-w-5xl">


<h1 className="text-4xl font-black flex items-center gap-3">

<Users/>

Circle Members

</h1>


{
loading ?

<div className="flex justify-center py-32">
<Loader2 className="animate-spin"/>
</div>


:

<Card className="mt-10 rounded-[2rem]">

<CardContent className="p-8 space-y-4">

{
members.length===0 ?

<p className="text-muted-foreground">
No members yet.
</p>


:

members.map(member=>(

<div
key={member.id}
className="p-4 rounded-xl bg-muted"
>

Member:
{member.userId}

<br/>

Role:
{member.role}

</div>

))

}


</CardContent>

</Card>


}


</main>


<BottomNav/>

</div>

</GuestAccessGuard>

);

}
