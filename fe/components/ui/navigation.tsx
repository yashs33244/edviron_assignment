"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Home, FileText } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: <Home className="h-5 w-5" /> },
    {
      name: "Make Payment",
      path: "/payment",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Transaction Status",
      path: "/transaction-status",
      icon: <FileText className="h-5 w-5" />,
    },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 lg:gap-8">
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`flex items-center p-2 rounded-md transition-colors ${
            isActive(item.path)
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          {item.icon}
          <span className="ml-2">{item.name}</span>
        </Link>
      ))}
    </div>
  );
}
