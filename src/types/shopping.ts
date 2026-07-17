
/**
 * @fileOverview High-Fidelity Shopping Protocol Definitions.
 */

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  logoURL?: string;
  country: string;
  category: string;
  verified: boolean;
  rating: number;
  createdAt: any;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  category: string;
  inventory: number;
  status: "active" | "inactive";
  createdAt: any;
  updatedAt: any;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  products: any[];
  total: number;
  currency: string;
  paymentStatus: "pending" | "paid" | "failed";
  shippingStatus: "processing" | "shipped" | "delivered";
  createdAt: any;
}
