/**
 * @fileOverview High-Fidelity Community Type Definitions.
 */

export * from './chat';
export * from './circle';
export * from './spark';
export * from './shopping';
export * from './security';
export * from './organization';
export * from './wallet';
export * from './transaction';
export * from './payment';
export * from './receipt';
export * from './audit';
export * from './analytics';
export * from './language';
export * from './currency';

export type IdeaCategory =
  | "economics"
  | "technology"
  | "science"
  | "politics"
  | "philosophy"
  | "general";

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

export interface Friendship {
  userA: string;
  userB: string;
  status: "pending" | "friends" | "blocked";
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
