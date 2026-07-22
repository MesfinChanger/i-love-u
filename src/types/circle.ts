
/**
 * @fileOverview Circle Protocol Definition Registry.
 * Defines the authority levels and membership structures for community frequencies.
 */

export const circleCategories = [
  "Technology",
  "Business",
  "Education",
  "Travel",
  "Culture",
  "Sports",
  "Music",
  "Environment",
  "General"
];

export type CircleRole =
  | "owner"
  | "admin"
  | "moderator"
  | "member"
  | "pending"
  | "guest";

export interface CircleMember {
  id: string;
  userId: string;
  role: CircleRole;
  status: "active" | "pending" | "suspended" | "waiting";
  joinedAt: any;
  profile?: {
    displayName?: string;
    photoURL?: string;
    username?: string;
  };
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  category: string;
  imageURL?: string;
  ownerId: string;
  privacy: "open" | "private";
  memberCount: number;
  createdAt: any;
}
