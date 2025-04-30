"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";

import React, { useEffect, useRef, useState } from "react";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const prevScrollY = useRef(0);

  // Track scroll position to control navbar width
  useMotionValueEvent(scrollY, "change", (latest) => {
    // Detect even the smallest scroll direction change
    const scrollingDown = latest > prevScrollY.current;
    const scrollingUp = latest < prevScrollY.current;

    // Immediate response to scroll direction
    if (scrollingDown) {
      setIsScrolled(true); // 60% width
    } else if (scrollingUp) {
      setIsScrolled(false); // 80% width
    }

    // Save current position for next comparison
    prevScrollY.current = latest;
  });

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-40 w-full flex justify-center mt-3",
        className
      )}
    >
      <motion.div
        className="w-full"
        animate={{
          width: isScrolled ? "60%" : "90%",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 40,
          duration: 0.1,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const NavBody = ({ children, className }: NavBodyProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      style={{
        width: "100%",
        padding: "8px 24px",
        borderRadius: "9999px",
        marginTop: "16px",
      }}
      className={cn(
        "relative z-[60] flex flex-row items-center justify-between self-start rounded-full transition-shadow duration-300",
        isScrolled ? "shadow-lg" : "",
        "mx-auto max-w-7xl backdrop-blur-md bg-[#202020]/80 border border-zinc-800", // glassmorphism effect
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "flex-1 flex flex-row items-center justify-start space-x-2 text-sm font-medium text-zinc-300 ml-6",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={(e) => onItemClick && onItemClick(e, item.link)}
          className="relative px-4 py-2 text-zinc-300 hover:text-white transition-colors"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-zinc-800"
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 100,
              }}
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className }: MobileNavProps) => {
  return (
    <motion.div
      style={{
        width: "100%",
        padding: "12px 16px",
        borderRadius: "9999px",
        marginTop: "16px",
      }}
      className={cn(
        "relative z-50 flex flex-col items-center justify-between py-2 lg:hidden rounded-full backdrop-blur-md bg-[#202020]/80 border border-zinc-800 shadow-md",
        className
      )}
      animate={{
        boxShadow:
          "0 0 24px rgba(20, 20, 20, 0.3), 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(20, 20, 20, 0.1), 0 0 8px rgba(20, 20, 20, 0.2), 0 16px 68px rgba(20, 20, 20, 0.15), 0 1px 0 rgba(255, 255, 255, 0.05) inset",
      }}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.1,
            ease: "easeInOut",
          }}
          className={cn(
            "absolute inset-x-0 mx-auto top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg backdrop-blur-md bg-[#202020]/90 border border-zinc-800 px-4 py-8 shadow-md",
            className
          )}
          style={{
            width: "100%",
            boxShadow:
              "0 0 24px rgba(20, 20, 20, 0.3), 0 1px 1px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(20, 20, 20, 0.1), 0 0 8px rgba(20, 20, 20, 0.2), 0 16px 68px rgba(20, 20, 20, 0.15), 0 1px 0 rgba(255, 255, 255, 0.05) inset",
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return isOpen ? (
    <IconX className="text-white" onClick={onClick} />
  ) : (
    <IconMenu2 className="text-white" onClick={onClick} />
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 font-normal text-white"
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center">
        <img
          src="/just_logo_2.png"
          alt="logo"
          width={45}
          height={45}
          className="object-contain"
        />
      </div>
      <span className="font-bold text-white">Edviron</span>
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?:
    | "primary"
    | "secondary"
    | "dark"
    | "gradient"
    | "book-call"
    | "get-started";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-4 py-2 rounded-md text-sm font-bold relative cursor-pointer inline-block text-center";

  const variantStyles = {
    primary:
      "bg-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] text-[#202020]",
    secondary:
      "bg-transparent shadow-none text-white hover:text-[#2BE82A] transition-colors",
    dark: "bg-gray-900 text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    gradient:
      "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
    "book-call":
      "bg-black text-white rounded-full hover:bg-gray-800 transition-colors",
    "get-started":
      "bg-[#2BE82A] text-black border-2 border-[#2BE82A] hover:bg-[#2BE82A]/90 transition-colors rounded-xl",
  };

  // If this component is used inside Next.js Link (which is common),
  // we should render as a div or span instead of an anchor
  // to avoid nesting <a> tags which causes hydration errors
  const isInsideLink = !href && props.onClick;
  const FinalTag = isInsideLink ? "span" : Tag;

  return (
    <FinalTag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </FinalTag>
  );
};
