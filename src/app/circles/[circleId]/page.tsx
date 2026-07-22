'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import GuestAccessGuard from "@/components/GuestAccessGuard";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Users,
  MessageSquare,
  Lightbulb,
  ShoppingBag,
  ShieldCheck,
  Loader2,
  ArrowRight,
  Globe
} from "lucide-react";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


export default function CircleSpacePage() {

  const params = useParams();

  const circleId = params?.circleId as string;

  const [circle, setCircle] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function loadCircle(){

      if(!circleId || !db) return;

      try {

        const ref = doc(
          db,
          "communities",
          circleId
        );

        const snap = await getDoc(ref);


        if(snap.exists()){

          setCircle({
            id:snap.id,
            ...snap.data()
          });

        }


      } catch(error){

        console.error(
          "Circle loading error:",
          error
        );

      }
      finally{

        setLoading(false);

      }

    }


    loadCircle();


  },[circleId]);



  return (

    <GuestAccessGuard feature="circle">

      <div className="min-h-screen bg-muted/30 pb-24">

        <Header/>


        <main className="container mx-auto px-6 py-10 max-w-5xl">


        {
          loading ? (

            <div className="flex justify-center py-40">

              <Loader2 className="w-12 h-12 animate-spin text-primary"/>

            </div>

          ) : !circle ? (

            <Card className="rounded-[3rem] p-16 text-center">

              <h1 className="text-3xl font-black">
                Circle Not Found
              </h1>

              <p className="mt-4 text-muted-foreground">
                This community space does not exist.
              </p>

            </Card>

          ) : (

            <div className="space-y-10">


              {/* HEADER */}

              <Card className="rounded-[3rem] overflow-hidden border-none shadow-xl">

                <div className="h-72 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center">

                  <Globe className="w-32 h-32 text-white opacity-80"/>

                </div>


                <CardContent className="p-10 space-y-6">


                  <div className="flex flex-wrap gap-3">

                    <Badge>
                      {circle.category}
                    </Badge>


                    <Badge variant="outline">
                      {circle.privacy}
                    </Badge>


                    <Badge variant="outline">
                      <Users className="w-3 h-3 mr-1"/>
                      {circle.memberCount || 1} Hearts
                    </Badge>


                  </div>



                  <h1 className="text-5xl font-black tracking-tight">

                    {circle.name}

                  </h1>


                  <p className="text-lg italic text-muted-foreground">

                    "{circle.description}"

                  </p>



                  <div className="flex gap-4">

                    <Button className="rounded-2xl h-14 px-8 font-black">

                      Join Circle

                    </Button>

                  </div>


                </CardContent>

              </Card>




              {/* FEATURES */}


              <div className="grid md:grid-cols-2 gap-6">


                <FeatureCard

                  icon={<MessageSquare/>}

                  title="Circle Chat"

                  text="Discuss, collaborate and connect with members."

                  href={`/circles/${circleId}/chat`}

                />


                <FeatureCard

                  icon={<Lightbulb/>}

                  title="Ideas"

                  text="Create innovations and prosperity projects."

                  href={`/circles/${circleId}/posts`}

                />


                <FeatureCard

                  icon={<Users/>}

                  title="Members"

                  text="See community members and roles."

                  href={`/circles/${circleId}/members`}

                />


                <FeatureCard

                  icon={<ShoppingBag/>}

                  title="Circle Shop"

                  text="Trade products and services together."

                  href="/shopping"

                />


              </div>



              <Card className="rounded-[3rem] border-none bg-white shadow-lg">

                <CardContent className="p-10 flex items-center gap-5">

                  <ShieldCheck className="w-12 h-12 text-green-500"/>

                  <div>

                    <h3 className="font-black text-xl">
                      Respect & Love Protocol
                    </h3>

                    <p className="text-muted-foreground">
                      Every Circle follows safe community principles.
                    </p>

                  </div>


                </CardContent>

              </Card>


            </div>

          )
        }


        </main>


        <BottomNav/>


      </div>


    </GuestAccessGuard>

  );

}



function FeatureCard({

icon,
title,
text,
href

}:{

icon:any;
title:string;
text:string;
href:string;

}){


return (

<Link href={href}>


<Card className="rounded-[2rem] border-none shadow-md hover:shadow-xl transition">


<CardContent className="p-8 space-y-4">


<div className="text-primary">

{icon}

</div>


<h3 className="text-2xl font-black">

{title}

</h3>


<p className="text-muted-foreground">

{text}

</p>


<ArrowRight className="w-5 h-5"/>


</CardContent>


</Card>


</Link>

);


}

