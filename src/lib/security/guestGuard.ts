import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


export async function checkGuestAccess(uid:string){

  const ref = doc(db,"guestSessions",uid);

  const snap = await getDoc(ref);


  if(!snap.exists()){
    return {
      allowed:false
    };
  }


  const data = snap.data();


  const expires =
    data.expiresAt?.toDate();


  if(!expires){
    return {
      allowed:false
    };
  }


  if(new Date() > expires){

    return {
      allowed:false,
      expired:true
    };

  }


  return {
    allowed:true,
    permissions:data.permissions
  };

}