"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ImageMouseTrail from "./ui/ImageMouseTrail";
import Button from "./Button";
import useMarqueeImages from "../hooks/useMarqueeImages";

/**
 * Partner CTA section with interactive mouse-trail image thumbnails.
 * Uses uilayouts ImageMouseTrail component for smooth mouse-following images.
 */
export default function PartnerSection() {
  const { images } = useMarqueeImages();

  // Extract URLs for the mouse trail
  const imageUrls = images.map((img) => img?.url || img).filter(Boolean);

  return (
    <motion.section
      id="partner"
      className="w-full py-12 px-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <ImageMouseTrail
        items={imageUrls}
        className="max-w-7xl mx-auto h-auto min-h-[500px] md:min-h-[600px] rounded-[40px] shadow-secondary-btn bg-white"
        imgClass="w-36 h-44 md:w-40 md:h-48 rounded-xl"
        maxNumberOfImages={6}
        distance={15}
        fadeAnimation={true}
      >
        {/* Heading */}
        <motion.h2
          className="font-pp-mondwest text-[48px] md:text-[64px] lg:text-[80px] text-[#0D212C] tracking-tight mb-12 text-center relative z-20 pointer-events-none"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Partner with me
        </motion.h2>

        {/* CTA Button */}
        <motion.div
          className="relative z-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Button
            variant="primary"
            href="mailto:fayyadhmuhammadhabibie@gmail.com"
            className="gap-3"
          >
            <Image
              src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100"
              alt="Fayyadh"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            Start chat with Fayyadh
          </Button>
        </motion.div>
      </ImageMouseTrail>
    </motion.section>
  );
}
