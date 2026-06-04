"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { SECTIONS } from "./SidebarNavigation";

export default function MobileSectionNav() {
  const [activeSection, setActiveSection] = useState("intro");
  const [isVisible, setIsVisible] = useState(false);

  // Scroll tracking logic — mirrors SidebarNavigation exactly
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

    const pollForSections = () => {
      const allFound = SECTIONS.every((s) => document.getElementById(s.id));
      if (allFound) {
        handleScroll();
        if (pollTimer) clearTimeout(pollTimer);
        return true;
      }
      return false;
    };

    const initTimer = setTimeout(() => {
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });

      if (!pollForSections()) {
        let attempts = 0;
        const maxAttempts = 25;

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

  const activeIndex = useMemo(() => {
    return SECTIONS.findIndex((s) => s.id === activeSection);
  }, [activeSection]);

  const section = activeIndex >= 0 ? SECTIONS[activeIndex] : null;
  const prev = activeIndex > 0 ? SECTIONS[activeIndex - 1] : null;
  const next =
    activeIndex >= 0 && activeIndex < SECTIONS.length - 1
      ? SECTIONS[activeIndex + 1]
      : null;

  const handleClick = useCallback((id) => {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  if (!section) return null;

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#051A24]/10 py-4 flex lg:hidden items-center justify-center transition-all duration-500 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-full pointer-events-none"
      }`}
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom), 1rem)",
      }}
    >
      <div className="w-full max-w-[900px] mx-auto px-6 flex items-center justify-between">
        {/* Arrow Left */}
        <button
          onClick={() => handleClick(prev?.id)}
          disabled={!prev}
          className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${
            prev
              ? "text-[#051A24]/70 hover:bg-[#051A24] hover:text-white"
              : "text-[#051A24]/20 cursor-not-allowed"
          }`}
          aria-label="Previous section"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Active Section: num + label */}
        <div className="flex items-center gap-3 font-pp-neue">
          <span className="text-lg md:text-xl text-[#051A24] opacity-80">
            {section.num}
          </span>
          <span className="text-base md:text-lg text-[#051A24] border-b border-[#051A24]/30 pb-0.5">
            {section.label}
          </span>
        </div>

        {/* Arrow Right */}
        <button
          onClick={() => handleClick(next?.id)}
          disabled={!next}
          className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${
            next
              ? "text-[#051A24]/70 hover:bg-[#051A24] hover:text-white"
              : "text-[#051A24]/20 cursor-not-allowed"
          }`}
          aria-label="Next section"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
