"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      id="about"
      className="relative bg-[#fafafa] text-black px-6 md:px-20 py-28 md:py-36 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-[clamp(3rem,6vw,5rem)] font-[var(--font-heading)] font-normal leading-[1.1] mb-3">
            Behind the <em>pixels</em>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto"
          >
            a quiet reflection on process, collaboration, and clarity.
          </motion.p>
        </motion.div>

        {/* Flex container */}
        <div className="grid md:grid-cols-2 items-center gap-16 md:gap-20">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-700 text-[1.15rem] md:text-[1.25rem] leading-relaxed space-y-6"
          >
            <p>
              I enjoy working in spaces where ideas have room to breathe —
              where clarity comes from focus, and every decision is made with
              intent. Collaboration matters to me, but so does stillness — the
              quiet moments where design begins to take shape.
            </p>
            <p>
              My process is rooted in observation and refinement. I explore,
              simplify, and polish until everything feels natural and balanced.
              Whether it’s a visual identity, an interface, or a photograph, I
              aim to create work that feels honest and human.
            </p>
            <p>
              This portfolio reflects that mindset — thoughtful, minimal, and
              made with care for every detail that quietly brings the whole
              together.
            </p>
          </motion.div>

          {/* Right: Image (auto-scale to match text height visually) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
            whileInView={{
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 1.2,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.4,
            }}
            viewport={{ once: true }}
            className="relative w-full max-w-[520px] aspect-[4/3] mx-auto rounded-2xl overflow-hidden shadow-md"
          >
            <Image
              src="/images/pp.webp"
              alt="About visual"
              fill
              className="object-cover rounded-2xl"
            />
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
