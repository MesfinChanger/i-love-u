import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    addDoc,
    serverTimestamp
  } from "firebase/firestore";
  
  import { db } from "@/lib/firebase";
  
  
  const MAX_ATTEMPTS = 5;
  
  const LOCK_TIME = 10 * 60 * 1000;
  
  
  
  export async function checkLoginLock(uid:string){
  
    const userRef = doc(
      db,
      "users",
      uid
    );
  
  
    const snap = await getDoc(userRef);
  
  
    if(!snap.exists()){
  
      return {
        locked:false
      };
  
    }
  
  
    const data = snap.data();
  
  
    if(
      data.lockedUntil &&
      data.lockedUntil > Date.now()
    ){
  
      return {
  
        locked:true,
  
        remaining:
          Math.ceil(
            (data.lockedUntil-Date.now())
            /1000
          )
  
      };
  
    }
  
  
  
    return {
  
      locked:false
  
    };
  
  
  }
  
  
  
  
  
  
  
  export async function recordFailedLogin(
    email:string
  ){
  
    await addDoc(
      collection(
        db,
        "securityLogs"
      ),
      {
  
        email,
  
        action:
          "LOGIN_FAILED",
  
        success:false,
  
        timestamp:
          serverTimestamp()
  
      }
    );
  
  }
  
  
  
  
  
  
  
  export async function recordSuccessfulLogin(
    uid:string,
    email:string
  ){
  
  
    await addDoc(
      collection(
        db,
        "securityLogs"
      ),
      {
  
        email,
  
        uid,
  
        action:
          "LOGIN_SUCCESS",
  
        success:true,
  
        timestamp:
          serverTimestamp()
  
      }
    );
  
  
  
  
    await setDoc(
      doc(
        db,
        "users",
        uid
      ),
      {
  
        loginAttempts:0,
  
        lockedUntil:null,
  
        lastLogin:
          serverTimestamp()
  
      },
  
      {
        merge:true
      }
  
    );
  
  }
  
  
  
  
  
  
  
  export async function increaseLoginAttempts(
    uid:string,
    email:string
  ){
  
  
    const userRef =
      doc(
        db,
        "users",
        uid
      );
  
  
    const snap =
      await getDoc(userRef);
  
  
  
    let attempts =
      1;
  
  
  
    if(snap.exists()){
  
      attempts =
        (snap.data().loginAttempts || 0)+1;
  
    }
  
  
  
    const update:any = {
  
      loginAttempts:
        attempts
  
    };
  
  
  
    if(attempts >= MAX_ATTEMPTS){
  
  
      update.lockedUntil =
        Date.now()+LOCK_TIME;
  
  
    }
  
  
  
  
    await setDoc(
      userRef,
      update,
      {
        merge:true
      }
    );
  
  
  
    await recordFailedLogin(email);
  
  
  }