/**
 * @fileOverview High-Fidelity Chat Protocol Definitions.
 */

export interface Conversation {
  id: string;
  type:
    | "spark"
    | "circle-private"
    | "circle-group"
    | "shopping"
    | "idea";
  participants: string[];
  title?: string;
  imageURL?: string;
  encryptionVersion: string;
  createdAt: any;
}

export interface Message {
  id: string;
  senderId: string;
  encryptedText: string;
  iv: string;
  type:
    | "text"
    | "image"
    | "voice"
    | "file";
  createdAt: any;
  status:
    | "sent"
    | "delivered"
    | "read";
}
