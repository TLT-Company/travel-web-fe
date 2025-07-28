"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getCurrentAdmin } from "@/services/login.service";
import { toast } from "react-toastify";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";
  const router = useRouter();
  useEffect(() => {
   
    const token = localStorage.getItem("accessTokenTravel");
    if (!token) {
      redirect("/admin/signin");
    }

    try {
      const decoded: { exp: number, role: string } = jwtDecode(token);
      const timeRemaining = decoded.exp * 1000 - Date.now();
      fetchAdminCurrent();
      if (decoded.role == "user") {
        router.push("/");
      } else if (decoded.role == "collaborator") {
        router.push("/collaborator");
      }
      if (timeRemaining <= 0) {
        localStorage.removeItem("accessTokenTravel");
        localStorage.removeItem("userLoginTravel");
        redirect("/admin/signin");
      } else {
        // Auto logout sau khi hết hạn
        setTimeout(() => {
          localStorage.removeItem("accessTokenTravel");
          localStorage.removeItem("userLoginTravel");
          redirect("/admin/signin");
        }, timeRemaining);
      }
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("accessTokenTravel");
      localStorage.removeItem("userLoginTravel");
      redirect("/admin/signin");
    }
  }, []);

  const fetchAdminCurrent = async () => {
    try {
      const data = await getCurrentAdmin();
      if (!data.success) {
        console.error("Failed to fetch current admin data");
        localStorage.removeItem("accessTokenTravel");
        localStorage.removeItem("userLoginTravel");
        redirect("/admin/signin");
      }
    } catch (error: any) {
      toast.error(error.message);
      localStorage.removeItem("accessTokenTravel");
      localStorage.removeItem("userLoginTravel");
      redirect("/admin/signin");
    }
  }

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}
