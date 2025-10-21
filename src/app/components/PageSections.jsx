"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./Hero";
import About from "./About";
import Works from "./Works";
import Process from "./Process";
import Contact from "./Contact";

gsap.registerPlugin(ScrollTrigger);

export default function PageSections() {
  useEffect(() => {
    const sections = gsap.utils.toArray(".fade-section");

    sections.forEach((section, i) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 50%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Parallax subtle background scroll
    gsap.utils.toArray(".bg-parallax").forEach((bg) => {
      gsap.to(bg, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: bg,
          scrub: true,
        },
      });
    });
  }, []);

  return (
    <main className="overflow-x-hidden">
      <section className="fade-section relative">
        <Hero />
      </section>

      <section className="fade-section relative min-h-screen">
        <About />
      </section>

      <section className="fade-section relative min-h-screen">
        <Works />
      </section>

      <section className="fade-section relative min-h-screen">
        <Process />
      </section>

      <section className="fade-section relative min-h-screen">
        <Contact />
      </section>
    </main>
  );
}
