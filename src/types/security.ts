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
