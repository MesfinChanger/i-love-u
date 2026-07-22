import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  setDoc
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  getCircleRole,
  canChangeRole,
  canRemoveMember,
  CircleMemberPermission
} from "@/services/circle-permission.service";

/**
 * Get all circle members
 */
export async function getAllCircleMembers(
  circleId:string
){
  if(!db || !circleId){
    throw new Error(
      "Invalid circle"
    );
  }

  const snapshot =
    await getDocs(
      collection(
        db,
        "communities",
        circleId,
        "members"
      )
    );

  return snapshot.docs.map(
    item=>({
      id:item.id,
      ...item.data()
    })
  );
}

/**
 * Change member role
 * OWNER ONLY
 */
export async function changeMemberRole(
 circleId:string,
 targetUserId:string,
 newRole: "member" | "moderator",
 requesterId:string
){
 if(!db){
   throw new Error("Firebase unavailable");
 }

 const requesterRole = await getCircleRole(circleId, requesterId);
 const targetRole = await getCircleRole(circleId, targetUserId);

 const requester: CircleMemberPermission = {
   userId: requesterId,
   role: requesterRole
 };

 const target: CircleMemberPermission = {
   userId: targetUserId,
   role: targetRole
 };

 if (!canChangeRole(requester, target)) {
   throw new Error("Unauthorized role change");
 }

 await updateDoc(
   doc(db, "communities", circleId, "members", targetUserId),
   {
    role: newRole,
    updatedAt: serverTimestamp()
   }
 );

 await createCircleAuditLog(
   circleId,
   requesterId,
   "ROLE_CHANGE",
   { targetUserId, newRole }
 );
}

/**
 * Remove member
 * OWNER ONLY
 */
export async function removeMember(
 circleId:string,
 targetUserId:string,
 requesterId:string
){
 if(!db){
  throw new Error("Firebase unavailable");
 }

 const requesterRole = await getCircleRole(circleId, requesterId);
 const targetRole = await getCircleRole(circleId, targetUserId);

 const requester: CircleMemberPermission = {
   userId: requesterId,
   role: requesterRole
 };

 const target: CircleMemberPermission = {
   userId: targetUserId,
   role: targetRole
 };

 if (!canRemoveMember(requester, target)) {
   throw new Error("Unauthorized removal");
 }

 await deleteDoc(
  doc(db, "communities", circleId, "members", targetUserId)
 );

 await createCircleAuditLog(
   circleId,
   requesterId,
   "MEMBER_REMOVE",
   { targetUserId }
 );
}

/**
 * Circle security audit log
 */
async function createCircleAuditLog(
 circleId:string,
 actorId:string,
 action:string,
 metadata:any
){
 if(!db){
  return;
 }
 const ref = doc(collection(db, "communities", circleId, "auditLogs"));
 await setDoc(ref, {
   actorId,
   action,
   metadata,
   createdAt: serverTimestamp()
 });
}
