"use client";

import { motion } from "motion/react";
import { useRef, useEffect, useState } from "react";

function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setGradientPos({ x, y });
    };

    const handleEnter = () => setIsHovering(true);
    const handleLeave = () => setIsHovering(false);

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <section className="relative w-full flex items-end justify-center pt-[35vh] md:pt-[40vh] pb-8 md:pb-12">
      <div className="flex flex-col items-center gap-2.5 px-4">
        <motion.h1
          ref={headingRef}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="text-center text-4xl md:text-[64px] font-semibold leading-tight cursor-default"
          style={{
            backgroundImage: isHovering
              ? `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%, #3BA778 0%, #1D60AB 50%, #ffffff 80%)`
              : "none",
            WebkitBackgroundClip: isHovering ? "text" : "unset",
            WebkitTextFillColor: isHovering ? "transparent" : "#ffffff",
            backgroundClip: isHovering ? "text" : "unset",
            transition: "all 0.3s ease",
          }}
        >
          Making brands unforgettable
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: "easeInOut" }}
          className="text-center text-[#D9D9D9] text-xl md:text-[34px] font-normal leading-tight"
        >
          Built to evolve. Impossible to forget.
        </motion.p>
      </div>
    </section>
  );
}

export default HeroSection;
