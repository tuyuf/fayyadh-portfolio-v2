"use client";

import { motion } from "framer-motion";

const viewportConfig = {
  once: true,
  amount: 0.2,
};

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
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

/**
 * Wrapper component for sections that animate on scroll.
 * Uses Framer Motion's whileInView for consistent scroll-triggered animations.
 */
export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  id,
  as = "section",
}) {
  const Tag = motion[as] || motion.section;

  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            delay,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * Wrapper for child elements that should stagger in.
 */
export function AnimatedContainer({
  children,
  className = "",
  delay = 0,
  staggerDelay = 0.1,
  as = "div",
}) {
  const Tag = motion[as] || motion.div;

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * Individual item for use inside AnimatedContainer.
 */
export function AnimatedItem({ children, className = "" }) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}
