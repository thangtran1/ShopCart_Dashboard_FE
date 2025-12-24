"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "antd";
import { getSidebarTabs, TabKey } from "./config/tabs.config";

interface SidebarProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const sidebarItems = getSidebarTabs();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className="flex-shrink-0">
      <div
        className={`
          h-full rounded-lg shadow-sm
          transition-all duration-300
          w-12 md:${collapsed ? "w-16" : "w-64"}
        `}
      >
        {/* TOGGLE – DESKTOP */}
        <div className="hidden md:flex justify-end px-2 py-2">
          <Button
            type="text"
            size="small"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          />
        </div>

        {sidebarItems.map((item, index) => {
          const isActive = activeTab === item.key;
          const isCollapsed = collapsed;

          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`
                  group w-full flex items-center
                  ${isCollapsed ? "justify-center px-2" : "px-4"}
                  gap-3 py-3 relative
                  transition-colors
                  hover:bg-primary/90 hover:text-foreground
                  ${isActive ? "bg-primary/80 text-foreground" : "text-foreground"}
                  ${index > 0 ? "border-t border-border" : ""}
                  md:${isCollapsed ? "" : "border-l-4 border-warning"}
                `}
            >
              <span className="text-lg">{item.icon}</span>

              {/* LABEL */}
              {!isCollapsed && (
                <span className="hidden md:inline text-sm truncate">
                  {item.label}
                </span>
              )}

              {/* TOOLTIP */}
              {isCollapsed && (
                <span className="
                    absolute left-full ml-2 px-2 py-1
                    text-foreground text-xs rounded
                    opacity-0 group-hover:opacity-100
                    transition-opacity
                    whitespace-nowrap pointer-events-none
                  ">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
