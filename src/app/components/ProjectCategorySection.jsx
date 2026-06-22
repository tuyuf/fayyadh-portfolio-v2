"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import ProjectStack from "./ProjectStack";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const fadeUpItem = {
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

export default function ProjectCategorySection({
  num,
  title,
  preview,
  projects,
  id,
  layout = "vertical",
}) {
  const isHorizontal = layout === "horizontal";

  return (
    <motion.section
      id={id}
      className={`flex flex-col justify-center py-16 md:py-24 pb-24 ${projects.length > 3 ? "min-h-[100dvh]" : ""}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={staggerContainer}
    >
      {/* Category header - slightly shifted left layout */}
      <div className="max-w-[600px] mx-auto px-6 w-full text-left">
        <motion.div className="mb-12 md:mb-20" variants={fadeUpItem}>
          <div className="mb-2 md:mb-4">
            <h3 className="font-pp-mondwest font-bold text-[28px] md:text-[40px] lg:text-[48px] whitespace-nowrap text-[#051A24] tracking-tight leading-[1]">
              {title}
            </h3>
          </div>
          <p className="text-sm md:text-base md:text-lg text-[#051A24]/70 leading-relaxed font-medium">
            {preview}
          </p>
        </motion.div>
      </div>

      {/* Projects list */}
      {isHorizontal ? (
        <div className="max-w-[600px] mx-auto px-6 w-full relative">
          <div className="flex justify-start">
            {projects.length === 0 ? (
              <motion.p
                className="text-sm text-[#051A24]/40 italic"
                variants={fadeUpItem}
              >
                No projects yet — check back soon.
              </motion.p>
            ) : (
              <ProjectStack projects={projects} />
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-[600px] mx-auto px-6 w-full space-y-24 md:space-y-32">
          {projects.length === 0 ? (
            <motion.p
              className="text-sm text-[#051A24]/40 italic"
              variants={fadeUpItem}
            >
              No projects yet — check back soon.
            </motion.p>
          ) : (
            projects.map((project, i) => (
              <motion.div
                key={`${id}-${project.id || i}`}
                variants={fadeUpItem}
                className="w-full"
              >
                <ProjectCard project={project} index={i} variant="portrait" />
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.section>
  );
}
