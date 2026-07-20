export type MessageType =
  | "text"
  | "image"
  | "video"
  | "voice"
  | "file";


export interface Message {

  id:string;

  senderId:string;

  type:MessageType;

  text?:string;


  media?:{

    path:string;

    mime:string;

    size:number;

    encrypted:boolean;

  };


  createdAt:any;


  status:
    | "sent"
    | "delivered"
    | "read";


  deletedFor:string[];

  deletedForEveryone:boolean;


  encryptionVersion:string;

}