"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

function Card({ 
  children, 
  onSendToBack, 
  sensitivity, 
  randomRotation, 
  index, 
  total 
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  // UPDATE: Sudut rotasi diperbesar (-15 sampai 15 derajat) agar lebih "menyebar"
  // Menggunakan index agar rotasi konsisten per kartu (tidak bergetar saat re-render)
  const randomRotate = randomRotation 
    ? (index % 2 === 0 ? 1 : -1) * (Math.random() * 10 + 5) 
    : 0; 

  const handleDragEnd = (_, info) => {
    if (
      Math.abs(info.offset.x) > sensitivity ||
      Math.abs(info.offset.y) > sensitivity
    ) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  };

  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        x,
        y,
        rotateX,
        rotateY,
        rotate: randomRotate, // Rotasi diaplikasikan disini
        zIndex: index, 
        cursor: "grab",
      }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing", scale: 1.05 }}
      onDragEnd={handleDragEnd}
      onClick={onSendToBack}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        rotate: randomRotate // Pastikan animasi rotate tereksekusi
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}

export default function Stack({
  cards = [],
  randomRotation = true,
  sensitivity = 180,
  sendToBackOnClick = true,
  autoSlide = false, // Prop baru untuk auto slide
  autoSlideInterval = 3000 // Default 3 detik
}) {
  const [order, setOrder] = useState(cards.map((_, i) => i));

  const sendToBack = () => {
    setOrder((prev) => {
      const newOrder = [...prev];
      const topCard = newOrder.pop();
      newOrder.unshift(topCard);
      return newOrder;
    });
  };

  // UPDATE: Logic Auto Slide
  useEffect(() => {
    if (!autoSlide) return;

    const timer = setInterval(() => {
      sendToBack();
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [autoSlide, autoSlideInterval, order]); // Reset timer setiap kali order berubah (agar tidak bentrok saat user klik manual)

  return (
    <div className="relative w-full h-full">
      {order.map((cardIndex, i) => {
        return (
          <Card
            key={cardIndex}
            onSendToBack={sendToBack}
            sensitivity={sensitivity}
            randomRotation={randomRotation}
            index={i}
            total={cards.length}
          >
            {cards[cardIndex]}
          </Card>
        );
      })}
    </div>
  );
}