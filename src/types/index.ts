
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

export interface Relationship {
  id: string;
  userA: string;
  userB: string;
  status: "friends" | "blocked";
  createdAt: any;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  category: string;
  ownerId: string;
  imageURL: string;
  memberCount: number;
  privacy: "open" | "private";
  createdAt: any;
}

export interface PoolPost {
  id: string;
  authorId: string;
  category: "economics" | "technology" | "politics" | "philosophy" | "general";
  title: string;
  content: string;
  media: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: any;
}

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  logo: string;
  country: string;
  rating: number;
  verified: boolean;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  category: string;
  inventory: number;
  createdAt: any;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  products: any[];
  total: number;
  paymentStatus: "pending" | "paid" | "failed";
  shippingStatus: "pending" | "shipped" | "delivered";
  createdAt: any;
}

export interface Conversation {
  id: string;
  type: "spark" | "circle" | "shopping" | "idea";
  participants: string[];
  encryptionVersion: string;
  createdAt: any;
}

export interface Message {
  id: string;
  senderId: string;
  encryptedText: string;
  encryptedMedia: string[];
  iv: string;
  timestamp: any;
  status: "sent" | "delivered" | "read";
}

export interface PublicKey {
  userId: string;
  publicKey: string;
  algorithm: "ECDH-P256";
  createdAt: any;
  rotatedAt?: any;
}

export interface Notification {
  type: "message" | "like" | "match" | "order" | "idea";
  title: string;
  body: string;
  read: boolean;
  createdAt: any;
}
