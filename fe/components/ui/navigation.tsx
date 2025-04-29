"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="h-5 w-5" />,
      requiresAuth: false,
    },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleClick = (path: string, requiresAuth: boolean) => {
    if (requiresAuth && !isAuthenticated) {
      router.push("/login");
      return;
    }
    router.push(path);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 lg:gap-8">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => handleClick(item.path, item.requiresAuth)}
          className={`flex items-center p-2 rounded-md transition-colors ${
            isActive(item.path)
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          {item.icon}
          <span className="ml-2">{item.name}</span>
        </button>
      ))}

      {!isAuthenticated ? (
        <Link
          href="/login"
          className="flex items-center p-2 rounded-md transition-colors hover:bg-muted"
        >
          <LogIn className="h-5 w-5" />
          <span className="ml-2">Login</span>
        </Link>
      ) : (
        <Link
          href="/dashboard"
          className="flex items-center p-2 rounded-md transition-colors hover:bg-muted"
        >
          <span className="ml-2">Dashboard</span>
        </Link>
      )}
    </div>
  );
}
