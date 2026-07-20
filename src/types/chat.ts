/**
 * Communication Protocol
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

  createdAt:any;

  lastMessageAt?:any;

}



export type MessageType =
  | "text"
  | "image"
  | "voice"
  | "file";


export interface Message {

 id:string;

 conversationId:string;

 senderId:string;

 type:MessageType;


 encryptedText?:string;


 media?:{

   url:string;

   storagePath:string;

   mimeType:string;

   size:number;

 };


 downloadPolicy?:{

   allowDownload:boolean;

   expiresAt?:any;

 };


 deleted?:boolean;


 createdAt:any;

 status:
  | "sent"
  | "delivered"
  | "read";

}
export interface Message {
  id: string;

  senderId: string;

  encryptedText?: string;

  text?: string;

  iv?: string;

  type:
    | "text"
    | "image"
    | "voice"
    | "file";

  media?: {
    storagePath: string;

    fileName?: string;

    mimeType?: string;

    size?: number;

    downloadable: boolean;

    expiresAt?: any;
  };

  createdAt:any;

  status:
    | "sent"
    | "delivered"
    | "read";

  deletedBySender?: boolean;

  deletedByReceiver?: boolean;
}
media?: {
  type: "image" | "voice" | "file";
  storagePath: string;
  previewUrl?: string;
  downloadAllowed: boolean;
};