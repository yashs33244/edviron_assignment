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
} from "lucide-react";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen font-gilroy bg-black">
      {/* Header/Navigation */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center">
          <CreditCard className="h-10 w-10 text-primary mr-2" />
          <span className="text-white font-bold text-2xl">PayGate</span>
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
      <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center">
        <motion.div
          className="md:w-1/2 mb-10 md:mb-0 md:pr-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Increase your relative return by{" "}
            <span className="text-primary">3.5%</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Track your financial journey with our advanced dashboard. Get
            real-time insights into your investments, savings, and cash flow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="primary-button inline-flex items-center justify-center"
            >
              Get Started
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#dashboard"
              className="secondary-button inline-flex items-center justify-center"
            >
              View Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="md:w-1/2 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative h-[400px] md:h-[500px] w-full animate-float">
            <div className="absolute top-0 right-0 bg-dashboard-black rounded-3xl p-6 w-[300px] md:w-[350px] shadow-xl">
              <h3 className="text-white text-xl font-bold mb-4">Net Worth</h3>
              <p className="text-4xl font-extrabold text-white mb-2 animate-count-up">
                $816,756,000
              </p>
              <p className="text-primary flex items-center text-lg">
                <TrendingUp className="mr-2 h-5 w-5" />
                +4,299
              </p>
            </div>
            <div className="absolute bottom-0 left-0 bg-dashboard-black rounded-3xl p-6 w-[300px] md:w-[350px] shadow-xl">
              <h3 className="text-white text-xl font-bold mb-4">Investments</h3>
              <p className="text-4xl font-extrabold text-white mb-2 animate-count-up">
                $179,918,000
              </p>
              <p className="text-xs text-gray-400">Target: $200,500,000</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-black py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Track, manage and optimize your finances with our comprehensive
              tools
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section
        id="dashboard"
        className="py-20 bg-gradient-to-b from-black to-[#111]"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Interactive Dashboard
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get a 360° view of your financial health with our beautiful and
              intuitive dashboard
            </p>
          </div>
          <motion.div
            className="bg-dashboard-black rounded-3xl p-6 md:p-8 shadow-2xl mx-auto max-w-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <div className="bg-dashboard-black rounded-3xl p-4 border border-gray-800 mb-6">
                  <h3 className="text-white text-lg font-bold mb-2">
                    Increase your relative return by
                  </h3>
                  <div className="text-5xl font-extrabold text-white mb-4">
                    3.5%
                  </div>
                  <div className="h-[150px] bg-dashboard-black relative overflow-hidden rounded-xl">
                    {/* Chart visualization */}
                    <div className="absolute bottom-0 left-0 right-0 h-3/4">
                      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-primary opacity-80 rounded-bl-xl"></div>
                      <div className="absolute bottom-0 left-0 w-3/4 h-2/4 bg-primary/60 rounded-bl-xl"></div>
                      <div className="absolute bottom-0 left-0 w-1/2 h-3/4 bg-primary/40 rounded-bl-xl"></div>
                      <div className="absolute bottom-0 left-0 w-1/4 h-full bg-primary/20 rounded-bl-xl"></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary rounded-3xl p-4">
                    <div className="text-2xl font-bold text-black mb-1">
                      $125.43
                    </div>
                    <div className="text-black/80 flex items-center text-sm">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      +$8.92
                    </div>
                    <div className="text-black/70 text-sm mt-2">
                      Share's price rising
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl p-4">
                    <div className="text-2xl font-bold text-black mb-1">
                      567
                    </div>
                    <div className="text-primary flex items-center text-sm">
                      <TrendingUp className="mr-1 h-4 w-4" />
                      +5.237%
                    </div>
                    <div className="text-black/70 text-sm mt-2">
                      Points changes
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 space-y-4">
                <div className="bg-dashboard-dark rounded-3xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/20 p-2 rounded-full mr-3">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-white font-bold text-lg">
                      Savings Analytics
                    </h3>
                  </div>
                  <div className="bg-primary rounded-3xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-black/80">Cash</div>
                        <div className="text-3xl font-extrabold text-black">
                          816,754
                        </div>
                      </div>
                      <div className="text-sm font-medium bg-black/10 px-2 py-1 rounded-full text-black">
                        USD
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-3xl font-bold text-black">+38%</div>
                      <div className="text-sm text-black/80">
                        grow since last day
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div className="h-8 w-8 bg-black/10 rounded-full"></div>
                      <div className="h-10 w-10 bg-black/10 rounded-full"></div>
                      <div className="h-12 w-12 bg-black/10 rounded-full"></div>
                      <div className="h-14 w-14 bg-black/10 rounded-full"></div>
                      <div className="h-16 w-16 bg-black/20 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100/10 backdrop-blur-sm rounded-3xl p-4">
                    <div className="text-sm text-white/60 mb-1">Business</div>
                    <div className="text-2xl font-bold text-white">520,470</div>
                    <div className="text-xl font-bold text-primary mt-2">
                      +17%
                    </div>
                  </div>
                  <div className="bg-gray-100/10 backdrop-blur-sm rounded-3xl p-4">
                    <div className="text-sm text-white/60 mb-1">Credit</div>
                    <div className="text-2xl font-bold text-white">520,345</div>
                    <div className="text-xl font-bold text-primary mt-2">
                      +15%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#111]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Hear from our satisfied users who have transformed their financial
              lives
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <span className="text-primary font-bold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-400 text-sm">{testimonial.title}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "text-primary"
                          : "text-gray-600"
                      }`}
                      fill={i < testimonial.rating ? "#2BE82A" : "none"}
                    />
                  ))}
                </div>
                <p className="text-gray-300">{testimonial.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="py-20 bg-gradient-to-b from-[#111] to-black"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className={`rounded-3xl p-6 ${
                  plan.popular
                    ? "border-2 border-primary relative"
                    : "border border-gray-800"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-extrabold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-full font-medium ${
                    plan.popular
                      ? "bg-primary text-black"
                      : "bg-white text-black"
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            Ready to transform your finances?
          </h2>
          <p className="text-black/80 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of users who are already managing their finances
            better with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-black text-white font-medium rounded-full px-8 py-3 inline-flex items-center justify-center"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="bg-transparent border-2 border-black text-black font-medium rounded-full px-8 py-3"
            >
              Learn More
            </Link>
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
