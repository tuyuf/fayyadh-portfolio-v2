"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroSection from "./HeroSection";
import Projects from "./Projects";
import IntroSection from "./IntroSection";
import MetricsSection from "./MetricsSection";
import About from "./About";

const SidebarNavigation = dynamic(() => import("./SidebarNavigation"), {
  loading: () => null,
});
const MobileSectionNav = dynamic(() => import("./MobileSectionNav"), {
  loading: () => null,
});
const Marquee = dynamic(() => import("./Marquee"), {
  loading: () => (
    <div className="w-full mt-16 md:mt-20 mb-16 h-[200px] bg-gray-50 animate-pulse rounded-2xl">
      <div className="flex gap-3 px-6 h-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-[200px] md:w-[300px] h-full bg-gray-200 rounded-2xl" />
        ))}
      </div>
    </div>
  ),
});
const Footer = dynamic(() => import("./Footer"), {
  loading: () => null,
});

export default function PageContent({
  caseStudies,
  photos,
  videos,
  webProjects,
  profile,
  metrics,
}) {
  return (
    <>
      <Suspense fallback={null}>
        <SidebarNavigation />
      </Suspense>
      <Suspense fallback={null}>
        <MobileSectionNav />
      </Suspense>
      <div id="hero">
        <HeroSection />
      </div>
      <Suspense fallback={null}>
        <Marquee />
      </Suspense>
      <IntroSection />
      <MetricsSection metrics={metrics} />
      <Projects
        caseStudies={caseStudies}
        photos={photos}
        videos={videos}
        webProjects={webProjects}
      />
      <About profile={profile} />
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
