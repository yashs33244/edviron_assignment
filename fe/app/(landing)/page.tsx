import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CreditCard, ArrowRight, Shield, Zap, BarChart3 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-muted">
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Payment Gateway</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-primary">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
            How It Works
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-primary">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="outline">Log In</Button>
          </Link>
          <Link href="/register" className="hidden md:block">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Introducing
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Secure Payment Gateway for Schools
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Simplify fee collection, track payments, and manage transactions with our comprehensive payment
                  solution.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="h-12">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="h-12">
                      Log In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] aspect-video rounded-xl bg-muted p-4 lg:p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl"></div>
                <div className="relative z-10 h-full flex flex-col justify-center items-center">
                  <CreditCard className="h-16 w-16 text-primary mb-4" />
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
                    <p className="text-muted-foreground">Process transactions with confidence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything you need to manage payments
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Our platform provides a comprehensive solution for schools to manage fee collection and track
                  payments.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="rounded-xl border border-muted bg-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure Transactions</h3>
                <p className="text-muted-foreground">
                  End-to-end encryption and compliance with industry standards to keep payment data safe.
                </p>
              </div>
              <div className="rounded-xl border border-muted bg-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Fast Processing</h3>
                <p className="text-muted-foreground">
                  Quick payment processing with real-time status updates and instant notifications.
                </p>
              </div>
              <div className="rounded-xl border border-muted bg-card p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Detailed Analytics</h3>
                <p className="text-muted-foreground">
                  Comprehensive reporting and analytics to track payment trends and manage finances.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Simple and efficient payment process
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Our platform makes it easy to collect and manage payments with a streamlined process.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-xl font-bold">Create Payment</h3>
                  <p className="text-muted-foreground">Generate a payment request with student details and amount.</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-xl font-bold">Process Payment</h3>
                  <p className="text-muted-foreground">
                    Students or parents complete the payment through our secure gateway.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-xl font-bold">Track & Manage</h3>
                  <p className="text-muted-foreground">
                    Monitor transactions and generate reports through the dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Pricing
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Simple, transparent pricing</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Choose the plan that works best for your school.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2">
              <div className="rounded-xl border border-muted bg-card p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Standard</h3>
                  <p className="text-muted-foreground">For small to medium schools</p>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">₹999</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    <span>Up to 500 transactions per month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    <span>Basic reporting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Button className="w-full">Get Started</Button>
              </div>
              <div className="rounded-xl border border-primary bg-card p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">Premium</h3>
                  <p className="text-muted-foreground">For large schools and institutions</p>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold">₹2499</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    <span>Unlimited transactions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckIcon className="mr-2 h-4 w-4 text-primary" />
                    <span>Custom integrations</span>
                  </li>
                </ul>
                <Button className="w-full">Get Started</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to simplify your payment process?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Join thousands of schools already using our platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="h-12">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="h-12">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t border-muted py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <span className="font-semibold">Payment Gateway</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Payment Gateway. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
