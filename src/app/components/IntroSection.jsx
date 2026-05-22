"use client";

import { motion } from "framer-motion";
import { AnimatedContainer, AnimatedItem } from "./AnimatedSection";

const stats = [
  { label: "Based in", value: "Semarang, ID" },
  { label: "Focus", value: "Design + Dev" },
  { label: "Approach", value: "Quiet & Minimal" },
  { label: "Status", value: "Open for work" },
];

export default function IntroSection() {
  return (
    <AnimatedContainer
      id="intro"
      className="flex flex-col items-center justify-center min-h-[100dvh] py-16 md:py-24"
      as="section"
    >
      <div className="w-full max-w-[900px] mx-auto px-6">
        {/* Intro text */}
        <div className="space-y-5">
          <AnimatedItem>
            <p className="text-sm md:text-base text-[#051A24]/80 leading-relaxed">
              Hi, I'm Fayyadh — a designer and developer based in Semarang, Indonesia.
              I craft digital experiences that bridge design and development,
              moving between interfaces, brands, and code with equal curiosity.
            </p>
          </AnimatedItem>

          <AnimatedItem>
            <p className="text-sm md:text-base text-[#051A24]/60 leading-relaxed">
              This space is a living archive of selected works across UI/UX, brand identity,
              photography, videography, and web development. Each project is shaped by clarity,
              intent, and a deep respect for the user.
            </p>
          </AnimatedItem>

          <AnimatedItem>
            <p className="text-sm md:text-base text-[#051A24]/60 leading-relaxed">
              The studio is deliberately small. I guide the creative vision on every project,
              moving fast without cutting corners. Open for collaborations and freelance work.
            </p>
          </AnimatedItem>

          {/* Stats / quick facts */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.3,
                },
              },
            }}
          >
            {stats.map((item, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      ease: [0.25, 0.1, 0.25, 1],
                    },
                  },
                }}
              >
                <p className="text-[10px] font-mono text-[#051A24]/40 uppercase tracking-wider mb-1">
                  {item.label}
                </p>
                <p className="text-sm md:text-base text-[#051A24] font-medium">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </AnimatedContainer>
  );
}
