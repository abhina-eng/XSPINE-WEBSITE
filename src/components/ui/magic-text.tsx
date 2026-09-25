"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export interface MagicTextProps {
  text: string;
  className?: string;
  variant?: "heading" | "paragraph";
}

interface WordProps {
  children: string;
  progress: any;
  range: number[];
  variant: "heading" | "paragraph";
}

const wordStyles = {
  heading: "relative mt-1 mr-2 text-3xl md:text-[56px] font-semibold leading-[1.15]",
  paragraph: "relative mt-1 mr-1 text-base md:text-2xl font-normal leading-relaxed",
};

const Word: React.FC<WordProps> = ({ children, progress, range, variant }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  const color = useTransform(
    opacity,
    [0, 0.5, 1],
    ["rgba(255,255,255,0.2)", "#3BA778", "#ffffff"]
  );

  return (
    <span className={wordStyles[variant]}>
      <span className="absolute opacity-20">{children}</span>
      <motion.span style={{ opacity, color }}>
        {children}
      </motion.span>
    </span>
  );
};

export const MagicText: React.FC<MagicTextProps> = ({ text, className, variant = "paragraph" }) => {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.4"],
  });

  const words = text.split(" ");

  return (
    <p ref={container} className={`flex flex-wrap leading-snug ${className ?? ""}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]} variant={variant}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};
