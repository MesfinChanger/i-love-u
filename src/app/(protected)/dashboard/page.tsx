'use client';

import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import {
  Heart,
  Sparkles,
  TrendingUp,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
  Lightbulb,
  Globe,
  MessageCircle,
  ShoppingBag
} from 'lucide-react';

import Link from 'next/link';

import AuthGuard from '@/components/AuthGuard';

import { cn } from '@/lib/utils';

import { useUser } from '@/firebase';



export default function DashboardPage() {


  const { user } = useUser();


  const name =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Heart";



  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      :
    hour < 18
      ? "Good Afternoon"
      :
      "Good Evening";




  return (

    <AuthGuard>

      <div
        className="
        flex
        flex-col
        min-h-screen
        pb-24
        relative
        overflow-hidden
        bg-gradient-to-br
        from-white
        via-pink-50
        to-blue-50
        "
      >


        {/* Glow background */}

        <div
          className="
          absolute
          -top-40
          -left-40
          w-96
          h-96
          bg-pink-200/40
          blur-3xl
          rounded-full
          "
        />


        <div
          className="
          absolute
          bottom-0
          right-0
          w-96
          h-96
          bg-blue-200/40
          blur-3xl
          rounded-full
          "
        />



        <Header />



        <main
          className="
          relative
          z-10
          container
          mx-auto
          px-6
          py-10
          max-w-5xl
          space-y-10
          "
        >



          {/* Welcome */}

          <section
            className="
            flex
            flex-col
            md:flex-row
            justify-between
            gap-6
            "
          >


            <div>

              <p
                className="
                text-sm
                font-bold
                text-primary
                uppercase
                tracking-widest
                "
              >
                {greeting}
              </p>


              <h1
                className="
                text-5xl
                font-black
                tracking-tight
                "
              >
                {name} ❤️
              </h1>


              <p
                className="
                mt-3
                text-muted-foreground
                italic
                "
              >
                Your presence fuels the Prosperity Revolution.
              </p>


            </div>




            <div
              className="
              bg-white
              shadow-xl
              rounded-full
              px-6
              py-4
              flex
              items-center
              gap-3
              "
            >

              <ShieldCheck
                className="
                text-green-500
                "
              />

              <span
                className="
                text-xs
                font-black
                uppercase
                tracking-widest
                "
              >
                Verified Heart
              </span>


            </div>



          </section>





          {/* Main Cards */}

          <div
            className="
            grid
            md:grid-cols-3
            gap-6
            "
          >


            <MetricCard

              title="Daily Sparks"

              value="12"

              icon={<Heart/>}

              href="/spark"

              color="text-pink-500"

            />


            <MetricCard

              title="Idea Pool"

              value="Active"

              icon={<Lightbulb/>}

              href="/ideas"

              color="text-yellow-500"

            />



            <MetricCard

              title="Global Circle"

              value="Connected"

              icon={<Globe/>}

              href="/circle"

              color="text-blue-500"

            />


          </div>





          {/* Mission */}

          <Card
            className="
            border-none
            rounded-[3rem]
            shadow-xl
            bg-white/90
            backdrop-blur
            overflow-hidden
            "
          >


            <CardHeader className="p-10">


              <div
                className="
                flex
                items-center
                gap-4
                text-primary
                "
              >

                <Zap
                  className="
                  w-8
                  h-8
                  "
                />


                <CardTitle
                  className="
                  text-3xl
                  font-black
                  "
                >
                  Mission Control
                </CardTitle>


              </div>


            </CardHeader>



            <CardContent
              className="
              p-10
              pt-0
              space-y-6
              "
            >


              <p
                className="
                text-lg
                text-slate-600
                italic
                "
              >

                Respect & Love is Mandatory.
                Every connection, idea, and action helps build a stronger world.

              </p>




              <div
                className="
                flex
                flex-wrap
                gap-4
                "
              >


                <Button asChild>

                  <Link href="/discover">

                    <Sparkles className="mr-2"/>

                    Discover

                  </Link>

                </Button>




                <Button
                  variant="outline"
                  asChild
                >

                  <Link href="/messages">

                    <MessageCircle className="mr-2"/>

                    Messages

                  </Link>


                </Button>




                <Button
                  variant="outline"
                  asChild
                >

                  <Link href="/shopping">

                    <ShoppingBag className="mr-2"/>

                    Shop

                  </Link>


                </Button>


              </div>


            </CardContent>


          </Card>



        </main>



        <BottomNav />


      </div>


    </AuthGuard>

  );

}




function MetricCard({
  title,
  value,
  icon,
  href,
  color
}:{
  title:string;
  value:string;
  icon:React.ReactNode;
  href:string;
  color:string;
}){


return (

<Link href={href}>


<Card
className="
rounded-[2.5rem]
border-none
shadow-lg
bg-white/90
hover:shadow-2xl
transition-all
"
>


<CardContent
className="
p-8
space-y-5
"
>


<div
className={cn(
"w-14 h-14 rounded-2xl bg-muted flex items-center justify-center",
color
)}
>

{icon}

</div>



<div>

<p
className="
text-xs
font-black
uppercase
tracking-widest
text-muted-foreground
"
>

{title}

</p>


<p
className="
text-3xl
font-black
"
>

{value}

</p>


</div>



<div
className="
text-primary
flex
items-center
gap-2
text-xs
font-bold
"
>

Open

<ArrowRight size={14}/>


</div>



</CardContent>


</Card>


</Link>

);


}