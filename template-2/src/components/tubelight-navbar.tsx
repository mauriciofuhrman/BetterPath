"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export interface NavItem {
  name: string;
  sectionRef: React.RefObject<HTMLDivElement>;
  action: () => void;
  hasDropdown?: boolean;
  dropdownItems?: { title: string; path: string }[];
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add scroll event listener to update active tab based on section visibility
  useEffect(() => {
    const handleScroll = () => {
      // Find the section that's currently most visible in the viewport
      let mostVisibleSection = items[0];
      let maxVisibility = 0;

      items.forEach((item) => {
        if (item.sectionRef.current) {
          const rect = item.sectionRef.current.getBoundingClientRect();
          // Calculate how much of the section is visible (as a percentage of viewport height)
          const visibleHeight =
            Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
          const visibility = Math.max(0, visibleHeight / window.innerHeight);

          if (visibility > maxVisibility) {
            maxVisibility = visibility;
            mostVisibleSection = item;
          }
        }
      });

      setActiveTab(mostVisibleSection.name);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
        className
      )}
      ref={dropdownRef}
    >
      <div className="flex items-center gap-3 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const isActive = activeTab === item.name;
          const isDropdownOpen = openDropdown === item.name;

          return (
            <div key={item.name} className="relative">
              <button
                onClick={() => {
                  if (item.hasDropdown) {
                    toggleDropdown(item.name);
                  } else {
                    setActiveTab(item.name);
                    item.action();
                  }
                }}
                className={cn(
                  "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors flex items-center",
                  "text-foreground/80 hover:text-primary",
                  isActive && "bg-muted text-primary"
                )}
              >
                <span className="hidden md:inline">{item.name}</span>
                {item.hasDropdown && (
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
                {isActive && !isDropdownOpen && (
                  <motion.div
                    layoutId="lamp"
                    className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                      <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                    </div>
                  </motion.div>
                )}
              </button>

              {/* Dropdown Menu */}
              {item.hasDropdown && isDropdownOpen && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 py-2 w-56 bg-gray-900/90 backdrop-blur-lg border border-gray-800 rounded-xl shadow-xl z-50">
                  {item.dropdownItems?.map((dropdownItem, index) => (
                    <Link
                      key={index}
                      href={dropdownItem.path}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-blue-600/20 hover:text-blue-400 transition-colors"
                      onClick={() => setOpenDropdown(null)}
                    >
                      {dropdownItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
