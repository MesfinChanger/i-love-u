
/**
 * @fileOverview Circle Protocol Definition.
 */

export interface Circle {
  id: string;
  name: string;
  description: string;
  category:
    | "travel"
    | "technology"
    | "business"
    | "education"
    | "culture"
    | "sports"
    | "general";
  imageURL?: string;
  ownerId: string;
  privacy:
    | "open"
    | "private";
  memberCount: number;
  createdAt: any;
}
