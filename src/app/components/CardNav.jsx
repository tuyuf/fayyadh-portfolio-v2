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

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;
    const contentEl = navEl.querySelector(".card-nav-content");
    if (!contentEl) return 260;
    const topBar = 60;
    const contentHeight = contentEl.scrollHeight;
    return topBar + contentHeight + 16;
  };

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

  // 🧠 Toggle Menu (fixed)
  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl || isAnimating) return;

    setIsAnimating(true);

    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);

      tl.eventCallback("onStart", () => setIsAnimating(true));
      tl.eventCallback("onComplete", () => setIsAnimating(false));
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);

      tl.eventCallback("onStart", () => setIsAnimating(true));
      tl.eventCallback("onReverseComplete", () => {
        setIsExpanded(false);
        setIsAnimating(false);
        tl.eventCallback("onReverseComplete", null); // bersihkan callback
      });

      tl.reverse();
    }
  };

  const setCardRef = (i) => (el) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div className={`card-nav-container ${className}`}>
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""}`}
        style={{
          background: "#000",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          transition: "all 0.3s ease",
        }}
      >
        {/* ===== Top Bar ===== */}
        <div className="card-nav-top flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.1)]">
          {/* === Hamburger === */}
          <div className="flex items-center gap-3">
            <div
              className={`hamburger-menu ${isHamburgerOpen ? "open" : ""}`}
              onClick={toggleMenu}
              role="button"
              aria-label={isExpanded ? "Close menu" : "Open menu"}
              tabIndex={0}
              style={{ color: menuColor, cursor: isAnimating ? "not-allowed" : "pointer" }}
            >
              <div className="hamburger-line bg-white" />
              <div className="hamburger-line bg-white" />
            </div>
          </div>

          {/* === Clock === */}
          <div className="nav-clock text-sm text-gray-400 font-mono tracking-widest select-none">
            {time}
          </div>
        </div>

        {/* ===== Dropdown ===== */}
        <div
          className="card-nav-content flex flex-wrap justify-center gap-6 px-6 py-6"
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card cursor-pointer text-center p-5 w-44"
              ref={setCardRef(idx)}
              style={{
                background: "#111",
                color: item.textColor || "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#222";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#111";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              <div className="nav-card-label text-base uppercase font-semibold tracking-wide text-white mb-3">
                {item.label}
              </div>
              <div className="nav-card-links flex flex-col gap-1 text-sm">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link flex items-center justify-center gap-1 text-gray-300 hover:text-white transition-all duration-300"
                    href={lnk.href}
                    onClick={() => {
                      // reset semua state biar bisa dibuka lagi tanpa reload
                      setIsExpanded(false);
                      setIsHamburgerOpen(false);
                      tlRef.current?.reverse(0);
                    }}
                  >
                    <GoArrowUpRight className="text-xs" />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
