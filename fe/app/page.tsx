"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  CheckCircle,
  ChevronRight,
  ArrowRight,
  BarChart3,
  PieChart,
  CreditCard,
  Shield,
  Download,
  BadgeCheck,
  Wallet,
  School,
  UserCircle,
  Bell,
} from "lucide-react";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/Navbar";

import { StatCard, CircularProgress } from "@/components/ui/StatCard";
import { GraphCard } from "@/components/ui/GraphCard";
import { FeatureCard } from "@/components/ui/FeatureCard";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Smooth scroll function
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    e.preventDefault();

    // Extract the ID from the path
    const id = sectionId.replace("/", "");
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setIsMobileMenuOpen(false);
    }
  };

  // Animated counter component
  const NumberCounter = ({
    value,
    suffix = "",
    prefix = "",
  }: {
    value: number;
    suffix?: string;
    prefix?: string;
  }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const duration = 2000;
      const frameDuration = 1000 / 60;
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;

      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = Math.floor(value * progress);

        setCount(currentCount);

        if (frame === totalFrames) {
          clearInterval(counter);
        }
      }, frameDuration);

      return () => clearInterval(counter);
    }, [value]);

    return (
      <span className="text-4xl font-bold text-white">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </span>
    );
  };

  // Navigation items
  const navItems = [
    { name: "Features", link: "/features" },
    { name: "Analytics", link: "/analytics" },
    { name: "Stats", link: "/stats" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <div className="min-h-screen font-sans bg-black text-white">
      {/* Navbar Integration */}
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems
            items={navItems}
            className="hidden md:flex"
            onItemClick={scrollToSection}
          />
          <div className="hidden md:flex items-center space-x-4">
            <NavbarButton href="/login" variant="secondary">
              Login
            </NavbarButton>
            <NavbarButton
              href="/register"
              variant="get-started"
              className="px-5 py-2.5"
            >
              Get Started
            </NavbarButton>
          </div>
          <div className="md:hidden">
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </NavBody>
        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          className="md:hidden"
        >
          <div className="flex flex-col space-y-4 w-full">
            {navItems.map((item, i) => (
              <a
                key={i}
                href={item.link}
                className="px-4 py-2 text-white hover:text-[#2BE82A] transition-colors"
                onClick={(e) => scrollToSection(e, item.link)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 flex flex-col space-y-2">
              <NavbarButton
                href="/login"
                variant="secondary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                href="/register"
                variant="get-started"
                className="w-full px-5 py-2.5"
              >
                Get Started
              </NavbarButton>
            </div>
          </div>
        </MobileNavMenu>
      </Navbar>

      {/* Hero Section */}
      <section className="pt-40 pb-20 md:pt-48">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-sm">
                <span className="mr-1 rounded-full bg-[#2BE82A] px-1.5 py-0.5 text-xs font-medium text-black">
                  New
                </span>
                <span className="text-zinc-400">
                  UPI Payments Now Available!
                </span>
                <Link
                  href="/features/upi"
                  className="ml-2 text-[#2BE82A] hover:underline"
                >
                  Learn more →
                </Link>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Simplify School Fee Collections and Financial Management
              </h1>

              <p className="text-lg text-zinc-400">
                A comprehensive school fee management system that empowers
                schools to collect, track, and manage payments efficiently with
                advanced analytics and automation.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="px-6 py-3 bg-[#2BE82A] text-black rounded-2xl border-2 border-[#2BE82A] hover:bg-[#2BE82A]/90 transition-all"
                >
                  Get Started
                </Link>
                <Link
                  href="/demo"
                  className="group px-6 py-3 border border-zinc-800 rounded-2xl hover:border-[#2BE82A] transition-colors"
                >
                  Book a Demo
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#2BE82A]" />
                  <span className="text-zinc-400">No setup fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#2BE82A]" />
                  <span className="text-zinc-400">24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[#2BE82A]" />
                  <span className="text-zinc-400">Cancel anytime</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-2 shadow-xl">
                <div className="rounded-2xl w-full h-96 overflow-hidden bg-zinc-800 flex items-center justify-center">
                  <StatCard
                    title="Net Worth"
                    value="$816,756.000"
                    subtext="90-Day"
                    isGreen={true}
                    icon={<Wallet className="h-6 w-6 text-black" />}
                    className="w-10/12 -mt-24"
                  />
                  <StatCard
                    title="Investments"
                    value="$179,918.000"
                    subtext="Target: $200,500,000"
                    icon={<BarChart3 className="h-6 w-6 text-[#2BE82A]" />}
                    className="w-10/12 absolute -mb-40"
                  />
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-8 -left-8 h-16 w-16 rounded-full bg-[#2BE82A]/30 blur-xl" />
                <div className="absolute -bottom-8 -right-8 h-16 w-16 rounded-full bg-[#2BE82A]/30 blur-xl" />
              </div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute -top-4 -right-4 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 p-2 shadow-lg"
              >
                <div className="rounded-full bg-[#2BE82A] p-1">
                  <BadgeCheck className="h-4 w-4 text-black" />
                </div>
                <span className="pr-2 text-xs font-medium text-zinc-300">
                  Trusted by 500+ schools
                </span>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 p-2 shadow-lg"
              >
                <div className="rounded-full bg-[#2BE82A] p-1">
                  <Download className="h-4 w-4 text-black" />
                </div>
                <span className="pr-2 text-xs font-medium text-zinc-300">
                  99.9% uptime
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-zinc-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <NumberCounter value={500} suffix="+" />
              <span className="text-zinc-400">Schools</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex flex-col items-center text-center"
            >
              <NumberCounter value={200000} suffix="+" />
              <span className="text-zinc-400">Students</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <NumberCounter value={95} suffix="%" />
              <span className="text-zinc-400">Collection Rate</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex flex-col items-center text-center"
            >
              <NumberCounter value={100} prefix="₹" suffix="Cr+" />
              <span className="text-zinc-400">Processed</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Analytics Showcase Section */}
      <section id="analytics" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Powerful Analytics Dashboard
            </h2>
            <p className="text-zinc-400 max-w-3xl mx-auto">
              Make data-driven decisions with our intuitive analytics tools that
              provide comprehensive insights into your school's financial
              performance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-6">
                <StatCard
                  title="Real-time Collection Analytics"
                  description="Track fee collections in real-time with detailed breakdowns by class, section, payment mode, and time period. Identify trends and optimize your collection strategy."
                  icon={<BarChart3 className="h-6 w-6 text-[#2BE82A]" />}
                />

                <StatCard
                  title="Defaulter Management"
                  description="Easily identify and manage defaulters with automated reminders and follow-ups. Improve your collection rate with targeted communication strategies."
                  icon={<PieChart className="h-6 w-6 text-[#2BE82A]" />}
                  delay={0.1}
                />

                <StatCard
                  title="Payment Channel Insights"
                  description="Understand which payment methods are most popular among parents. Optimize your payment options to increase collection efficiency and parent satisfaction."
                  icon={<CreditCard className="h-6 w-6 text-[#2BE82A]" />}
                  delay={0.2}
                />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="order-1 md:order-2"
            >
              <div className="bg-zinc-900 p-4 rounded-2xl shadow-xl border border-zinc-800">
                <div className="rounded-xl overflow-hidden">
                  <GraphCard
                    title="Increase your relative return by"
                    subtitle="Optimize your investment strategy"
                    value="3.5%"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-zinc-900/40">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Features Designed for Schools
            </h2>
            <p className="text-zinc-400 max-w-3xl mx-auto">
              Streamline your school's fee collection process with our
              comprehensive suite of tools designed to save time and reduce
              administrative burden.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Multi-channel Payments"
              description="Accept payments via UPI, cards, net banking, and offline methods. Give parents the flexibility they need."
              icon={<CreditCard className="h-6 w-6 text-[#2BE82A]" />}
              delay={0.1}
            />

            <FeatureCard
              title="Advanced Analytics"
              description="Gain insights into collection patterns, defaulters, and financial health with our comprehensive dashboards."
              icon={<BarChart3 className="h-6 w-6 text-[#2BE82A]" />}
              delay={0.2}
            />

            <FeatureCard
              title="Fee Structure Management"
              description="Create and manage complex fee structures with multiple components, discounts, and scholarships."
              icon={<School className="h-6 w-6 text-[#2BE82A]" />}
              delay={0.3}
            />

            <FeatureCard
              title="Parent Portal"
              description="Provide parents with a dedicated portal to view fee details, payment history, and make payments online."
              icon={<UserCircle className="h-6 w-6 text-[#2BE82A]" />}
              delay={0.4}
            />

            <FeatureCard
              title="Automated Reminders"
              description="Send automated payment reminders via SMS, email, and WhatsApp to increase collection rates."
              icon={<Bell className="h-6 w-6 text-[#2BE82A]" />}
              delay={0.5}
            />

            <FeatureCard
              title="Instant Reconciliation"
              description="Automatically reconcile payments with student records and generate digital receipts instantly."
              icon={<BadgeCheck className="h-6 w-6 text-[#2BE82A]" />}
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="contact" className="py-20 bg-[#2BE82A]">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              Ready to Streamline Your School Fee Management?
            </h2>
            <p className="text-xl text-black/70 max-w-3xl mx-auto mb-8">
              Join 500+ schools that have already simplified their fee
              collection process and improved their financial management.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-3 bg-black text-white font-bold rounded-2xl hover:bg-zinc-900 transition-colors"
              >
                Get Started Now
              </Link>
              <Link
                href="/demo"
                className="px-8 py-3 border-2 border-black text-black rounded-2xl hover:bg-[#2BE82A]/80 transition-colors"
              >
                Schedule a Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center mb-4">
                <CreditCard className="h-6 w-6 text-[#2BE82A] mr-2" />
                <span className="text-xl font-bold">PayGate</span>
              </div>
              <p className="text-zinc-400 mb-4">
                Simplifying school fee management for educational institutions
                across India.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-zinc-400 hover:text-[#2BE82A] transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-zinc-400 hover:text-[#2BE82A] transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-zinc-400 hover:text-[#2BE82A] transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/press"
                    className="text-zinc-400 hover:text-[#2BE82A] transition-colors"
                  >
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/help"
                    className="text-zinc-400 hover:text-[#2BE82A] transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="text-zinc-400 hover:text-[#2BE82A] transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api"
                    className="text-zinc-400 hover:text-[#2BE82A] transition-colors"
                  >
                    API Docs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/webinars"
                    className="text-zinc-400 hover:text-[#2BE82A] transition-colors"
                  >
                    Webinars
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-zinc-400 hover:text-[#2BE82A] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-zinc-400 hover:text-[#2BE82A] transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="text-zinc-400 hover:text-[#2BE82A] transition-colors"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compliance"
                    className="text-zinc-400 hover:text-[#2BE82A] transition-colors"
                  >
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-zinc-400 text-sm">
                © {new Date().getFullYear()} PayGate. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0">
                <p className="text-zinc-400 text-sm">Made with ❤️ in India</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
