"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface NumberTickerProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimalPlaces?: number;
  speed?: number;
}

export const NumberTicker = ({
  value,
  className,
  prefix = "",
  suffix = "",
  decimalPlaces = 0,
  speed = 500,
}: NumberTickerProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const previousValueRef = useRef(0);
  const formattedValue = displayValue.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  // Convert the number to an array of digits for animation
  const digits = formattedValue.split("");

  useEffect(() => {
    const previousValue = previousValueRef.current;

    // Skip animation if it's the initial render
    if (previousValue === 0 && value !== 0) {
      setDisplayValue(value);
      previousValueRef.current = value;
      return;
    }

    const duration = speed;
    const startTime = Date.now();
    const endTime = startTime + duration;

    const animateValue = () => {
      const now = Date.now();
      const elapsedTime = now - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue =
        previousValue + (value - previousValue) * easeOutQuart;

      setDisplayValue(currentValue);

      if (now < endTime) {
        requestAnimationFrame(animateValue);
      } else {
        setDisplayValue(value);
        previousValueRef.current = value;
      }
    };

    requestAnimationFrame(animateValue);

    return () => {
      previousValueRef.current = value;
    };
  }, [value, speed]);

  return (
    <div className={cn("flex items-baseline text-4xl font-bold", className)}>
      {prefix && <span>{prefix}</span>}
      <div className="flex">
        <AnimatePresence mode="popLayout">
          {digits.map((digit, index) => (
            <motion.div
              key={`${index}-${digit}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-auto h-auto flex items-center justify-center"
            >
              {/* If the digit is a comma, decimal point, or other non-numeric character */}
              {isNaN(parseInt(digit)) ? (
                <span className="px-[1px]">{digit}</span>
              ) : (
                <span className="px-[1px]">{digit}</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {suffix && <span className="ml-1">{suffix}</span>}
    </div>
  );
};
