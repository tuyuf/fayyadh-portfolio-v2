"use client";

import { motion } from "framer-motion";
import { SiFigma, SiAdobephotoshop, SiCanva, SiNextdotjs, SiReact, SiAdobelightroom } from "react-icons/si";

export default function Skills() {
  const skills = [
    { name: "Figma", icon: <SiFigma /> },
    { name: "Photoshop", icon: <SiAdobephotoshop /> },
    { name: "Canva", icon: <SiCanva /> },
    { name: "Next.js", icon: <SiNextdotjs /> },
    { name: "React", icon: <SiReact /> },
    { name: "Lightroom", icon: <SiAdobelightroom /> },
  ];

  return (
    <section
      id="skills"
      className="relative bg-[#fafafa] text-black px-6 md:px-20 py-32 md:py-40 border-t border-gray-200"
    >
      <div className="max-w-6xl mx-auto text-center space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-[clamp(3rem,6vw,5rem)] font-[var(--font-heading)] font-normal leading-[1.1] mb-3">
            Skills & Tools
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Things I rely on to turn ideas into visual experiences — thoughtfully crafted, pixel by pixel.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-10 md:gap-16 justify-items-center"
        >
          {skills.map((skill, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="text-4xl md:text-5xl">{skill.icon}</div>
              <p className="text-sm md:text-base tracking-wide text-gray-700 font-[var(--font-body)]">
                {skill.name}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
