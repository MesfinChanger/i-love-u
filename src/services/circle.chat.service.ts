import {
    addDoc,
    collection,
    serverTimestamp,
    query,
    orderBy,
    getDocs
    } from "firebase/firestore";
    
    import { db } from "@/lib/firebase";
    
    export async function sendCircleMessage(
    circleId:string,
    userId:string,
    text:string
    ){
    
    return addDoc(
    
    collection(
    db,
    "communities",
    circleId,
    "messages"
    ),
    
    {
    
    userId,
    
    text,
    
    createdAt:serverTimestamp()
    
    }
    
    );
    
    }
    
    export async function loadCircleMessages(
    circleId:string
    ){
    
    const snapshot=await getDocs(
    
    query(
    
    collection(
    db,
    "communities",
    circleId,
    "messages"
    ),
    
    orderBy("createdAt","asc")
    
    )
    
    );
    
    return snapshot.docs.map(doc=>({
    
    id:doc.id,
    
    ...doc.data()
    
    }));
    
    }