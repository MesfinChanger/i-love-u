'use client';


import {
useEffect,
useState
} from "react";

import {
useParams
} from "next/navigation";


import {
Header
} from "@/components/Header";

import {
BottomNav
} from "@/components/BottomNav";


import GuestAccessGuard 
from "@/components/GuestAccessGuard";


import {
Card,
CardContent
} from "@/components/ui/Card";


import {
Button
} from "@/components/ui/button";


import {
Input
} from "@/components/ui/input";


import {
Lightbulb,
Plus
} from "lucide-react";


import {
createCirclePost,
getCirclePosts
} from "@/services/circle.post.service";



export default function CirclePostsPage(){


const {
circleId
}=useParams();


const [posts,setPosts]=useState<any[]>([]);


const [title,setTitle]=useState("");

const [content,setContent]=useState("");



async function load(){

const data =
await getCirclePosts(
circleId as string
);

setPosts(data);

}



useEffect(()=>{

load();

},[]);



async function publish(){


if(!title || !content)
return;



await createCirclePost(

circleId as string,

"guest",

{

title,

content

}

);



setTitle("");

setContent("");

load();

}



return(

<GuestAccessGuard feature="circle">


<div className="min-h-screen bg-muted/30 pb-24">

<Header/>


<main className="container mx-auto max-w-5xl p-6 space-y-8">


<div className="flex items-center gap-3">

<Lightbulb className="w-10 h-10 text-primary"/>

<h1 className="text-4xl font-black">

Circle Ideas

</h1>

</div>



<Card className="rounded-[2rem]">


<CardContent className="p-8 space-y-4">


<Input

placeholder="Idea title"

value={title}

onChange={
e=>setTitle(e.target.value)
}

/>


<textarea

placeholder="Share your idea..."

value={content}

onChange={
e=>setContent(e.target.value)
}

className="
w-full
min-h-[150px]
rounded-xl
border
p-4
"

/>



<Button
onClick={publish}
className="rounded-xl"
>

<Plus className="mr-2"/>

Publish Idea

</Button>



</CardContent>


</Card>





<div className="space-y-5">


{
posts.map(post=>(

<Card
key={post.id}
className="rounded-[2rem]"
>


<CardContent className="p-8">


<h2 className="text-2xl font-black">

{post.title}

</h2>


<p className="mt-3 text-muted-foreground">

{post.content}

</p>


</CardContent>


</Card>


))

}


</div>


</main>


<BottomNav/>

</div>


</GuestAccessGuard>

);


}