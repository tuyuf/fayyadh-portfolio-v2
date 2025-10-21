"use client";
import { motion } from "framer-motion";

export default function ContactFooter() {
  return (
    <footer
      id="contact"
      className="relative w-full bg-black text-white border-t border-gray-800 py-28 px-8 md:px-24 rounded-t-[2.5rem]"
    >
      {/* === Contact Section === */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-20 mb-24">
        {/* Left: Text */}
        <div className="flex-1">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-[clamp(2rem,4.5vw,3.5rem)] font-[var(--font-heading)] leading-[1.15] tracking-tight mb-6"
          >
            Let’s build something <span className="italic text-gray-300">intentional</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-gray-400 font-[var(--font-body)] text-[0.95rem] leading-relaxed max-w-md"
          >
            Open to collaborations, projects, and conversations that move ideas
            forward — calmly and purposefully.
          </motion.p>
        </div>

        {/* Right: Contact Button + Socials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="flex flex-col gap-6"
        >
          <a
            href="mailto:fayyadhmuhammadhabibie@gmail.com"
            className="relative inline-flex items-center justify-center px-10 py-3 rounded-full bg-white text-black font-[var(--font-body)] italic text-sm overflow-hidden group transition-all duration-300"
          >
            <span className="relative z-10">say hello</span>
            <span className="absolute w-16 h-16 bg-black/20 rounded-full bottom-0 right-0 translate-x-1/3 translate-y-1/3 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" />
          </a>

          <div className="flex gap-6 text-sm text-gray-400 font-[var(--font-body)]">
            <a
              href="https://www.instagram.com/fajjadh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/fayyadh-muhammad-habibie"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/tuyuf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </motion.div>
      </div>

      {/* === Footer Bottom === */}
      <div className="border-t border-gray-800 opacity-60 pt-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[0.8rem] text-gray-500 font-[var(--font-heading)] tracking-[0.12em] uppercase">
          <p>
            built by <span className="italic text-white">fayyadh muhammad habibie</span>
          </p>
          <p>© {new Date().getFullYear()} — crafted with quiet intention</p>
        </div>
      </div>
    </footer>
  );
}
