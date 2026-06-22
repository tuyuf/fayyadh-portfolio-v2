"use client";

import { motion } from "framer-motion";

const paragraphs = [
  "\"Good design should feel inevitable, and good code should feel invisible.\"",
  "My approach is rooted in simplicity. Whether it's a brand identity, a complex web application, or an interactive UI, I believe in stripping away the unnecessary until only the essential remains.",
  "I work directly with clients to ensure the final product isn't just visually striking, but structurally sound from the ground up."
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
