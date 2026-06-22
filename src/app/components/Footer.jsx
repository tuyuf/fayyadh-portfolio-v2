"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const riseUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.19, 1, 0.22, 1] },
  },
};

export default function Footer() {
  const [currentTime, setCurrentTime] = useState("");
  const footerRef = useRef(null);

  // Parallax scroll effect for the giant text
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  // As the footer comes into view, the text slides up from 120% to 52%
  const textY = useTransform(scrollYProgress, [0, 1], ["120%", "52%"]);
  // We can also tie opacity to the scroll to make it fade in naturally
  const textOpacity = useTransform(scrollYProgress, [0.3, 1], [0, 1]);

  // Rising gradient effect
  const gradientY = useTransform(scrollYProgress, [0, 1], ["60%", "0%"]);
  const gradientOpacity = useTransform(scrollYProgress, [0.2, 1], [0, 1]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Jakarta",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-white"
    >
      {/* Subtle gradient rising from below */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-full"
        style={{
          background:
            "linear-gradient(to top, rgba(5, 26, 36, 0.07) 0%, rgba(5, 26, 36, 0.02) 40%, transparent 80%)",
          y: gradientY,
          opacity: gradientOpacity,
        }}
      />

      {/* ─── Center Content Area ─── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-center gap-6">
          {/* Get in touch */}
          <motion.a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=fayyadhmuhammadhabibie@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-base md:text-lg text-[#051A24]/50 hover:text-[#051A24] transition-colors duration-500 underline underline-offset-4 decoration-[#051A24]/15 hover:decoration-[#051A24]/50"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          >
            Get in touch
          </motion.a>

          {/* Social Links */}
          {[
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/fayyadh-muhammad-habibie-b2534a305/",
            },
            {
              label: "Instagram",
              href: "https://www.instagram.com/fajjadh",
            },
            {
              label: "GitHub",
              href: "https://github.com/tuyuf",
            },
          ].map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm md:text-base text-[#051A24]/40 hover:text-[#051A24] transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "100px" }}
              transition={{
                duration: 0.7,
                delay: 0.15 + i * 0.08,
                ease: [0.19, 1, 0.22, 1],
              }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      </div>

      {/* ─── Bottom Bar ─── */}
      <motion.div
        className="relative z-10 px-6 md:px-12 lg:px-20 py-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.2 },
          },
        }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs md:text-sm text-[#051A24]/40">
            <motion.span variants={riseUp}>
              © 2025 interactwithf
            </motion.span>

            <motion.div
              className="flex items-center gap-4 md:gap-6"
              variants={riseUp}
            >
              <span>Semarang, Indonesia</span>
              <span className="font-mono tabular-nums">{currentTime}</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ─── Brutalist Giant Name (Parallax Scrolling) ─── */}
      <div
        className="relative w-full overflow-hidden select-none pointer-events-none"
        style={{ height: "clamp(100px, 18vw, 220px)" }}
      >
        <motion.div
          className="absolute bottom-0 left-0 right-0 flex justify-center"
          style={{ y: textY, opacity: textOpacity }}
        >
          <span
            className="font-pp-mondwest uppercase whitespace-nowrap"
            style={{
              fontSize: "clamp(120px, 20vw, 340px)",
              lineHeight: 0.85,
              letterSpacing: "-0.03em",
              color: "rgba(5, 26, 36, 0.045)",
            }}
          >
            interactwithf
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
