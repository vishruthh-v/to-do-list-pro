
import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

interface LayoutProps {
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ className }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className={cn("flex-1 overflow-y-auto p-6", className)}>
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <Outlet />
      </main>
    </div>
  );
};
