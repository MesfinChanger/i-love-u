
'use client';

import { useState } from "react";
import { Button } from '@/components/ui/button';
import { createSparkConnection } from '@/services/spark/connection.service';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * @fileOverview Connection Protocol Service.
 * Orchestrates the creation of high-fidelity community bonds and conversation rooms.
 */

/**
 * Create Spark Connection Protocol.
 * Registers a new connection and initializes a secured conversation room.
 */
export async function createSparkConnection(
  userA: string,
  userB: string
) {
  // 1. Establish the community bond record
  const connectionRef = await addDoc(
    collection(db, "sparkConnections"),
    {
      userIds: [userA, userB],
      status: "active",
      createdAt: serverTimestamp()
    }
  );

  // 2. Initialize the high-fidelity conversation room
  const conversationRef = await addDoc(
    collection(db, "conversations"),
    {
      participants: [userA, userB],
      type: "spark",
      connectionId: connectionRef.id,
      createdAt: serverTimestamp()
    }
  );

  return {
    connectionId: connectionRef.id,
    conversationId: conversationRef.id
  };
}function GreetingCard({ greeting }: { greeting: any }) {

  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {

    if (loading) return;

    setLoading(true);

    try {

      const result = await createSparkConnection(
        greeting.fromUserId,
        greeting.toUserId
      );

      toast({
        title: "Spark Connected ❤️",
        description: "Conversation channel created."
      });


      router.push(
        `/messages/${result.conversationId}`
      );


    } catch(error){

      console.error(error);

      toast({
        variant:"destructive",
        title:"Connection failed",
        description:"Unable to create conversation."
      });

    } finally {

      setLoading(false);

    }

  };
  <div className="flex gap-2">

<Button
onClick={handleAccept}
disabled={loading}
className="
rounded-xl 
h-10 
px-5 
text-[9px]
font-black
uppercase
tracking-widest
bg-primary
text-white
"
>

{loading ? (
<Loader2 className="w-3 h-3 animate-spin"/>
):
(
<>
Accept ❤️
<ArrowRight className="w-3 h-3"/>
</>
)}

</Button>


<Button
variant="outline"
className="
rounded-xl
h-10
px-5
text-[9px]
font-black
uppercase
"
>
Decline
</Button>

</div>
