"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Button from "./Button";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

/**
 * Footer with CTA button, icon, and link columns.
 * Includes CopyrightBar at the bottom.
 */
export default function Footer() {
  return (
    <footer>
      {/* Main Footer */}
      <div className="w-full py-12 px-6">
        <motion.div
          className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {/* Left: CTA Button */}
          <motion.div variants={fadeUpItem}>
            <Button
              variant="primary"
              href="mailto:fayyadhmuhammadhabibie@gmail.com"
            >
              Start a chat
            </Button>
          </motion.div>

          {/* Right: Icon + Link columns */}
          <div className="flex items-start gap-8 md:gap-12">
            {/* Arrow icon */}
            <motion.div variants={fadeUpItem}>
              <ArrowUpRight className="w-5 h-5 text-[#051A24] mt-1 flex-shrink-0" />
            </motion.div>

            {/* Column 1: Site links */}
            <motion.div
              className="flex flex-col gap-3"
              variants={staggerContainer}
            >
              <motion.a
                href="#projects"
                className="text-base text-[#051A24] hover:opacity-70 transition-opacity"
                variants={fadeUpItem}
              >
                Projects
              </motion.a>
              <motion.a
                href="#about"
                className="text-base text-[#051A24] hover:opacity-70 transition-opacity"
                variants={fadeUpItem}
              >
                About
              </motion.a>
              <motion.a
                href="#skills"
                className="text-base text-[#051A24] hover:opacity-70 transition-opacity"
                variants={fadeUpItem}
              >
                Skills
              </motion.a>
            </motion.div>

            {/* Column 2: Social links */}
            <motion.div
              className="flex flex-col gap-3"
              variants={staggerContainer}
            >
              <motion.a
                href="https://www.instagram.com/fajjadh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-[#051A24] hover:opacity-70 transition-opacity"
                variants={fadeUpItem}
              >
                Instagram
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/fayyadh-muhammad-habibie-b2534a305/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-[#051A24] hover:opacity-70 transition-opacity"
                variants={fadeUpItem}
              >
                LinkedIn
              </motion.a>
              <motion.a
                href="https://github.com/tuyuf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-[#051A24] hover:opacity-70 transition-opacity"
                variants={fadeUpItem}
              >
                GitHub
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Copyright Bar */}
      <motion.div
        className="w-full py-4 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <span className="text-sm text-[#051A24]">interactwithf</span>
          <span className="text-sm text-[#051A24]">Semarang, Indonesia</span>
        </div>
      </motion.div>
    </footer>
  );
}
