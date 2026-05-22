"use client";

import { useState, useEffect } from "react";

const SECTIONS = [
  { id: "intro", num: "01", label: "Intro" },
  { id: "uiux", num: "02", label: "UI / UX Design" },
  { id: "brand", num: "03", label: "Brand & Identity" },
  { id: "webdev", num: "04", label: "Web Development" },
  { id: "photovideo", num: "05", label: "Photography & Videography" },
  { id: "about", num: "06", label: "About & Skills" },
];

export default function SidebarNavigation() {
  const [activeSection, setActiveSection] = useState("intro");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    let rafId = null;
    let pollTimer = null;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const vh = window.innerHeight;

        // --- 1. Visibility: show when past hero, hide at partner ---
        const heroEl = document.getElementById("hero");
        const partnerEl = document.getElementById("partner");

        let visible = false;

        if (heroEl) {
          const heroBottom = heroEl.getBoundingClientRect().bottom + scrollY;
          visible = scrollY >= heroBottom - 100;
        }

        if (visible && partnerEl) {
          const partnerTop = partnerEl.getBoundingClientRect().top + scrollY;
          if (scrollY >= partnerTop - vh * 0.5) {
            visible = false;
          }
        }

        setIsVisible(visible);

        // --- 2. Active section: find section whose top is closest to viewport center ---
        const viewportCenter = scrollY + vh * 0.4;
        let current = "intro";

        for (let i = SECTIONS.length - 1; i >= 0; i--) {
          const section = SECTIONS[i];
          const el = document.getElementById(section.id);
          if (!el) continue;

          const elTop = el.getBoundingClientRect().top + scrollY;
          if (viewportCenter >= elTop) {
            current = section.id;
            break;
          }
        }

        setActiveSection(current);
        ticking = false;
      });
    };

    // --- 3. Poll for dynamic sections to appear ---
    const pollForSections = () => {
      const allFound = SECTIONS.every((s) => document.getElementById(s.id));
      if (allFound) {
        handleScroll();
        if (pollTimer) clearTimeout(pollTimer);
        return true;
      }
      return false;
    };

    // Initial delayed start to allow dynamic components to mount
    const initTimer = setTimeout(() => {
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });

      // Poll until all sections are found (max 5s)
      if (!pollForSections()) {
        let attempts = 0;
        const maxAttempts = 25; // 25 * 200ms = 5s

        const doPoll = () => {
          attempts++;
          if (attempts > maxAttempts) return;

          if (!pollForSections()) {
            pollTimer = setTimeout(doPoll, 200);
          }
        };

        pollTimer = setTimeout(doPoll, 200);
      }
    }, 300);

    return () => {
      clearTimeout(initTimer);
      if (pollTimer) clearTimeout(pollTimer);
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className={`hidden lg:flex fixed left-3 xl:left-5 top-1/2 -translate-y-1/2 flex-col gap-4 transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 z-40" : "opacity-0 pointer-events-none z-0"
      }`}
    >
      {SECTIONS.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <button
            key={section.id}
            onClick={() => handleClick(section.id)}
            className={`group flex items-center gap-4 text-left transition-all duration-500 ease-out ${
              isActive ? "opacity-100" : "opacity-30 hover:opacity-60"
            }`}
          >
            <span
              className={`font-mono text-[11px] tracking-widest transition-all duration-500 ${
                isActive ? "text-[#051A24]" : "text-[#051A24]/50"
              }`}
            >
              {section.num}
            </span>
            <span
              className={`text-xs tracking-wide transition-all duration-500 whitespace-nowrap ${
                isActive
                  ? "text-[#051A24] translate-x-0 opacity-100"
                  : "text-[#051A24]/50 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
            >
              {section.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
