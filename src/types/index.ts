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

export interface Match {
  users: string[];
  status: "active" | "ended";
  createdAt: any;
}

export interface Notification {
  type: "message" | "like" | "match" | "order" | "idea";
  title: string;
  body: string;
  read: boolean;
  createdAt: any;
}

export interface SparkLike {
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "declined";
  createdAt: any;
}
