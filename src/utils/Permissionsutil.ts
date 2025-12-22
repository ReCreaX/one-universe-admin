/**
 * Permissions utility for checking user access to modules and actions
 */

export interface Permission {
  module: string;
  action: string;
}

export interface DecodedToken {
  sub: string;
  email: string;
  roles: string[];
  permissions: Permission[];
  iat: number;
  exp: number;
}

/**
 * Check if user has permission for a specific module and action
 */
export const hasPermission = (
  permissions: Permission[] | undefined,
  module: string,
  action: string
): boolean => {
  if (!permissions || !Array.isArray(permissions)) {
    return false;
  }

  return permissions.some(
    (p) => p.module === module && p.action === action
  );
};

/**
 * Check if user has access to view a module
 */
export const canViewModule = (
  permissions: Permission[] | undefined,
  module: string
): boolean => {
  return hasPermission(permissions, module, "view");
};

/**
 * Check if user can manage a module
 */
export const canManageModule = (
  permissions: Permission[] | undefined,
  module: string
): boolean => {
  return hasPermission(permissions, module, "manage");
};

/**
 * Check if user can delete from a module
 */
export const canDeleteModule = (
  permissions: Permission[] | undefined,
  module: string
): boolean => {
  return hasPermission(permissions, module, "delete");
};

/**
 * Check if user can export from a module
 */
export const canExportModule = (
  permissions: Permission[] | undefined,
  module: string
): boolean => {
  return hasPermission(permissions, module, "export");
};

/**
 * Get all accessible modules for a user
 */
export const getAccessibleModules = (
  permissions: Permission[] | undefined
): string[] => {
  if (!permissions || !Array.isArray(permissions)) {
    return [];
  }

  const modules = new Set<string>();
  permissions.forEach((p) => {
    if (p.action === "view") {
      modules.add(p.module);
    }
  });

  return Array.from(modules);
};

/**
 * Get all available actions for a specific module
 */
export const getModuleActions = (
  permissions: Permission[] | undefined,
  module: string
): string[] => {
  if (!permissions || !Array.isArray(permissions)) {
    return [];
  }

  const actions = new Set<string>();
  permissions
    .filter((p) => p.module === module)
    .forEach((p) => {
      actions.add(p.action);
    });

  return Array.from(actions);
};