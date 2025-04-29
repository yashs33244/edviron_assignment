"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CheckCircle,
  ChevronRight,
  ArrowRight,
  Star,
  BarChart3,
  PieChart,
  CreditCard,
  TrendingUp,
  Shield,
  Download,
  BadgeCheck,
  Wallet,
  School,
  UserCircle,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { TextReveal } from "@/components/magicui/text-reveal";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { TracingBeam } from "@/components/magicui/tracing-beam";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen font-gilroy bg-black">
      {/* Header/Navigation */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center">
          <img
            src="/just_logo_2.png"
            alt="Edviron Logo"
            className="h-10 w-10 mr-2"
          />
          <span className="text-white font-bold text-2xl">Edviron</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#features"
            className="text-white hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#dashboard"
            className="text-white hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="#pricing"
            className="text-white hover:text-primary transition-colors"
          >
            Pricing
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="tertiary-button px-4 py-2">
            Login
          </Link>
          <Link href="/register" className="primary-button px-4 py-2">
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pb-20 pt-32 md:pt-40">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col items-start gap-8">
              <div className="inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-sm backdrop-blur-sm">
                <span className="mr-1 rounded-full bg-[#28E82A] px-1.5 py-0.5 text-xs font-medium text-[#202020]">
                  New
                </span>
                <span className="text-foreground/80">
                  UPI Payments Now Available!
                </span>
                <Link
                  href="/features/upi"
                  className="ml-2 text-[#28E82A] hover:underline"
                >
                  Learn more →
                </Link>
              </div>

              <TextReveal
                text="Simplify School Fee Collections and Financial Management"
                className="max-w-xl"
                textClassName="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
              />

              <p className="max-w-xl text-lg text-foreground/70">
                A comprehensive school fee management system that empowers
                schools to collect, track, and manage payments efficiently with
                advanced analytics and automation.
              </p>

              <div className="flex flex-wrap gap-4">
                <HoverBorderGradient
                  className="border-transparent bg-[#202020] text-white"
                  gradientClassName="from-[#2BE82A] to-[#9BE49B]"
                >
                  <Link href="/signup" className="px-6 py-3">
                    Get Started
                  </Link>
                </HoverBorderGradient>
                <ButtonLink
                  href="/demo"
                  variant="outline"
                  className="group relative"
                >
                  <span>Book a Demo</span>
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </ButtonLink>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#28E82A]" />
                  <span className="text-sm text-foreground/70">
                    No setup fees
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#28E82A]" />
                  <span className="text-sm text-foreground/70">
                    24/7 Customer Support
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#28E82A]" />
                  <span className="text-sm text-foreground/70">
                    Cancel anytime
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-xl border border-border bg-background/50 p-1 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
                <Image
                  src="/dashboard.png"
                  alt="Edviron Dashboard"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover"
                />

                <div className="absolute -top-8 -left-8 h-16 w-16 rounded-full bg-[#28E82A]/30 blur-xl" />
                <div className="absolute -bottom-8 -right-8 h-16 w-16 rounded-full bg-[#28E82A]/30 blur-xl" />
              </div>

              <div className="absolute -top-4 -right-4 flex items-center gap-2 rounded-full border border-border bg-background p-2 shadow-lg">
                <div className="rounded-full bg-[#28E82A] p-1">
                  <BadgeCheck className="h-4 w-4 text-[#202020]" />
                </div>
                <span className="pr-2 text-xs font-medium">
                  Trusted by 500+ schools
                </span>
              </div>

              <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-full border border-border bg-background p-2 shadow-lg">
                <div className="rounded-full bg-[#28E82A] p-1">
                  <Download className="h-4 w-4 text-[#202020]" />
                </div>
                <span className="pr-2 text-xs font-medium">99.9% uptime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <NumberTicker
                value={500}
                suffix="+"
                className="text-4xl font-bold"
              />
              <span className="text-sm text-foreground/70">Schools</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <NumberTicker
                value={200000}
                suffix="+"
                className="text-4xl font-bold"
              />
              <span className="text-sm text-foreground/70">Students</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <NumberTicker
                value={95}
                suffix="%"
                className="text-4xl font-bold"
              />
              <span className="text-sm text-foreground/70">
                Collection Rate
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <NumberTicker
                value={100}
                prefix="₹"
                suffix="Cr+"
                className="text-4xl font-bold"
              />
              <span className="text-sm text-foreground/70">Processed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Features Designed for Schools
            </h2>
            <p className="mx-auto max-w-3xl text-foreground/70">
              Streamline your school's fee collection process with our
              comprehensive suite of tools designed to save time and reduce
              administrative burden.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Multi-channel Payments</h3>
              <p className="text-foreground/70">
                Accept payments via UPI, cards, net banking, and offline
                methods. Give parents the flexibility they need.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Advanced Analytics</h3>
              <p className="text-foreground/70">
                Gain insights into collection patterns, defaulters, and
                financial health with our comprehensive dashboards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <School className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">
                Fee Structure Management
              </h3>
              <p className="text-foreground/70">
                Create and manage complex fee structures with multiple
                components, discounts, and scholarships.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Parent Portal</h3>
              <p className="text-foreground/70">
                Provide parents with a dedicated portal to view fee details,
                payment history, and make payments online.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Automated Reminders</h3>
              <p className="text-foreground/70">
                Send automated payment reminders via SMS, email, and WhatsApp to
                increase collection rates.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Instant Reconciliation</h3>
              <p className="text-foreground/70">
                Automatically reconcile payments with student records and
                generate digital receipts instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              How Edviron Works
            </h2>
            <p className="mx-auto max-w-3xl text-foreground/70">
              A simple yet powerful workflow designed to simplify school fee
              management
            </p>
          </div>

          <TracingBeam className="py-8">
            <div className="ml-2 md:ml-8 space-y-16">
              <div className="relative pb-8">
                <h3 className="text-xl font-bold mb-4">1. Setup Your School</h3>
                <p className="max-w-xl">
                  Configure your school's fee structure, academic year, student
                  data, and payment preferences through our intuitive dashboard.
                </p>
              </div>

              <div className="relative pb-8">
                <h3 className="text-xl font-bold mb-4">
                  2. Parents Receive Notifications
                </h3>
                <p className="max-w-xl">
                  Parents get automated fee reminders via SMS, email, or
                  WhatsApp with secure payment links for online payments.
                </p>
              </div>

              <div className="relative pb-8">
                <h3 className="text-xl font-bold mb-4">
                  3. Multiple Payment Options
                </h3>
                <p className="max-w-xl">
                  Parents can pay using UPI, cards, net banking, or offline
                  methods at their convenience.
                </p>
              </div>

              <div className="relative pb-8">
                <h3 className="text-xl font-bold mb-4">
                  4. Instant Reconciliation
                </h3>
                <p className="max-w-xl">
                  Payments are automatically reconciled in real-time, and
                  digital receipts are sent to parents instantly.
                </p>
              </div>

              <div className="relative">
                <h3 className="text-xl font-bold mb-4">
                  5. Comprehensive Reports
                </h3>
                <p className="max-w-xl">
                  Access detailed reports and analytics to track collection
                  progress, identify defaulters, and make informed financial
                  decisions.
                </p>
              </div>
            </div>
          </TracingBeam>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#202020] py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Ready to modernize your fee collection?
              </h2>
              <p className="max-w-2xl text-white/70">
                Join 500+ schools already using Edviron to streamline their fee
                management process.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <HoverBorderGradient
                className="border-transparent bg-white text-[#202020]"
                gradientClassName="from-[#2BE82A] to-[#9BE49B]"
              >
                <Link href="/signup" className="px-6 py-3">
                  Get Started
                </Link>
              </HoverBorderGradient>
              <ButtonLink
                href="/demo"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Book a Demo
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-6 md:mb-0">
              <CreditCard className="h-8 w-8 text-primary mr-2" />
              <span className="text-white font-bold text-xl">PayGate</span>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>© 2023 PayGate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Data
const features = [
  {
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    title: "Financial Analytics",
    description:
      "Get detailed insights into your spending patterns, income sources, and investment performance.",
  },
  {
    icon: <PieChart className="h-6 w-6 text-primary" />,
    title: "Portfolio Management",
    description:
      "Track all your investments in one place with real-time updates and performance metrics.",
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-primary" />,
    title: "Growth Projections",
    description:
      "Visualize your financial future with our advanced projection tools and simulations.",
  },
  {
    icon: <CreditCard className="h-6 w-6 text-primary" />,
    title: "Payment Processing",
    description:
      "Securely process payments with our integrated gateway supporting multiple payment methods.",
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: "Secure Transactions",
    description:
      "End-to-end encryption ensures your financial data and transactions are always protected.",
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: "Goal Tracking",
    description:
      "Set financial goals and track your progress with customizable milestones and alerts.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    title: "Small Business Owner",
    rating: 5,
    text: "This platform completely transformed how I manage my business finances. The dashboard is intuitive and the analytics are incredibly insightful.",
  },
  {
    name: "Michael Chen",
    title: "Investment Advisor",
    rating: 5,
    text: "I've recommended this tool to all my clients. The portfolio tracking features and relative return calculations are unmatched in the industry.",
  },
  {
    name: "Emma Rodriguez",
    title: "Freelance Designer",
    rating: 4,
    text: "As someone who struggles with financial planning, this platform has made managing my irregular income streams so much easier.",
  },
];

const plans = [
  {
    name: "Basic",
    price: 0,
    description: "Essential features for personal finance",
    popular: false,
    features: [
      "Dashboard access",
      "Basic financial analytics",
      "Up to 5 payment processors",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: 29,
    description: "Advanced tools for serious investors",
    popular: true,
    features: [
      "Everything in Basic",
      "Advanced analytics",
      "Unlimited payment processing",
      "Investment projections",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: 99,
    description: "Complete solution for businesses",
    popular: false,
    features: [
      "Everything in Pro",
      "Custom reporting",
      "API access",
      "Multiple user accounts",
      "Dedicated account manager",
    ],
  },
];
