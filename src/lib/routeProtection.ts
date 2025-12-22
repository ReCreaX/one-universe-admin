import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * NextAuth middleware to protect routes based on permissions
 * Updated to match your actual route structure
 * 
 * File location: src/lib/routeProtection.ts
 */

// Define module to route mappings - UPDATED FOR YOUR ROUTES
const MODULE_ROUTE_MAP: Record<string, string[]> = {
  Dashboard: ["/admin"],
  "User Management": ["/admin/users-management"],
  "Payment Management": ["/admin/payment-management"],
  Dispute: ["/admin/dispute-management"],
  "Service Management": ["/admin/service-management"],
  "Promotional Offers": ["/admin/promotional-offers"],
  "Support & Feedback": ["/admin/support"],
};

/**
 * Check if user has permission to access a route
 * This should be called from your NextAuth middleware
 */
export const checkRoutePermission = (
  pathname: string,
  permissions: Array<{ module: string; action: string }>
): boolean => {
  // Allow access to common routes
  const publicRoutes = [
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/api/auth",
  ];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return true;
  }

  // Allow settings (personal account route)
  if (pathname === "/admin/settings") {
    return true;
  }

  // Check if route requires authentication (starts with /admin)
  if (!pathname.startsWith("/admin")) {
    return true;
  }

  // Find which module this route belongs to
  for (const [module, routes] of Object.entries(MODULE_ROUTE_MAP)) {
    if (routes.some((route) => pathname.startsWith(route))) {
      // Check if user has "view" permission for this module
      const hasAccess = permissions.some(
        (p) => p.module === module && p.action === "view"
      );

      if (!hasAccess) {
        console.warn(
          `❌ Access denied to ${pathname} - Missing ${module} permission`
        );
        return false;
      }

      return true;
    }
  }

  // Route is not protected, allow access
  return true;
};

/**
 * Extract permissions from JWT token
 * You can use this to decode the token payload
 */
export const extractPermissionsFromToken = (token: any) => {
  if (!token) return { permissions: [], roles: [] };

  return {
    permissions: token.permissions || [],
    roles: token.roles || [],
  };
};

/**
 * Get which module a route belongs to
 * Useful for permission checking
 */
export const getModuleForRoute = (pathname: string): string | null => {
  for (const [module, routes] of Object.entries(MODULE_ROUTE_MAP)) {
    if (routes.some((route) => pathname.startsWith(route))) {
      return module;
    }
  }
  return null;
};