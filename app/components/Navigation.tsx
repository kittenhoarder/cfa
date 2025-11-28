"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDefaultUserId } from "@/lib/utils/progress";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [examInfo, setExamInfo] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    async function loadExamInfo() {
      try {
        const userId = getDefaultUserId();
        const response = await fetch(`/api/user/profile?userId=${userId}`);
        if (response.ok) {
          const profile = await response.json();
          if (profile.examLevel && profile.examDate) {
            const levelName = profile.examLevel === "level-1" ? "Level I" : 
                            profile.examLevel === "level-2" ? "Level II" : "Level III";
            const date = new Date(profile.examDate);
            const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            setExamInfo(`CFA ${levelName} - ${dateStr}`);
          }
        }
      } catch (error) {
        console.error("Error loading exam info:", error);
      }
    }
    loadExamInfo();
  }, []);

  const closeMenu = () => setIsOpen(false);

  const navItems = [
    { href: "/study", label: "Dashboard" },
    { href: "/flashcards", label: "Flashcards" },
    { href: "/practice", label: "Practice" },
    { href: "/progress", label: "Progress" },
    { href: "/", label: "Home" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-12 border-b-2 border-black bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-full px-4">
        {/* Hamburger button (mobile only) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-8 h-8 flex flex-col justify-center gap-1.5 touch-manipulation"
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-0.5 bg-black"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-semibold text-black hover:underline ${
                pathname === item.href ? "underline" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Exam info */}
        {examInfo && (
          <div className="text-sm font-semibold text-black hidden sm:block">
            {examInfo}
          </div>
        )}
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-64 bg-white border-r-2 border-black transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-0`}
        style={{ top: "48px" }}
      >
        <div className="p-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={`block py-3 px-4 border-2 border-black font-semibold text-black hover:bg-black hover:text-white transition-colors ${
                pathname === item.href ? "bg-black text-white" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
          {examInfo && (
            <div className="pt-4 border-t-2 border-black text-sm font-semibold text-black">
              {examInfo}
            </div>
          )}
        </div>
      </div>

      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50"
          style={{ top: "48px" }}
          onClick={closeMenu}
        />
      )}
    </nav>
  );
}

