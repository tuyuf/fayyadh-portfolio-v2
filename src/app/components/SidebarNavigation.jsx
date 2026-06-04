"use client";

import { useState, useEffect } from "react";

export const SECTIONS = [
  { id: "intro", num: "01", label: "Intro" },
  { id: "metrics", num: "02", label: "Metrics" },
  { id: "uiux", num: "03", label: "UI / UX Design" },
  { id: "brand", num: "04", label: "Brand & Identity" },
  { id: "webdev", num: "05", label: "Web Development" },
  { id: "photovideo", num: "06", label: "Photography" },
  { id: "about", num: "07", label: "About & Skills" },
];

function AnimatedText({ text, className, baseDelay = 0, charStagger = 0.03, trigger = 0 }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <span
          key={`${i}-${trigger}`}
          className="inline-block"
          style={{
            animation: `charFadeUp 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) ${baseDelay + i * charStagger}s both`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      <style jsx>{`
        @keyframes charFadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </span>
  );
}

export default function SidebarNavigation() {
  const [activeSection, setActiveSection] = useState("intro");
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [triggers, setTriggers] = useState({});
  const [animatedItems, setAnimatedItems] = useState({});
  const [sidebarVisibleOnce, setSidebarVisibleOnce] = useState(false);

  // Reset animation state when sidebar hides
  useEffect(() => {
    if (!isVisible && sidebarVisibleOnce) {
      setAnimatedItems({});
      setTriggers({});
      setSidebarVisibleOnce(false);
    } else if (isVisible) {
      setSidebarVisibleOnce(true);
    }
  }, [isVisible, sidebarVisibleOnce]);

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

  const triggerAnimation = (id) => {
    if (!animatedItems[id]) {
      setTriggers((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
      setAnimatedItems((prev) => ({
        ...prev,
        [id]: true,
      }));
    }
  };

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    triggerAnimation(id);
  };

  const handleMouseEnter = (id) => {
    setHoveredItem(id);
    triggerAnimation(id);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <>
      {/* Desktop sidebar navigation */}
      <nav
        className={`hidden lg:flex fixed left-2 xl:left-3 top-1/2 -translate-y-1/2 flex-col gap-2 transition-all duration-500 ease-out ${
          isVisible ? "opacity-100 z-40" : "opacity-0 pointer-events-none z-0"
        }`}
      >
        {SECTIONS.map((section, index) => {
          const isActive = activeSection === section.id;
          const itemDelay = index * 0.1;
          const isHovered = hoveredItem === section.id;
          const shouldShowLabel = isActive || isHovered;

          return (
            <button
              key={section.id}
              onClick={() => handleClick(section.id)}
              onMouseEnter={() => handleMouseEnter(section.id)}
              onMouseLeave={handleMouseLeave}
              className="flex items-baseline text-left hover:translate-x-1 transition-transform duration-300"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) ${itemDelay}s`,
              }}
            >
              <AnimatedText
                text={section.num}
                className={`font-pp-neue text-base transition-colors duration-300 ${
                  isActive ? "text-[#051A24]" : "text-[#051A24]/40"
                }`}
                baseDelay={itemDelay}
                charStagger={0.03}
                trigger={triggers[section.id] || 0}
              />

              {shouldShowLabel && (
                <AnimatedText
                  text={section.label}
                  className={`font-pp-neue text-sm pb-0.5 ml-2 ${
                    isActive
                      ? "text-[#051A24] border-b border-[#051A24]"
                      : "text-[#051A24]/60"
                  }`}
                  baseDelay={0.05}
                  charStagger={0.03}
                  trigger={triggers[section.id] || 0}
                />
              )}
            </button>
          );
        })}
      </nav>

    </>
  );
}
