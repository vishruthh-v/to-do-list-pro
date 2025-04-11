
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ className }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className={cn("flex-1 overflow-y-auto p-6", className)}>
        <Outlet />
      </main>
    </div>
  );
};
