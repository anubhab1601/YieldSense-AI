/**
 * YieldSense AI — Sidebar Component
 */

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  User,
  Settings,
  Bell,
  BarChart3,
  Cloud,
  Layers,
  FileText,
  History,
  LineChart,
  X,
  Sprout,
  Shield,
} from "lucide-react";
import { ROUTES } from "@/utils/constants";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { profile } = useAuth();

  const menuItems = [
    ...(profile?.role === "admin"
      ? [
          { type: "divider" as const, label: "Administration" },
          { label: "Admin Control", icon: Shield, href: ROUTES.ADMIN },
        ]
      : []),
    { type: "divider" as const, label: "Main Navigation" },
    { label: "Dashboard", icon: LayoutDashboard, href: ROUTES.DASHBOARD },
    { label: "Farms", icon: MapPin, href: ROUTES.FARMS },
    { label: "Profile", icon: User, href: ROUTES.PROFILE },
    { label: "Notifications", icon: Bell, href: ROUTES.NOTIFICATIONS },
    { label: "Settings", icon: Settings, href: ROUTES.SETTINGS },
    { type: "divider" as const, label: "AI Features" },
    { label: "Prediction", icon: BarChart3, href: ROUTES.PREDICTION },
    { label: "Weather", icon: Cloud, href: ROUTES.WEATHER },
    { label: "Soil Analysis", icon: Layers, href: ROUTES.SOIL },
    { type: "divider" as const, label: "Analytics & Reports" },
    { label: "Analytics", icon: LineChart, href: ROUTES.ANALYTICS },
    { label: "History", icon: History, href: ROUTES.HISTORY },
    { label: "Reports", icon: FileText, href: ROUTES.REPORTS },
  ];

  const isActive = (href: string) => {
    if (href === ROUTES.DASHBOARD) return pathname === href;
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Sprout className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-green-600">YieldSense AI</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          if ("type" in item && item.type === "divider") {
            return (
              <div key={index} className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  {item.label}
                </p>
              </div>
            );
          }

          const Icon = item.icon!;
          const active = isActive(item.href!);

          return (
            <Link
              key={item.href}
              href={item.href!}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${
                  active
                    ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                }
              `}
            >
              <Icon className={`h-5 w-5 ${active ? "text-green-600" : ""}`} />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="px-3 py-2">
          <p className="text-xs text-gray-400">YieldSense AI v3.0.0</p>
          <p className="text-xs text-gray-400">Milestone 3</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-950
          border-r border-gray-100 dark:border-gray-800
          transform transition-transform duration-300 ease-out
          lg:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:top-16 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800">
        {sidebarContent}
      </aside>
    </>
  );
}
