"use client";

import { motion } from "framer-motion";

const paragraphs = [
  "Muhammad Fayyadh is a design and development studio crafting digital experiences at the intersection of visual design and full-stack engineering. Every project is shaped by clarity, intent, and a deep respect for the people who use it.",
  "The work spans brand identities, UI/UX systems, and web applications — always built with the same conviction: that good design should feel inevitable, and good code should feel invisible.",
  "Open for collaborations, freelance work, and ambitious side projects. If you have something meaningful to build, let's talk.",
];

export default function IntroSection() {
  return (
    <section
      id="intro"
      className="flex flex-col items-center justify-center min-h-[100dvh] py-16 md:py-24"
    >
      <div className="w-full max-w-[600px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-left"
        >
          {/* Symbol */}
          <div className="flex justify-center mb-12 md:mb-16">
            <span className="text-4xl md:text-5xl text-[#051A24]/20 select-none">
              &#10022;
            </span>
          </div>

          {/* Paragraphs */}
          <div className="space-y-6 md:space-y-8">
            {paragraphs.map((text, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="font-pp-neue text-lg md:text-xl text-[#051A24]/85 leading-relaxed"
              >
                {text}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
