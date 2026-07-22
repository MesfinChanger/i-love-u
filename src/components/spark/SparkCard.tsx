'use client';

import { Card } from "@/components/ui/Card";
import { sendSparkGreeting } from "@/services/spark/greeting.service";
import { useAuth, useFirestore } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, Sparkles, Heart } from "lucide-react";

/**
 * @fileOverview Spark Card Component.
 * Allows users to send personalized Spark greetings.
 */

export default function SparkCard({
  id,
  name,
  country
}: {
  id: string;
  name: string;
  country: string;
}) {

  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);


  const handleSendGreeting = async () => {

    if (!message.trim()) {
      toast({
        title: "Write a message first",
        description: "A respectful greeting is required."
      });
      return;
    }


    if (!auth?.currentUser || !db || isSending) {
      return;
    }


    setIsSending(true);


    try {

      await sendSparkGreeting(db, {
        fromUserId: auth.currentUser.uid,
        toUserId: id,
        message: message.trim()
      });


      toast({
        title: "Greeting Sent ❤️",
        description: "Your respectful spark has been delivered."
      });


      setMessage("");


    } catch (error) {

      console.error("Spark Greeting Error:", error);

      toast({
        title: "Unable to send greeting",
        description: "Please try again."
      });


    } finally {

      setIsSending(false);

    }

  };


  return (

    <Card className="
      hover:scale-[1.02]
      transition-transform
      border-primary/5
      bg-white
      relative
      overflow-hidden
      p-6
    ">

      <Heart 
        className="
          absolute 
          top-4 
          right-4 
          w-6 
          h-6 
          text-primary 
          opacity-10
        "
      />


      <div className="space-y-4">


        <div>

          <h2 className="
            text-2xl 
            font-black 
            uppercase 
            text-slate-900 
            leading-none
          ">
            ❤️ {name}
          </h2>


          <p className="
            mt-2 
            text-sm 
            italic 
            text-muted-foreground
          ">
            🌍 {country}
          </p>

        </div>



        <div className="
          flex 
          items-center 
          gap-2
        ">

          <Badge className="
            bg-primary/5 
            text-primary 
            text-[10px]
            uppercase
            font-black
            px-3
            py-1
            rounded-full
          ">

            <Sparkles className="w-3 h-3 mr-1" />

            Shared Values

          </Badge>

        </div>



        <textarea

          value={message}

          onChange={(e)=>setMessage(e.target.value)}

          placeholder="Write a respectful greeting..."

          className="
            w-full
            rounded-xl
            border-2
            border-primary/10
            p-4
            min-h-[100px]
            text-sm
            resize-none
          "

        />



        <Button

          onClick={handleSendGreeting}

          disabled={isSending}

          className="
            w-full
            bg-white
            hover:bg-primary
            hover:text-white
            border-2
            border-primary/10
            rounded-xl
            h-14
            font-black
            uppercase
            text-[10px]
            transition-all
          "

        >

          {
            isSending 
            ? 
            <Loader2 className="w-4 h-4 animate-spin" /> 
            : 
            "👋 Send Greeting"
          }

        </Button>


      </div>


    </Card>

  );

}



function Badge({ children, className }: any) {

  return (

    <span className={className}>
      {children}
    </span>

  );

}