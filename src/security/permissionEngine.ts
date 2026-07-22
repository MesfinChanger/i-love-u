import { Permission } from "./permissions";
import { UserRole } from "./roles";

/**
 * @fileOverview Universal Permission Engine.
 * Hardened with the Sovereignty Bypass and String-Tolerance for Firestore roles.
 */

const rolePermissions: Record<string, Permission[]> = {
  [UserRole.GUEST]: [
    Permission.VIEW_PUBLIC_CONTENT,
    Permission.VIEW_PROFILE,
    Permission.DONATE,
  ],
  [UserRole.MEMBER]: [
    Permission.VIEW_PUBLIC_CONTENT,
    Permission.VIEW_PROFILE,
    Permission.CREATE_SPARK,
    Permission.JOIN_CIRCLE,
    Permission.SEND_MESSAGE,
    Permission.DONATE,
  ],
  [UserRole.VERIFIED]: [
    Permission.VIEW_PUBLIC_CONTENT,
    Permission.VIEW_PROFILE,
    Permission.CREATE_SPARK,
    Permission.JOIN_CIRCLE,
    Permission.SEND_MESSAGE,
    Permission.DONATE,
    Permission.CREATE_PRODUCT,
    Permission.BUY_PRODUCT,
  ],
  [UserRole.MERCHANT]: [
    Permission.VIEW_PUBLIC_CONTENT,
    Permission.VIEW_PROFILE,
    Permission.JOIN_CIRCLE,
    Permission.SEND_MESSAGE,
    Permission.DONATE,
    Permission.CREATE_PRODUCT,
  ],
  [UserRole.MODERATOR]: [
    Permission.VIEW_PUBLIC_CONTENT,
    Permission.VIEW_PROFILE,
    Permission.CREATE_SPARK,
    Permission.JOIN_CIRCLE,
    Permission.SEND_MESSAGE,
    Permission.DONATE,
    Permission.MODERATE_CONTENT,
  ],
  [UserRole.ADMIN]: Object.values(Permission) as Permission[],
  [UserRole.SYSTEM_OWNER]: Object.values(Permission) as Permission[],
};

/**
 * hasPermission Protocol.
 * Resilient check for mission authority.
 */
export function hasPermission(
  role: string | null | undefined,
  permission: Permission | string
): boolean {
  if (!role) {
    return rolePermissions[UserRole.GUEST].includes(permission as Permission);
  }

  const normalizedRole = role.toLowerCase().trim();

  // Sovereign Bypass: Guardians have total access
  if (normalizedRole === UserRole.ADMIN || normalizedRole === UserRole.SYSTEM_OWNER || normalizedRole === "admin") {
    return true;
  }

  return (
    rolePermissions[normalizedRole]?.includes(permission as Permission) || false
  );
}
