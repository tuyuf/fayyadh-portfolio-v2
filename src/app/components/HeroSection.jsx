"use client";

import { useInViewAnimation } from "../hooks/useInViewAnimation";
import Button from "./Button";

export default function HeroSection() {
  const { ref, isInView } = useInViewAnimation();

  return (
    <section
      ref={ref}
      className="flex flex-col items-start text-left max-w-[440px] mx-auto px-6 pt-12 md:pt-16 pb-8"
    >
      {/* Logo text */}
      <h1
        className={`font-pp-mondwest text-[45px] md:text-[45px] lg:text-[45px] font-semibold text-[#051A24] tracking-tight mb-4 ${isInView ? "animate-fade-in-up" : "opacity-0"
          }`}
        style={{ animationDelay: "0.1s" }}
      >
        interactwithf
      </h1>

      {/* Tagline */}
      <p
        className={`text-xs md:text-sm text-[#051A24] mb-2 ${isInView ? "animate-fade-in-up" : "opacity-0"
          }`}
        style={{ animationDelay: "0.2s" }}
      >
        The creative studio of Fayyadh
      </p>

      {/* Main Heading */}
      <h2
        className={`text-[32px] md:text-[40px] lg:text-[44px] leading-[1.1] text-[#0D212C] tracking-tight whitespace-nowrap ${isInView ? "animate-fade-in-up" : "opacity-0"
          }`}
        style={{ animationDelay: "0.3s" }}
      >
        Build the <span className="font-pp-mondwest">next wave,</span>
        <br />
        the <span className="font-pp-mondwest">bold way.</span>
      </h2>

      {/* Description paragraphs */}
      <div
        className={`flex flex-col gap-6 text-sm md:text-base text-[#051A24] leading-relaxed mt-5 md:mt-6 ${isInView ? "animate-fade-in-up" : "opacity-0"
          }`}
        style={{ animationDelay: "0.4s" }}
      >
        <p>
          I craft digital experiences that bridge design and development. From intuitive
          interfaces to full-stack applications, every project is shaped by clarity, intent,
          and a deep respect for the user.
        </p>
        <p>
          The studio is deliberately small. I guide the creative vision on every project,
          moving fast without cutting corners.
        </p>
        <p>
          Open for collaborations and freelance work.
        </p>
      </div>

      {/* CTA Buttons */}
      <div
        className={`flex flex-col sm:flex-row gap-3 md:gap-4 mt-5 md:mt-6 w-full sm:w-auto ${isInView ? "animate-fade-in-up" : "opacity-0"
          }`}
        style={{ animationDelay: "0.5s" }}
      >
        <Button
          variant="primary"
          href="mailto:fayyadhmuhammadhabibie@gmail.com"
        >
          Start a chat
        </Button>
        <Button variant="secondary" href="#projects">
          View projects
        </Button>
      </div>
    </section>
  );
}
