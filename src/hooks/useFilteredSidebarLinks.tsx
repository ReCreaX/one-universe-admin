import { useMemo } from "react";
import { usePermissionsStore } from "@/store/Permissionsstore";

/**
 * Filters sidebar links based on user permissions
 * IMPORTANT: Module names MUST match exactly between sidebar data and JWT permissions
 */
export const useFilteredSidebarLinks = (sidebarLinks: any[]) => {
  const { canViewModule, permissions } = usePermissionsStore();

  return useMemo(() => {
    console.log("🔍 === FILTER HOOK DEBUG ===");
    console.log("🔍 Hook received permissions:", permissions);
    console.log("🔍 Permissions count:", permissions.length);
    console.log("🔍 Sidebar links to filter:", sidebarLinks.length);

    if (permissions.length === 0) {
      console.warn("⚠️ Hook: No permissions available, returning empty array");
      return [];
    }

    const filtered = sidebarLinks
      .map((link: any) => {
        // Settings route - NO module required, always show
        if (link.link === "/admin/settings") {
          console.log("✅ Settings route - always visible");
          return link;
        }

        // Check if link has a module
        if (!link.module) {
          console.warn(`⚠️ Link "${link.text}" has no module property`);
          return link; // Show if no module requirement
        }

        // Check permission for this module
        const hasAccess = canViewModule(link.module);
        console.log(`🔐 Module "${link.module}" (${link.text}) - Access: ${hasAccess}`);

        // Filter child items if dropdown
        if (link.isDropDown && link.childDropdown) {
          const filteredChildren = link.childDropdown.filter(
            (child: any) => {
              if (!child.module) return true; // Show if no module
              const childHasAccess = canViewModule(child.module);
              console.log(
                `  └─ Child "${child.text}" (${child.module}) - Access: ${childHasAccess}`
              );
              return childHasAccess;
            }
          );

          // Only show parent if it has children or permission
          if (filteredChildren.length > 0 || hasAccess) {
            return { ...link, childDropdown: filteredChildren };
          }
          return null;
        }

        // Only show if has access
        return hasAccess ? link : null;
      })
      .filter((link: any) => link !== null);

    console.log("✅ Filtered sidebar links count:", filtered.length);
    console.log("✅ Filtered links:", filtered.map((l: any) => l.text));
    console.log("🔍 === END FILTER HOOK DEBUG ===");
    
    return filtered;
  }, [permissions, canViewModule, sidebarLinks]);
};