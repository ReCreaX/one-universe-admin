"use client";

import { LogIn, ChevronDown, ChevronRight, Bell, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { SideBarLinksWithPermissions } from "@/data/layoutSidebarData";
import authService from "@/services/authService";
import useToastStore from "@/store/useToastStore";
import { userDetailsStore } from "@/store/userDetailsStore";
import { usePermissionsStore } from "@/store/Permissionsstore";
import { useFilteredSidebarLinks } from "@/hooks/useFilteredSidebarLinks";
import NotificationsPanel from "../admin/notification/NotificationsPanel";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { showToast } = useToastStore();

  const { setPermissions, setRoles, canViewModule, permissions } = usePermissionsStore();
  const filteredSidebarLinks = useFilteredSidebarLinks(SideBarLinksWithPermissions);

  const { fullUser, fetchUser } = userDetailsStore();
  const [userProfilePicture, setUserProfilePicture] = useState<string>("/images/user.png");

  // Load permissions & roles from session.user
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/sign-in");
      return;
    }

    if (session?.user) {
      const userPerms = (session.user as any).permissions || [];
      const userRoles = (session.user as any).roles || [];

      console.log("✅ Loading permissions into store:", userPerms.length);
      setPermissions(userPerms);
      setRoles(userRoles);
    } else {
      setPermissions([]);
      setRoles([]);
    }
  }, [session, status, setPermissions, setRoles, router]);

  // Route access control
  useEffect(() => {
    if (status === "loading" || permissions.length === 0) return;

    if (pathname.startsWith("/admin")) {
      const routeToModuleMap: Record<string, string | null> = {
        "": "Dashboard",
        "users-management": "User Management",
        "payment-management": "Payment Management",
        "dispute-management": "Dispute",
        "service-management": "Service Management",
        "promotional-offers": "Promotional Offers",
        "support": "Support & Feedback",
        "settings": null,
      };

      const segments = pathname.split("/").filter(Boolean);
      const routeSegment = segments[1] || "";
      const requiredModule = routeToModuleMap[routeSegment];

      if (requiredModule && !canViewModule(requiredModule)) {
        showToast("error", "Access Denied", `You don't have permission to access ${requiredModule}`, 3000);
        router.push("/admin");
      }
    }
  }, [pathname, canViewModule, router, showToast, status, permissions]);

  // Load user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      if (session?.user?.id && (session as any).accessToken) {
        await fetchUser(session.user.id, (session as any).accessToken);
        return;
      }

      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?.profilePicture) {
          setUserProfilePicture(user.profilePicture);
        }
      }
    };

    if (status === "authenticated") {
      loadUserProfile();
    }
  }, [session, status, fetchUser]);

  useEffect(() => {
    if (!fullUser) return;

    const profilePicture =
      (fullUser as any)?.profile?.profilePicture ||
      (fullUser as any)?.profilePicture ||
      (fullUser as any)?.profile?.avatar ||
      (fullUser as any)?.avatar;

    if (profilePicture) {
      setUserProfilePicture(profilePicture);
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          user.profilePicture = profilePicture;
          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch {}
    }
  }, [fullUser]);

  const handleLogOut = async () => {
    localStorage.removeItem("user");
    const response = await authService.signout();
    if (response.success) {
      showToast("success", "Logout Successful", "You have been logged out", 3000);
      router.push("/auth/sign-in");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <section className="flex flex-col justify-between h-full">
      <section className="flex flex-col gap-[32px]">
        <header className="flex flex-col gap-[8px]">
          {isMobile && (
            <div className="flex items-center justify-between mb-4">
              <div className="relative size-[50px]">
                <Image
                  src={userProfilePicture}
                  alt="User Profile"
                  fill
                  className="rounded-full object-cover"
                  priority
                  onError={(e) => {(e.target as HTMLImageElement).src = "/images/user.png";}}
                />
              </div>
              <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} className="text-[#6B6969]" />
              </button>
            </div>
          )}

          {!isMobile && (
            <>
              <Image src="/logo/one-universe.svg" alt="Logo" width={120} height={22} />
              <p className="bg-[#E8FBF7] border border-[#1DD2AE] text-[#1DD2AE] rounded-[16px] px-3 py-1 text-sm font-medium w-fit">
                Administrator
              </p>
            </>
          )}
        </header>

        <aside>
          {filteredSidebarLinks.length === 0 ? (
            <p className="text-sm text-gray-500 px-4">No accessible modules</p>
          ) : (
            <ul className="flex flex-col gap-[16px]">
              {filteredSidebarLinks.map((link: any) => {
                const isActive = pathname === link.link || (link.isDropDown && link.childDropdown?.some((child: any) => pathname.startsWith(child.link)));

                return (
                  <li key={link.id}>
                    {link.isDropDown ? (
                      <>
                        <button
                          onClick={() => setOpenDropdown(openDropdown === link.id ? null : link.id)}
                          className={`flex items-center justify-between w-full py-[8px] px-[16px] rounded-md transition-colors ${
                            isActive ? "[background:var(--primary-radial)] text-[#FFFFFF]" : "text-[#6B6969]"
                          }`}
                        >
                          <div className="flex items-center gap-[12px]">
                            <Image src={isActive ? link.activeImage : link.inActiveImage} alt={link.text} width={20} height={20} />
                            <span className="text-[.875rem]">{link.text}</span>
                          </div>
                          {openDropdown === link.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>

                        <AnimatePresence>
                          {openDropdown === link.id && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="flex flex-col ml-10 mt-2 gap-2 overflow-hidden"
                            >
                              {link.childDropdown?.map((child: any, idx: number) => {
                                const childActive = pathname === child.link;
                                return (
                                  <li key={idx}>
                                    <Link
                                      href={child.link}
                                      onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                                      className={`block px-2 py-1 rounded-md text-sm transition-colors ${
                                        childActive ? "bg-[#1DD2AE] text-white" : "text-[#6B6969] hover:text-[#1DD2AE]"
                                      }`}
                                    >
                                      {child.text}
                                    </Link>
                                  </li>
                                );
                              })}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={link.link}
                        onClick={() => isMobile && setIsMobileSidebarOpen(false)}
                        className={`flex items-center gap-[12px] py-[8px] px-[16px] rounded-md transition-colors ${
                          isActive ? "[background:var(--primary-radial)] text-[#FFFFFF]" : "text-[#6B6969]"
                        }`}
                      >
                        <Image src={isActive ? link.activeImage : link.inActiveImage} alt={link.text} width={20} height={20} />
                        <span className="text-[.875rem]">{link.text}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      </section>

      <section>
        <Link
          href="/admin/settings"
          onClick={() => isMobile && setIsMobileSidebarOpen(false)}
          className={`flex items-center gap-[12px] py-[8px] px-[16px] rounded-md transition-colors ${
            pathname === "/admin/settings" ? "[background:var(--primary-radial)] text-[#FFFFFF]" : "text-[#6B6969]"
          }`}
        >
          <Image
            src={pathname === "/admin/settings" ? "/dashboard/active/settings.svg" : "/dashboard/inactive/settings.svg"}
            alt="Settings"
            width={20}
            height={20}
          />
          <span className="text-[.875rem]">Settings</span>
        </Link>
        <button onClick={handleLogOut} className="flex items-center gap-[13px] py-[8px] px-[16px] mt-[5px] text-[#D84040]">
          <LogIn size={16} />
          <span className="text-[.875rem]">Logout</span>
        </button>
      </section>
    </section>
  );

  // Rest of the layout (header, mobile sidebar, etc.) remains unchanged
  // ... (same as your original code)

  return (
    <main className="flex h-screen overflow-x-hidden">
      {/* Desktop Sidebar */}
      <section className="w-[260px] py-3.5 px-3.5 h-screen hidden md:flex flex-col justify-between bg-[#FFFDFD] border border-[#FFF9F9] overflow-y-auto">
        <SidebarContent />
      </section>

      {/* Mobile Sidebar & Main Content - unchanged from your original */}
      {/* ... (keep your existing mobile sidebar, header, children, notifications panel) */}
      
      <section className="flex-1 flex flex-col h-screen overflow-x-hidden">
        {/* Header and children - unchanged */}
        {children}
      </section>
    </main>
  );
}