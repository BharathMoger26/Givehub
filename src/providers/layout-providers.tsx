"use client";

import { getCurrentUserFromMongoDB } from "@/actions/users";
import { UserButton } from "@clerk/nextjs";
import { Button, Dropdown, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [menuToShow, setMenuToShow] = useState<any>([]);
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
      <div className="p-3 bg-primary flex justify-between items-center flex-wrap">
        <h1
          className="font-semibold text-2xl text-white cursor-pointer"
          onClick={() => router.push("/")}
        >
          Givehub: A Hub for Giving
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5 bg-white rounded py-2 px-3">
          <Dropdown
            menu={{
              items: menuToShow.map((menu: any) => ({
                key: menu.name,
                label: menu.name,
                onClick: () => router.push(menu.url),
              })),
            }}
          >
            <Button type="link" className="text-primary">
              {currentUser?.userName}
            </Button>
          </Dropdown>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-3 text-white">
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

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="w-full bg-white mt-2 rounded-md shadow-md md:hidden p-4 space-y-3">
            {menuToShow.map((menu: any) => (
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
            <div className="pt-2">
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </div>
        )}
      </div>
    );
  };

  const getContent = () => {
    const isPrivateRoute = pathname !== "/sign-in" && pathname !== "/sign-up";
    const isAdminRoute = pathname.includes("/admin");

    if (isPrivateRoute && !currentUser) {
      return (
        <div className="flex justify-center items-center mt-20">
          <Spin />
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

    return <div className={isPrivateRoute ? "p-5" : ""}>{children}</div>;
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <div>
      {getHeader()}
      {getContent()}
    </div>
  );
}

export default LayoutProvider;
