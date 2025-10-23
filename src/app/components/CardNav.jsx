"use client";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { GoArrowUpRight } from "react-icons/go";
import "./CardNav.css";

const CardNav = ({
  items,
  className = "",
  ease = "power3.out",
  menuColor = "#fff",
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [time, setTime] = useState("");
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  // 🕒 Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
      setTime(now.toLocaleTimeString([], options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 📏 Dynamic height
  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;
    const contentEl = navEl.querySelector(".card-nav-content");
    if (!contentEl) return 260;
    const topBar = 60;
    const contentHeight = contentEl.scrollHeight;
    return topBar + contentHeight + 16;
  };

  // 🎬 GSAP expand/reverse
  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;
    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 30, opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, { height: calculateHeight, duration: 0.4, ease });
    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1"
    );
    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;
    return () => {
      tl?.kill();
      tlRef.current = null;
    };
  }, [ease, items]);

  // 🍔 Toggle menu expand
  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl || isAnimating) return;
    setIsAnimating(true);

    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.eventCallback("onComplete", () => setIsAnimating(false));
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => {
        setIsExpanded(false);
        setIsAnimating(false);
      });
      tl.reverse();
    }
  };

  const setCardRef = (i) => (el) => {
    if (el) cardsRef.current[i] = el;
  };

  // 🟢 Fade-in muncul bareng hero (tanpa hilang)
  useEffect(() => {
    gsap.to(navRef.current, {
      opacity: 1,
      duration: 1.2,
      ease: "power2.out",
      delay: 0.8,
    });
  }, []);

  return (
    <nav
      ref={navRef}
      className={`card-nav fixed z-[9999] ${isExpanded ? "open" : ""} ${className}`}
      style={{
        top: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#000",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "18px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
        transition: "all 0.3s ease",
        overflow: "hidden",
        width: "90%",
        maxWidth: "1100px",
        opacity: 0, // mulai fade dari 0
      }}
    >
      {/* === Top bar === */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-3">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? "open" : ""}`}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            tabIndex={0}
            style={{
              color: menuColor,
              cursor: isAnimating ? "not-allowed" : "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <div className="hamburger-line bg-white" />
            <div className="hamburger-line bg-white" />
          </div>
        </div>

        <div className="nav-clock text-xs sm:text-sm text-gray-400 font-mono tracking-widest select-none">
          {time}
        </div>
      </div>

      {/* === Dropdown === */}
      <div
        className="card-nav-content flex flex-row flex-wrap justify-center items-stretch gap-3 sm:gap-6 px-3 sm:px-10 py-6 sm:py-10 w-full"
        aria-hidden={!isExpanded}
      >
        {(items || []).slice(0, 3).map((item, idx) => (
          <div
            key={`${item.label}-${idx}`}
            className="nav-card cursor-pointer text-center p-3 sm:p-6 w-[31%] sm:w-56 md:w-60 min-w-[90px] scale-[0.93] sm:scale-100"
            ref={setCardRef(idx)}
            style={{
              background: "#111",
              color: item.textColor || "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "14px",
              boxShadow: "0 3px 12px rgba(0,0,0,0.25)",
              transition: "all 0.3s ease",
            }}
          >
            <div className="nav-card-label text-[10px] sm:text-base uppercase font-semibold tracking-wide mb-1 sm:mb-2">
              {item.label}
            </div>
            <div className="nav-card-links flex flex-col gap-[2px] sm:gap-1 text-[9px] sm:text-sm">
              {item.links?.map((lnk, i) => (
                <a
                  key={`${lnk.label}-${i}`}
                  className="nav-card-link flex items-center justify-center gap-1 text-gray-300 hover:text-white transition-all duration-300"
                  href={lnk.href}
                  onClick={() => {
                    setIsExpanded(false);
                    setIsHamburgerOpen(false);
                    tlRef.current?.reverse(0);
                  }}
                >
                  <GoArrowUpRight className="text-[8px] sm:text-xs" />
                  {lnk.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default CardNav;
