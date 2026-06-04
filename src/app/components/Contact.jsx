"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactFooter() {
  const [hoveredStar, setHoveredStar] = useState(-1);
  const [selectedStar, setSelectedStar] = useState(3);

  return (
    <footer id="contact" className="relative w-full">
      {/* === Subscribe Card Section === */}
      <div className="relative bg-[#f5f0eb] py-16 px-8 md:px-24 rounded-t-[2.5rem]">
        {/* Three dots */}
        <div className="flex justify-end mb-6 max-w-3xl mx-auto">
          <div className="flex flex-col gap-[3px]">
            <span className="block w-[4px] h-[4px] rounded-full bg-[#999]" />
            <span className="block w-[4px] h-[4px] rounded-full bg-[#999]" />
            <span className="block w-[4px] h-[4px] rounded-full bg-[#999]" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2
            className="text-[clamp(1.5rem,3.5vw,2.5rem)] italic tracking-tight mb-3"
            style={{ fontFamily: "var(--font-soria), var(--font-harmond), serif" }}
          >
            Do you want to see more?
          </h2>

          {/* Decorative star */}
          <div className="flex justify-center mb-10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="black" className="opacity-80">
              <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z" />
            </svg>
          </div>

          {/* Subscribe Form */}
          <form
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-0 max-w-xl mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Name"
              className="flex-1 bg-transparent border-b border-[#c5bfb8] px-4 py-3 text-sm text-black placeholder:text-[#999] focus:outline-none focus:border-black transition-colors font-[var(--font-body)]"
            />
            <input
              type="email"
              placeholder="Email"
              className="flex-1 bg-transparent border-b border-[#c5bfb8] px-4 py-3 text-sm text-black placeholder:text-[#999] focus:outline-none focus:border-black transition-colors font-[var(--font-body)]"
            />
            <button
              type="submit"
              className="border border-black px-8 py-3 text-[0.7rem] tracking-[0.25em] uppercase font-[var(--font-body)] font-medium hover:bg-black hover:text-white transition-all duration-300 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>

      {/* === Dark Footer Section === */}
      <div className="bg-black text-white py-16 px-8 md:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12">
            {/* Left: Link Columns */}
            <div className="flex gap-16 md:gap-24">
              {/* Follow Column */}
              <div>
                <h4 className="text-[0.7rem] tracking-[0.25em] uppercase font-[var(--font-body)] font-semibold mb-5">
                  Follow
                </h4>
                <ul className="space-y-2">
                  {[
                    { label: "Instagram", href: "https://www.instagram.com/fajjadh" },
                    { label: "LinkedIn", href: "https://www.linkedin.com/in/fayyadh-muhammad-habibie-b2534a305/" },
                    { label: "GitHub", href: "https://github.com/tuyuf" },
                  ].map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.8rem] text-gray-400 hover:text-white transition-colors font-[var(--font-body)] tracking-wide uppercase"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Home Column */}
              <div>
                <h4 className="text-[0.7rem] tracking-[0.25em] uppercase font-[var(--font-body)] font-semibold mb-5">
                  Home
                </h4>
                <ul className="space-y-2">
                  {[
                    { label: "Projects", href: "#projects" },
                    { label: "About", href: "#about" },
                    { label: "Contact", href: "mailto:fayyadhmuhammadhabibie@gmail.com" },
                  ].map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[0.8rem] text-gray-400 hover:text-white transition-colors font-[var(--font-body)] tracking-wide uppercase"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Logo + Rating */}
            <div className="flex flex-col items-start md:items-end gap-6">
              {/* Logo */}
              <div className="w-14 h-14 rounded-full border border-gray-600 flex items-center justify-center">
                <span
                  className="text-xl italic text-white"
                  style={{ fontFamily: "var(--font-soria), var(--font-harmond), serif" }}
                >
                  f
                </span>
              </div>

              {/* Rate Experience */}
              <div className="flex flex-col items-start md:items-end gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[0.75rem] text-gray-400 font-[var(--font-body)]">
                    Rate your experience:
                  </span>
                  <div className="flex gap-[2px]">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <button
                        key={i}
                        onMouseEnter={() => setHoveredStar(i)}
                        onMouseLeave={() => setHoveredStar(-1)}
                        onClick={() => setSelectedStar(i)}
                        className="text-sm transition-colors cursor-pointer"
                        aria-label={`Rate ${i + 1} star${i > 0 ? "s" : ""}`}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill={
                            (hoveredStar >= 0 ? i <= hoveredStar : i <= selectedStar)
                              ? "#fff"
                              : "none"
                          }
                          stroke="#fff"
                          strokeWidth="1.5"
                        >
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Credit */}
                <p className="text-[0.7rem] text-gray-500 font-[var(--font-body)] mt-2">
                  Built by{" "}
                  <span className="italic text-gray-300">Fayyadh Muhammad Habibie</span>{" "}
                  — crafted with quiet intention
                </p>
                <p className="text-[0.65rem] text-gray-600 font-[var(--font-body)]">
                  © {new Date().getFullYear()} interactwithf
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
