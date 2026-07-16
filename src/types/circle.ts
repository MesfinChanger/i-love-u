
/**
 * @fileOverview Circle Protocol Definition.
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

export interface Circle {
  id: string;
  name: string;
  description: string;
  category:
    | "Technology"
    | "Business"
    | "Education"
    | "Travel"
    | "Culture"
    | "Sports"
    | "Music"
    | "Environment"
    | "General";
  imageURL?: string;
  ownerId: string;
  privacy:
    | "open"
    | "private";
  memberCount: number;
  createdAt: any;
}
