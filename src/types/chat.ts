/**
 * @fileOverview High-Fidelity Communication Protocol.
 * Defines the schemas for secured message broadcasting.
 */

export type ConversationType =
  | "spark"
  | "circle-private"
  | "circle-group"
  | "idea"
  | "shopping"
  | "support";

export interface Conversation {
  id: string;
  type: ConversationType;
  participants: string[];
  ownerId?: string;
  referenceId?: string;
  referenceType?:
    | "sparkConnection"
    | "circle"
    | "idea"
    | "product";
  encryptionVersion: string;
  createdAt: any;
  lastMessage?: string;
  lastUpdatedAt?: any;
}

export type MessageType =
  | "text"
  | "image"
  | "voice"
  | "file";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  type: MessageType;
  text?: string;
  encryptedText?: string;
  iv?: string;
  media?: {
    storagePath: string;
    fileName?: string;
    mimeType?: string;
    size?: number;
    downloadable: boolean;
    expiresAt?: any;
  };
  status: "sent" | "delivered" | "read";
  createdAt: any;
  edited?: boolean;
  deleted?: boolean;
  deletedFor?: string[];
  deletedForEveryone?: boolean;
}
