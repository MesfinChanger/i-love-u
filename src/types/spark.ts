
/**
 * @fileOverview Spark Profile Schema.
 */

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
