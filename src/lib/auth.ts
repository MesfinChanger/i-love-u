import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  User
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import {
  auth,
  db
} from "./firebase";

export async function registerUser(
  email:string,
  password:string,
  displayName:string
){
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = result.user;
  await sendEmailVerification(user);
  await createUserProfile(user, displayName);
  return user;
}

async function createUserProfile(
  user:User,
  displayName:string
){
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      email: user.email,
      displayName,
      role: "user",
      accountType: "User",
      status: "active",
      createdAt: serverTimestamp(),
      photoURL: user.photoURL || ""
    }
  );
}

export async function loginUser(
  email:string,
  password:string
){
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logoutUser(){
  return await signOut(auth);
}

export async function resetPassword(
  email:string
){
  return await sendPasswordResetEmail(auth, email);
}
