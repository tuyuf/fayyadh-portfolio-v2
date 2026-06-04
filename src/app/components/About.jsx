"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const signaturePath =
  "M62.6997 44.1142C62.6025 44.1142 61.1523 44.3608 58.3814 45.3955C50.4823 48.345 46.3391 64.7965 44.0934 74.672C43.666 76.5517 44.433 78.3559 45.4179 79.806C47.4606 82.8135 56.9069 85.3659 83.7847 88.3979C103.347 90.6047 135.302 89.8562 177.49 85.1416C219.678 80.427 271.224 70.6667 302.254 64.1231C333.284 57.5795 342.237 54.5484 355.595 48.7703C386.769 35.2856 406.413 24.5171 409.956 21.8589C412.958 19.6065 414.738 16.4402 415.934 13.273C416.491 11.7972 416.37 10.4011 415.702 9.15522C412.407 3.01346 400.559 2.66219 386.813 1.68643C378.469 1.0941 367.284 1.41243 331.808 10.3144C296.331 19.2165 236.885 36.9757 195.394 51.1436C153.904 65.3114 132.17 75.3497 119.429 81.4389C106.688 87.5281 103.598 89.3641 92.9336 97.866C82.2692 106.368 64.1243 121.48 53.4803 130.773C39.8639 142.66 36.5651 147.452 35.3566 150.034C34.7916 151.24 35.7843 152.681 36.9003 152.925C44.4891 154.586 51.6518 140.962 55.2611 133.451C57.2399 129.333 55.2996 124.925 53.1725 122.322C50.7976 119.416 29.1377 119.919 4.01778 118.847C-2.49577 118.569 3.97175 115.687 19.5019 114.002C35.0321 112.317 59.5119 111.114 74.1724 110.033C92.9877 108.647 98.8773 106.832 100.197 106.459C100.601 106.345 97.2167 106.355 96.3439 106.858C95.4711 107.361 96.3813 108.35 97.5224 108.673C102.564 110.102 109.562 110.572 114.203 108.111C116.348 106.973 118.973 111.359 121.719 111.979C124.254 112.551 126.114 108.738 128.542 107.748C131.161 106.68 134.58 109.288 137.786 110.198C140.6 110.996 142.322 107.419 143.33 105.923C146.176 101.7 153.503 108.968 159.146 110.173C160.633 110.491 162.101 111.114 163.152 110.658C164.203 110.202 164.759 108.778 165.761 108.505C171.501 106.943 179.65 110.909 185.703 108.025C187.252 107.287 188.173 105.14 189.009 105.436C195.881 107.871 187.941 121.151 181.685 132.946C177.661 140.532 166.266 147.55 153.697 152.899C144.252 156.919 135.505 156.182 132.722 154.986C131.464 154.445 132.715 151.509 133.956 149.637C135.196 147.765 136.949 146.4 148.522 140.661C160.094 134.923 181.433 124.854 202.778 116.888C224.123 108.923 244.826 103.366 267.415 96.9617";

export default function About({ profile }) {
  const sectionRef = useRef(null);
  const sigRef = useRef(null);

  useEffect(() => {
    if (!sigRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sigRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "none",
          scrollTrigger: {
            trigger: sigRef.current,
            start: "top 85%",
            end: "top 45%",
            scrub: true,
          },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const aboutParagraphs = (profile?.aboutText || "")
    .split("\n")
    .map((text) => text.trim())
    .filter(Boolean);

  const defaultParagraphs = [
    "I craft digital experiences that bridge design and development. From intuitive interfaces to full-stack applications, every project is shaped by clarity, intent, and a deep respect for the user.",
    "The studio is deliberately small. I guide the creative vision on every project, moving fast without cutting corners.",
    "Open for collaborations and freelance work.",
  ];

  const paragraphs =
    aboutParagraphs.length > 0 ? aboutParagraphs : defaultParagraphs;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="flex flex-col items-center justify-center min-h-[100dvh] py-16 md:py-24"
    >
      <motion.div
        className="max-w-[440px] mx-auto px-6 text-left"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        {/* Heading */}
        <motion.h2
          variants={fadeUpItem}
          className="font-pp-mondwest text-3xl md:text-5xl text-[#051A24] tracking-tight leading-[1.15]"
        >
          Thank you for scrolling this far
        </motion.h2>

        {/* Subtle line */}
        <motion.div
          variants={fadeUpItem}
          className="h-px w-full bg-[#051A24]/20 mt-4 mb-8"
        />

        {/* About paragraphs */}
        <motion.div variants={fadeUpItem} className="space-y-4 mb-12">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base md:text-lg text-[#051A24]/70 leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </motion.div>

        {/* Signature reveal via scroll-linked wipe */}
        <div ref={sigRef} className="mb-10">
          <svg
            width="240"
            height="91"
            viewBox="0 0 418 158"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-90"
          >
            <path
              d={signaturePath}
              stroke="#051A24"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Profile avatar + name */}
        <motion.div
          variants={fadeUpItem}
          className="flex items-center justify-start gap-3"
        >
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#051A24]/5">
            <Image
              src={profile?.photoUrl || "/images/profile.jpeg"}
              alt={profile?.name || "Profile photo"}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <span className="text-sm text-[#051A24]/80">
            {profile?.name || "Muhammad Fayyadh"}
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
