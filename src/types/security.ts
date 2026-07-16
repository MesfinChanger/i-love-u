
/**
 * @fileOverview High-Fidelity Security Protocol Definitions.
 */

export interface DeviceSession {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: "web" | "android" | "ios";
  browser?: string;
  ipAddress?: string;
  lastActive: any;
  trusted: boolean;
  createdAt: any;
}

export interface SecurityEvent {
  id: string;
  userId: string;
  type:
    | "login"
    | "logout"
    | "password_change"
    | "device_added"
    | "suspicious_activity";
  description: string;
  createdAt: any;
}

/**
 * @fileOverview Trust Score Protocol Definition.
 */
export interface TrustScore {
  userId: string;
  score: number;
  verifiedEmail: boolean;
  verifiedPhone: boolean;
  verifiedIdentity: boolean;
  positiveReviews: number;
  reports: number;
}

/**
 * @fileOverview Privacy Settings Protocol Definition.
 */
export interface PrivacySettings {
  showOnlineStatus: boolean;
  allowSparkMessages: boolean;
  allowCircleMessages: boolean;
  allowShoppingMessages: boolean;
  showLocation: boolean;
  showEmail: boolean;
  showPhone: boolean;
}

/**
 * @fileOverview Community Safety Block Definition.
 */
export interface Block {
  id: string;
  blockerId: string;
  blockedUserId: string;
  reason?: string;
  createdAt: any;
}
