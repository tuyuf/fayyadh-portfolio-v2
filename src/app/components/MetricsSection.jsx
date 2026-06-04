"use client";

import { motion } from "framer-motion";
import { AnimatedContainer, AnimatedItem } from "./AnimatedSection";

const cardVariants = {
  rest: {},
  hover: {
    borderColor: "rgba(5, 26, 36, 0.25)",
    transition: { duration: 0.3 },
  },
};

const numberVariants = {
  rest: { y: 48 },
  hover: {
    y: -16,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const descVariants = {
  rest: { opacity: 0, y: 12 },
  hover: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, delay: 0.02, ease: "easeOut" },
  },
};

export default function MetricsSection({ metrics }) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <section
      id="metrics"
      className="w-full max-w-[1200px] mx-auto px-6 py-16 md:py-24"
    >
      <AnimatedContainer
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        staggerDelay={0.08}
      >
        {metrics.map((metric) => (
          <AnimatedItem key={metric.id}>
            <MetricCard metric={metric} />
          </AnimatedItem>
        ))}
      </AnimatedContainer>
    </section>
  );
}

function MetricCard({ metric }) {
  return (
    <motion.div
      className="relative border border-[#051A24]/10 rounded-2xl bg-white overflow-hidden flex flex-col min-h-[280px] md:min-h-[320px] cursor-default"
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardVariants}
    >
      {/* Top label bar */}
      <div className="border-b border-[#051A24]/10 px-6 py-4 flex-shrink-0">
        <p className="text-[11px] md:text-xs font-medium tracking-[0.15em] uppercase text-[#051A24]/50">
          {metric.label}
        </p>
      </div>

      {/* Bottom content area */}
      <div className="flex-1 flex flex-col justify-end px-6 pb-6 overflow-hidden">
        {/* Number + suffix */}
        <motion.div variants={numberVariants} className="origin-bottom">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl md:text-6xl lg:text-7xl font-heading text-[#051A24] leading-[0.9]">
              {metric.value}
            </span>
            {metric.suffix && (
              <span className="text-sm md:text-base font-medium text-[#051A24]/40 tracking-wide">
                {metric.suffix}
              </span>
            )}
          </div>
        </motion.div>

        {/* Description — slides up on hover */}
        {metric.description && (
          <motion.p
            variants={descVariants}
            className="text-sm text-[#051A24]/60 leading-relaxed mt-3 max-w-[90%]"
          >
            {metric.description}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
