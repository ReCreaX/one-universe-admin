import { create } from "zustand";
import { Permission } from "@/utils/Permissionsutil";

interface PermissionsState {
  permissions: Permission[];
  roles: string[];
  setPermissions: (permissions: Permission[]) => void;
  setRoles: (roles: string[]) => void;
  hasPermission: (module: string, action: string) => boolean;
  canViewModule: (module: string) => boolean;
  canManageModule: (module: string) => boolean;
  canDeleteModule: (module: string) => boolean;
  canExportModule: (module: string) => boolean;
  getAccessibleModules: () => string[];
  getModuleActions: (module: string) => string[];
  clearPermissions: () => void;
}

export const usePermissionsStore = create<PermissionsState>((set, get) => ({
  permissions: [],
  roles: [],

  setPermissions: (permissions: Permission[]) => {
    set({ permissions });
    console.log("✅ Permissions updated in store:", permissions);
  },

  setRoles: (roles: string[]) => {
    set({ roles });
    console.log("✅ Roles updated in store:", roles);
  },

  hasPermission: (module: string, action: string) => {
    const { permissions } = get();
    return permissions.some(
      (p) => p.module === module && p.action === action
    );
  },

  canViewModule: (module: string) => {
    return get().hasPermission(module, "view");
  },

  canManageModule: (module: string) => {
    return get().hasPermission(module, "manage");
  },

  canDeleteModule: (module: string) => {
    return get().hasPermission(module, "delete");
  },

  canExportModule: (module: string) => {
    return get().hasPermission(module, "export");
  },

  getAccessibleModules: () => {
    const { permissions } = get();
    const modules = new Set<string>();
    permissions.forEach((p) => {
      if (p.action === "view") {
        modules.add(p.module);
      }
    });
    return Array.from(modules);
  },

  getModuleActions: (module: string) => {
    const { permissions } = get();
    const actions = new Set<string>();
    permissions
      .filter((p) => p.module === module)
      .forEach((p) => {
        actions.add(p.action);
      });
    return Array.from(actions);
  },

  clearPermissions: () => {
    set({ permissions: [], roles: [] });
    console.log("🧹 Permissions cleared from store");
  },
}));