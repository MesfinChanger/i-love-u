import {
   requireAdmin
   }
   from "@/security/adminGuard";
   
   
   
   export default async function AdminPage(){
   
   
   const uid="CURRENT_USER_ID";
   
   
   
   await requireAdmin(uid);
   
   
   
   return (
   
   <div>
   
   <h1>
   ❤️ I LOVE U
   Admin Center
   </h1>
   
   
   <p>
   Welcome Administrator
   </p>
   
   
   </div>
   
   );
   
   
   }