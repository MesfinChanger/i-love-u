import {
    adminDb
    }
    from "@/lib/firebase-admin";
    
    
    
    export async function getUserRole(
    uid:string
    ){
    
    
    const userDoc =
    await adminDb
    .collection("users")
    .doc(uid)
    .get();
    
    
    
    if(!userDoc.exists){
    
    return "guest";
    
    }
    
    
    
    return (
    userDoc.data()?.role
    ||
    "guest"
    );
    
    
    }