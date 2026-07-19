import {
    redirect
    }
    from "next/navigation";
    
    
    import {
    getUserRole
    }
    from "@/server/getUserRole";
    
    
    
    export async function requireAdmin(
    uid:string
    ){
    
    
    const role =
    await getUserRole(uid);
    
    
    
    if(
    role !== "admin"
    &&
    role !== "system_owner"
    
    ){
    
    redirect("/access-denied");
    
    }
    
    
    return true;
    
    
    }