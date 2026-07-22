import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "@/lib/firebase";


/**
 * Create Circle Protocol
 */
export async function createCircle(circle: {
  name: string;
  description: string;
  category: string;
  ownerId: string;
  privacy: "open" | "private";
  imageURL?: string;
}) {

  const ref = await addDoc(
    collection(db, "communities"),
    {
      ...circle,
      memberCount: 1,
      createdAt: serverTimestamp()
    }
  );


  await setDoc(
    doc(
      db,
      "communities",
      ref.id,
      "members",
      circle.ownerId
    ),
    {
      userId: circle.ownerId,
      role: "owner",
      status: "active",
      joinedAt: serverTimestamp()
    }
  );


  return ref.id;
}



/**
 * Discover Circles
 */
export async function discoverCircles(){

  const snapshot =
    await getDocs(
      collection(db,"communities")
    );


  return snapshot.docs.map(doc=>({
    id:doc.id,
    ...doc.data()
  }));

}




/**
 * Join Circle
 */
export async function joinCircle(
  circleId:string,
  userId:string
){

  const memberRef =
    doc(
      db,
      "communities",
      circleId,
      "members",
      userId
    );


  const existing =
    await getDoc(memberRef);


  if(existing.exists()){
    return false;
  }



  await setDoc(
    memberRef,
    {
      userId,
      role:"member",
      status:"active",
      joinedAt:serverTimestamp()
    }
  );


  return true;

}





/**
 * Get Circle Members
 * Synchronizes membership + public profile signatures
 */
export async function getCircleMembers(
  circleId: string
) {
  if (!circleId || !db) {
    return [];
  }

  const snapshot = await getDocs(
    collection(db, "communities", circleId, "members")
  );

  const members = [];

  for (const memberDoc of snapshot.docs) {
    const member = memberDoc.data();

    if (!member.userId) continue;

    const userSnap = await getDoc(
      doc(db, "publicProfiles", member.userId)
    );

    members.push({
      id: memberDoc.id,
      ...member,
      profile: userSnap.exists()
        ? userSnap.data()
        : null
    });
  }

  return members;
}
