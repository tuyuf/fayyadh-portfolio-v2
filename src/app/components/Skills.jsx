"use client";

import { motion } from "framer-motion";
import {
  SiFigma,
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiPrisma,
  SiPostgresql,
  SiFramer,
} from "react-icons/si";
import { TbBrandAdobePhotoshop, TbBrandAdobe } from "react-icons/tb";

const categories = [
  {
    label: "Creative Arsenal",
    title: "Design & Interaction",
    skills: [
      { name: "Figma", icon: <SiFigma /> },
      { name: "Photoshop", icon: <TbBrandAdobePhotoshop /> },
      { name: "Lightroom", icon: <TbBrandAdobe /> },
      { name: "Framer", icon: <SiFramer /> },
    ],
  },
  {
    label: "Tech Stack",
    title: "Development & Logic",
    skills: [
      { name: "Next.js", icon: <SiNextdotjs /> },
      { name: "React", icon: <SiReact /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss /> },
      { name: "Prisma", icon: <SiPrisma /> },
      { name: "PostgreSQL", icon: <SiPostgresql /> },
    ],
  },
];

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function Skills() {
  return (
    <motion.section
      className="relative bg-white text-black py-20 md:py-24 border-t border-gray-100"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-24">
        {/* Section Marker */}
        <div className="flex justify-between items-center mb-20 text-[10px] tracking-[0.2em] uppercase text-gray-400 font-[var(--font-body)]">
          <span>02 / Capabilities</span>
          <span className="hidden sm:block">Crafting Digital Excellence</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          {/* Intro */}
          <div className="lg:col-span-5">
            <motion.div variants={fadeUpItem}>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-heading leading-[1.1] mb-8 tracking-tight">
                Tools of <br />
                <span className="italic">the Trade.</span>
              </h2>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base max-w-sm mb-12">
                A curated selection of tools and technologies I use to bridge the
                gap between imagination and functional reality.
              </p>
            </motion.div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-7 space-y-20">
            {categories.map((cat, idx) => (
              <motion.div key={idx} variants={fadeUpItem}>
                <div className="flex items-center gap-4 mb-10">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-gray-400">
                    {cat.label}
                  </span>
                  <div className="h-[1px] flex-1 bg-gray-100"></div>
                </div>

                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.1,
                      },
                    },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {cat.skills.map((skill, i) => (
                    <motion.div
                      key={i}
                      className="group flex items-center justify-between border-b border-gray-50 pb-4 hover:border-black transition-colors duration-500"
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.4,
                            ease: [0.25, 0.1, 0.25, 1],
                          },
                        },
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xl text-gray-300 group-hover:text-black transition-colors duration-500">
                          {skill.icon}
                        </span>
                        <span className="text-lg md:text-xl font-heading italic text-gray-800 group-hover:text-black transition-colors duration-500">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-[9px] uppercase tracking-widest text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-500">
                        Expertise
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
