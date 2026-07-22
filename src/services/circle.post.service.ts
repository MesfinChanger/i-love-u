'use client';

import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";

import { db } from "@/lib/firebase";


export async function createCirclePost(
  circleId:string,
  userId:string,
  data:{
    title:string;
    content:string;
    category?:string;
  }
){

const ref = await addDoc(

collection(
db,
"communities",
circleId,
"posts"
),

{

userId,

title:data.title,

content:data.content,

category:data.category || "General",

likes:0,

createdAt:serverTimestamp()

}

);


return ref.id;

}



export async function getCirclePosts(
circleId:string
){

const snapshot = await getDocs(

query(

collection(
db,
"communities",
circleId,
"posts"
),

orderBy(
"createdAt",
"desc"
)

)

);


return snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}));

}