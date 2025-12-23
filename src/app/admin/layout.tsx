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

interface ExtendedSession {
  user?: { id?: string; email?: string; name?: string };
  accessToken?: string;
  permissions?: Array<{ module: string; action: string }>;
  roles?: string[];
}

export default function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToastStore();

  const { setPermissions, setRoles, canViewModule } = usePermissionsStore();
  const filteredSidebarLinks = useFilteredSidebarLinks(SideBarLinksWithPermissions);

  const { fullUser, fetchUser } = userDetailsStore();
  const [userProfilePicture, setUserProfilePicture] = useState<string>("/images/user.png");

  // Load permissions & roles
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/sign-in");
      return;
    }

    if (session) {
      const extended = session as ExtendedSession;
      if (extended.permissions) setPermissions(extended.permissions);
      if (extended.roles) setRoles(extended.roles);
    }
    setIsLoading(false);
  }, [session, status, setPermissions, setRoles, router]);

  // Route guard
  useEffect(() => {
    if (status !== "authenticated" || isLoading) return;

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
  }, [pathname, canViewModule, router, showToast, status, isLoading]);

  // Load user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      if (status !== "authenticated") return;

      try {
        const extended = session as ExtendedSession;
        if (extended?.user?.id && extended?.accessToken) {
          await fetchUser(extended.user.id, extended.accessToken);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }

      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?.profilePicture) setUserProfilePicture(user.profilePicture);
      }
    };

    loadUserProfile();
  }, [session, status, fetchUser]);

  // Update profile picture from fullUser
  useEffect(() => {
    if (!fullUser) return;

    const profilePicture =
      (fullUser as any)?.profile?.profilePicture ||
      (fullUser as any)?.profilePicture ||
      (fullUser as any)?.profile?.avatar ||
      (fullUser as any)?.avatar ||
      "/images/user.png";

    if (profilePicture !== userProfilePicture) {
      setUserProfilePicture(profilePicture);
      try {
        const stored = localStorage.getItem("user") || "{}";
        const user = JSON.parse(stored);
        user.profilePicture = profilePicture;
        localStorage.setItem("user", JSON.stringify(user));
      } catch {}
    }
  }, [fullUser, userProfilePicture]);

  const handleLogOut = async () => {
    localStorage.removeItem("user");
    const response = await authService.signout();
    if (response.success) {
      showToast("success", "Logout Successful", "You have been logged out", 3000);
      router.push("/auth/sign-in");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
          <ul className="flex flex-col gap-[16px]">
            {filteredSidebarLinks.map((link: any) => {
              const isActive =
                pathname === link.link ||
                (link.isDropDown && link.childDropdown?.some((child: any) => pathname.startsWith(child.link)));

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

  return (
    <main className="flex h-screen overflow-x-hidden">
      {/* Desktop Sidebar */}
      <section className="w-[260px] py-3.5 px-3.5 h-screen hidden md:flex flex-col justify-between bg-[#FFFDFD] border border-[#FFF9F9] overflow-y-auto">
        <SidebarContent />
      </section>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.section
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-[75vw] h-screen py-6 px-4 bg-[#FFFDFD] border-r border-[#FFF9F9] z-50 md:hidden overflow-y-auto shadow-2xl"
            >
              <SidebarContent isMobile />
            </motion.section>
          </>
        )}
      </AnimatePresence>

      <section className="flex-1 flex flex-col h-screen overflow-x-hidden">
        {/* Desktop Header */}
        <header className="border-b border-[#FFF9F9] hidden md:flex items-center justify-between px-8 h-[80px] flex-shrink-0">
          <section className="flex items-center gap-[8px]">
            <Image src="/dashboard/inactive/dashboard.svg" alt="Home" width={18} height={18} />
            <ChevronRight size={12} className="text-[#4A4A4A]" />
            <span className="text-[#4A4A4A] font-medium text-[.875rem]">
              {(() => {
                for (const link of filteredSidebarLinks) {
                  if (link.isDropDown && link.childDropdown) {
                    const child = link.childDropdown.find((c: any) => pathname === c.link || pathname.startsWith(c.link + "/"));
                    if (child) return child.text;
                  }
                }
                const parent = filteredSidebarLinks.find((l: any) => pathname === l.link || pathname.startsWith(l.link + "/"));
                return parent?.text || "Dashboard";
              })()}
            </span>
          </section>

          <section className="flex items-center">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell className="size-[23px] text-[#373737] hover:text-[#154751] transition-colors" />
              <span className="absolute top-1 right-[2px] w-2 h-2 rounded-full bg-[#D84040] border border-white"></span>
            </button>
            <Separator orientation="vertical" className="mx-4 h-6" />
            <div className="relative size-[40px]">
              <Image
                src={userProfilePicture}
                alt="User Profile"
                fill
                className="rounded-full object-cover"
                priority
                onError={(e) => {(e.target as HTMLImageElement).src = "/images/user.png";}}
              />
            </div>
          </section>
        </header>

        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between px-2.5 h-[48px] border-b border-[#FFF9F9] flex-shrink-0">
          <Image src="/logo/one-universe.svg" alt="Logo" width={120} height={22} />
          <section className="flex items-center gap-[20px]">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell className="size-[23px] text-[#6B6969] hover:text-[#154751] transition-colors" />
              <span className="absolute top-1 right-[2px] w-2 h-2 rounded-full bg-[#D84040] border border-white"></span>
            </button>
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Menu className="size-[23px] text-[#6B6969]" />
            </button>
          </section>
        </header>

        {/* Main Content */}
        <section className="px-2.5 md:px-5 mt-[25px] flex-1 overflow-y-auto">
          {children}
        </section>
      </section>

      {/* Notifications Panel - Fixed Overlay (Original Design) */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setIsNotificationsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-20 right-6 md:right-8 z-50 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <NotificationsPanel onClose={() => setIsNotificationsOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}