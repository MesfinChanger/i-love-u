/**
 * @fileOverview High-Fidelity Community Type Definitions.
 */

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  displayName: string;
  photoURL?: string;
  country?: string;
  language?: string;
  bio?: string;
  interests: string[];
  accountType: "guest" | "free" | "premium" | "business";
  createdAt: any;
  updatedAt: any;
}

export interface SparkProfile {
  userId: string;
  age: number;
  gender: string;
  country: string;
  city: string;
  bio: string;
  interests: string[];
  relationshipGoal: "friendship" | "dating" | "serious" | "marriage";
  preferredCountries: string[];
  verified: boolean;
  visibility: "public" | "hidden";
  createdAt: any;
}

export interface SparkLike {
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: any;
}

export interface Match {
  users: string[];
  status: "active" | "ended";
  createdAt: any;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  category: "travel" | "technology" | "business" | "education" | "culture" | "sports" | "general";
  imageURL?: string;
  ownerId: string;
  privacy: "open" | "private";
  memberCount: number;
  createdAt: any;
}

export interface CircleMember {
  userId: string;
  role: "owner" | "admin" | "member";
  joinedAt: any;
}

export interface Notification {
  type: "message" | "like" | "match" | "order" | "idea";
  title: string;
  body: string;
  read: boolean;
  createdAt: any;
}