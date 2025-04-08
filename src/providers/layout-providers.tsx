"use client";

import { getCurrentUserFromMongoDB } from "@/actions/users";
import { UserButton } from "@clerk/nextjs";
import { Button, Dropdown, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [menuToShow, setMenuToShow] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const userMenu = [
    { name: "Dashboard", url: "/profile/dashboard" },
    { name: "Donations", url: "/profile/donations" },
  ];
  const adminMenu = [
    { name: "Dashboard", url: "/admin/dashboard" },
    { name: "Donations", url: "/admin/donations" },
    { name: "Campaigns", url: "/admin/campaigns" },
    { name: "Users", url: "/admin/users" },
  ];

  const getCurrentUser = async () => {
    try {
      const response = await getCurrentUserFromMongoDB();
      if (response.error) throw new Error(response.error);
      setCurrentUser(response.data);
      setMenuToShow(response.data?.isAdmin ? adminMenu : userMenu);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getHeader = () => {
    if (pathname.includes("/sign-in") || pathname.includes("/sign-up"))
      return null;

    return (
      <header className="w-full bg-primary text-white px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => router.push("/")}
        >
          Givehub
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5 bg-white text-primary rounded-md py-2 px-4">
          <Dropdown
            menu={{
              items: menuToShow.map((menu) => ({
                key: menu.name,
                label: menu.name,
                onClick: () => router.push(menu.url),
              })),
            }}
          >
            <Button type="link" className="text-primary p-0">
              {currentUser?.userName}
            </Button>
          </Dropdown>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          {menuOpen ? (
            <X
              size={28}
              onClick={() => setMenuOpen(false)}
              className="cursor-pointer"
            />
          ) : (
            <Menu
              size={28}
              onClick={() => setMenuOpen(true)}
              className="cursor-pointer"
            />
          )}
        </div>
      </header>
    );
  };

  const getMobileMenu = () => {
    if (
      !menuOpen ||
      pathname.includes("/sign-in") ||
      pathname.includes("/sign-up")
    )
      return null;

    return (
      <div className="md:hidden w-full bg-white shadow-md px-4 py-3 space-y-3">
        {menuToShow.map((menu) => (
          <div
            key={menu.name}
            className="text-primary font-medium cursor-pointer"
            onClick={() => {
              router.push(menu.url);
              setMenuOpen(false);
            }}
          >
            {menu.name}
          </div>
        ))}
        <div>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    );
  };

  const getContent = () => {
    const isPrivateRoute = pathname !== "/sign-in" && pathname !== "/sign-up";
    const isAdminRoute = pathname.includes("/admin");

    if (isPrivateRoute && !currentUser) {
      return (
        <div className="flex justify-center items-center h-[60vh]">
          <Spin size="large" />
        </div>
      );
    }

    if (isPrivateRoute && currentUser && isAdminRoute && !currentUser.isAdmin) {
      return (
        <div className="flex justify-center mt-20 text-center text-red-600 font-semibold">
          You are not authorized to access this page.
        </div>
      );
    }

    return (
      <main className={isPrivateRoute ? "p-4 md:p-6" : ""}>{children}</main>
    );
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <div>
      {getHeader()}
      {getMobileMenu()}
      {getContent()}
    </div>
  );
}

export default LayoutProvider;
