"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HoverBorderGradient } from "./hover-border-gradient";
import { motion } from "framer-motion";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <div className="w-full px-4 md:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" aria-label="Home">
            <Image
              src="/logo.png"
              alt="Edviron Logo"
              width={140}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname === "/" && item.href === "/") ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-foreground/80",
                  isActive ? "text-foreground" : "text-foreground/60"
                )}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-[#9BE49B] to-[#2BE82A]"
                    layoutId="navbar-indicator"
                  />
                )}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden md:inline-flex text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            Sign in
          </Link>
          <HoverBorderGradient
            className="ml-4 border border-transparent bg-[#202020] text-white hover:bg-[#202020]/90"
            gradientClassName="from-[#9BE49B] to-[#2BE82A]"
            style={
              {
                "--gradient-color": "rgba(43, 232, 42, 0.8)",
              } as React.CSSProperties
            }
          >
            <Link href="/signup" className="px-3 py-1.5">
              Get Started
            </Link>
          </HoverBorderGradient>
          <button
            type="button"
            className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-foreground/60 hover:text-foreground"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
