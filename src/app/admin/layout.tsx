"use client";

import { LogIn, ChevronDown, ChevronRight, Bell, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { SideBarLinks } from "@/data/layoutSidebarData";
import authService from "@/services/authService";
import useToastStore from "@/store/useToastStore";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { showToast } = useToastStore();
  
  // ✅ IMPROVED: Get profile picture from multiple sources
  const [userProfilePicture, setUserProfilePicture] = useState<string>("/images/user.png");

  useEffect(() => {
    const loadUserProfile = () => {
      try {
        // Priority 1: Try NextAuth session
        if (session?.user?.image) {
          console.log("✅ Profile picture from NextAuth session:", session.user.image);
          setUserProfilePicture(session.user.image);
          // Save to localStorage for persistence
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            user.profilePicture = session.user.image;
            localStorage.setItem("user", JSON.stringify(user));
          }
          return;
        }

        // Priority 2: Try localStorage
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user?.profilePicture) {
            console.log("✅ Profile picture from localStorage:", user.profilePicture);
            setUserProfilePicture(user.profilePicture);
            return;
          }
        }

        // Priority 3: Default image
        console.log("⚠️ Using default profile picture");
        setUserProfilePicture("/images/user.png");
      } catch (error) {
        console.error("❌ Error loading user profile:", error);
        setUserProfilePicture("/images/user.png");
      }
    };

    loadUserProfile();
  }, [session?.user?.image]);

  const handleLogOut = async () => {
    // Clear localStorage when logging out
    localStorage.removeItem("user");
    
    const response = await authService.signout();
    if (response.success) {
      showToast(
        "success",
        "Logout Successful",
        "You have been logged out",
        3000
      );
      router.push("/auth/sign-in");
    }
  };

  const SidebarContent = ({ isMobile = false }) => (
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
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/user.png";
                  }}
                />
              </div>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Close sidebar"
                aria-label="Close sidebar"
              >
                <X size={24} className="text-[#6B6969]" />
              </button>
            </div>
          )}

          {!isMobile && (
            <>
              <Image
                src="/logo/one-universe.svg"
                alt="Auth Logo"
                width={120}
                height={22}
              />
              <p className="bg-[#E8FBF7] border border-[#1DD2AE] text-[#1DD2AE] rounded-[16px] px-3 py-1 text-sm font-medium w-fit">
                Administrator
              </p>
            </>
          )}
        </header>

        <aside>
          <ul className="flex flex-col gap-[16px]">
            {SideBarLinks.map((link) => {
              const isActive =
                pathname === link.link ||
                (link.isDropDown &&
                  link.childDropdown?.some((child) =>
                    pathname.startsWith(child.link)
                  ));

              return (
                <li key={link.id}>
                  {link.isDropDown ? (
                    <>
                      <button
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === link.id ? null : link.id
                          )
                        }
                        className={`flex items-center justify-between w-full py-[8px] px-[16px] rounded-md transition-colors duration-200 ${
                          isActive
                            ? "[background:var(--primary-radial)] text-[#FFFFFF]"
                            : "text-[#6B6969]"
                        }`}
                      >
                        <div className="flex items-center gap-[12px] cursor-pointer">
                          <Image
                            src={
                              isActive ? link.activeImage : link.inActiveImage
                            }
                            alt={link.text}
                            width={20}
                            height={20}
                          />
                          <span className="text-[.875rem]">{link.text}</span>
                        </div>
                        {openDropdown === link.id ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
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
                            {link.childDropdown?.map((child, idx) => {
                              const childActive = pathname === child.link;
                              return (
                                <li key={idx}>
                                  <Link
                                    href={child.link}
                                    onClick={() =>
                                      isMobile && setIsMobileSidebarOpen(false)
                                    }
                                    className={`block px-2 py-1 rounded-md text-sm transition-colors duration-200 ${
                                      childActive
                                        ? "bg-[#1DD2AE] text-white"
                                        : "text-[#6B6969] hover:text-[#1DD2AE]"
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
                      className={`flex items-center gap-[12px] py-[8px] px-[16px] rounded-md transition-colors duration-200 ${
                        isActive
                          ? "[background:var(--primary-radial)] text-[#FFFFFF]"
                          : "text-[#6B6969]"
                      }`}
                    >
                      <Image
                        src={isActive ? link.activeImage : link.inActiveImage}
                        alt={link.text}
                        width={20}
                        height={20}
                      />
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
          className={`flex items-center gap-[12px] py-[8px] px-[16px] rounded-md transition-colors duration-200 ${
            pathname === "/admin/settings"
              ? "[background:var(--primary-radial)] text-[#FFFFFF]"
              : "text-[#6B6969]"
          }`}
        >
          <Image
            src={
              pathname === "/admin/settings"
                ? "/dashboard/active/settings.svg"
                : "/dashboard/inactive/settings.svg"
            }
            alt="Settings"
            width={20}
            height={20}
          />
          <span className="text-[.875rem]">Settings</span>
        </Link>
        <button
          onClick={handleLogOut}
          className="flex items-center gap-[13px] py-[8px] px-[16px] mt-[5px] text-[#D84040] cursor-pointer"
        >
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
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />

            {/* Sliding Sidebar */}
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
            <button type="button" title="Home" aria-label="Home">
              <Image
                src="/dashboard/inactive/dashboard.svg"
                alt="Home"
                width={18}
                height={18}
              />
            </button>
            <ChevronRight size={12} className="text-[#4A4A4A]" />
            <span className="text-[#4A4A4A] font-medium text-[.875rem] leading-[140%]">
              {(() => {
                for (const link of SideBarLinks) {
                  if (link.isDropDown && link.childDropdown) {
                    const child = link.childDropdown.find(
                      (c) =>
                        pathname === c.link || pathname.startsWith(c.link + "/")
                    );
                    if (child) return child.text;
                  }
                }

                const parent = SideBarLinks.filter(
                  (link) =>
                    pathname === link.link ||
                    pathname.startsWith(link.link + "/")
                ).sort((a, b) => b.link.length - a.link.length)[0];

                return parent?.text || "Dashboard";
              })()}
            </span>
          </section>

          <section className="flex items-center justify-between">
            <aside className="relative ml-auto">
              <Bell className="size-[23px] text-[#373737]" />
              <span className="absolute top-1 right-[2px] w-2 h-2 rounded-full bg-[#D84040] border border-white"></span>
            </aside>
            <Separator orientation="vertical" className="mx-4 h-6" />

            <div className="relative size-[40px] ml-6">
              <Image
                src={userProfilePicture}
                alt="User Profile"
                fill
                className="rounded-full object-cover"
                priority
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/user.png";
                }}
              />
            </div>
          </section>
        </header>

        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between px-2.5 md:px-8 h-[48px] border-b border-[#FFF9F9] flex-shrink-0">
          <Image
            src="/logo/one-universe.svg"
            alt="Auth Logo"
            width={120}
            height={22}
          />

          <section className="flex items-center justify-between gap-[20px]">
            <aside className="relative ml-auto">
              <Bell className="size-[23px] text-[#6B6969]" />
              <span className="absolute top-1 right-[2px] w-2 h-2 rounded-full bg-[#D84040] border border-white"></span>
            </aside>

            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Open sidebar"
              aria-label="Open sidebar"
            >
              <Menu className="size-[23px] text-[#6B6969]" />
            </button>
          </section>
        </header>

        <section className="px-2.5 md:px-5 mt-[25px]">{children}</section>
      </section>
    </main>
  );
}