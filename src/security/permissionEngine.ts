import { Permission } from "./permissions";
import { UserRole } from "./roles";

/**
 * @fileOverview Universal Permission Engine.
 * Defines the mapping between heart roles and their allowed mission actions.
 * Synchronized with the global Permission enum and UserRole registry.
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
 * Checks if a specific role possesses the authority for a mission action.
 * Hardened with the Sovereignty Bypass for administrators.
 */
export function hasPermission(
  role: string | null | undefined,
  permission: Permission
): boolean {
  if (!role) {
    return rolePermissions[UserRole.GUEST].includes(permission);
  }

  const normalizedRole = role.toLowerCase();

  // Sovereignty Protocol: Admin and System Owner bypass all checks
  if (normalizedRole === UserRole.ADMIN || normalizedRole === UserRole.SYSTEM_OWNER || normalizedRole === "admin") {
    return true;
  }

  // Check specific role mapping
  return rolePermissions[normalizedRole as UserRole]?.includes(permission) || false;
}
