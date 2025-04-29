"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export const TracingBeam = ({
  children,
  className,
  beamColor = "from-[#28E82A]/20 to-transparent",
  beamSize = 200,
}: {
  children: React.ReactNode;
  className?: string;
  beamColor?: string;
  beamSize?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [height, setHeight] = useState(0);

  // Update height on resize
  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        setHeight(ref.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  // Calculate beam Y position based on scroll progress
  const y = useTransform(scrollYProgress, [0, 1], [0, height]);

  return (
    <motion.div ref={ref} className={cn("relative w-full mx-auto", className)}>
      {/* Fixed wrapper for absolute positioning inside scrollable content */}
      <div className="absolute top-0 left-5 md:left-1/2 md:-translate-x-1/2 h-full">
        {/* Vertical line (track) */}
        <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-gradient-to-b from-foreground/20 to-transparent" />

        {/* Glowing beam that moves based on scroll */}
        <motion.div
          style={{ y }}
          className="absolute left-0 w-[1px] h-24 bg-foreground"
        />

        {/* Glowing orb and gradient */}
        <motion.div
          style={{ y }}
          className="absolute -left-[6px] top-0 w-3 h-3 rounded-full bg-[#28E82A]"
        />

        {/* Gradient overlay that follows the beam */}
        <motion.div
          style={{ y }}
          className={`absolute -left-1 top-0 h-${beamSize} w-${
            beamSize / 4
          } bg-gradient-to-b ${beamColor}`}
        />
      </div>

      {/* Actual content */}
      <div className="ml-8 md:ml-0">{children}</div>
    </motion.div>
  );
};
