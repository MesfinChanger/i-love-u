import { User } from "firebase/auth";

export const GUEST_EXPLORER_LIMIT_MINUTES = 30;

export function isGuestUser(user: User | null): boolean {
  return !!user?.isAnonymous;
}

export function getGuestExplorerExpiry(startTime: Date): Date {
  return new Date(
    startTime.getTime() +
      GUEST_EXPLORER_LIMIT_MINUTES * 60 * 1000
  );
}

export function isGuestExplorerExpired(
  expiresAt: Date
): boolean {
  return new Date() > expiresAt;
}

export function canGuestAccessFeature(
  feature:
    | "spark"
    | "circle"
    | "messages"
    | "shop"
    | "ideas"
    | "admin"
): boolean {

  switch (feature) {
    case "spark":
      return true;

    case "circle":
      return true;

    case "ideas":
      return false;

    case "messages":
      return false;

    case "shop":
      return false;

    case "admin":
      return false;

    default:
      return false;
  }
}