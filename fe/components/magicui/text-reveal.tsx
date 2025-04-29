"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  textClassName?: string;
  delay?: number;
  revealText?: boolean;
  once?: boolean;
  children?: React.ReactNode;
  element?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className,
  textClassName,
  delay = 0,
  revealText = true,
  once = true,
  children,
  element: Element = "p",
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-100px" });
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    if (inView && !hasPlayed) {
      controls.start("visible");
      setHasPlayed(true);
    }
  }, [controls, inView, hasPlayed]);

  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay * i },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(5px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className={cn("flex flex-wrap overflow-hidden", className)}
      variants={container}
      initial="hidden"
      animate={controls}
      ref={ref}
    >
      {revealText
        ? words.map((word, index) => (
            <motion.span
              key={index}
              variants={child}
              className={cn("mr-[0.25em] mt-[0.25em]", textClassName)}
            >
              {word}
            </motion.span>
          ))
        : children && (
            <motion.div variants={child} className="w-full">
              {Element && (
                <Element className={textClassName}>{children}</Element>
              )}
            </motion.div>
          )}
    </motion.div>
  );
};
