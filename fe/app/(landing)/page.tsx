import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  CreditCard,
  BarChart3,
  Shield,
  TrendingUp,
  LineChart,
  PieChart,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-[#2BE82A]" />
          <span className="font-bold text-xl tracking-tight">
            Edviron Finance
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button className="bg-[#2BE82A] text-black hover:bg-[#2BE82A]/90">
              Login
            </Button>
          </Link>
        </div>
      </header>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 leading-tight">
              Smart Financial{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2BE82A] to-[#98E49B]">
                Management
              </span>{" "}
              for Schools
            </h1>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Simplify fee collection, track transactions, and manage your
              school's finances with our comprehensive solution.
            </p>
            <div className="mt-10">
              <Link href="/login">
                <Button className="h-12 px-8 bg-[#2BE82A] text-black hover:bg-[#2BE82A]/90 text-lg">
                  Get Started <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold">$125.43</h3>
                <div className="bg-zinc-800 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-[#2BE82A]" />
                </div>
              </div>
              <p className="text-zinc-400 mt-2">Average Transaction</p>
              <div className="mt-4 flex items-center text-[#2BE82A]">
                <span>+8.92</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold">567</h3>
                <div className="bg-zinc-800 p-2 rounded-full">
                  <BarChart3 className="h-5 w-5 text-[#2BE82A]" />
                </div>
              </div>
              <p className="text-zinc-400 mt-2">Monthly Transactions</p>
              <div className="mt-4 flex items-center text-[#2BE82A]">
                <span>+5.23%</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold">$816,756</h3>
                <div className="bg-zinc-800 p-2 rounded-full">
                  <LineChart className="h-5 w-5 text-[#2BE82A]" />
                </div>
              </div>
              <p className="text-zinc-400 mt-2">Total Net Worth</p>
              <div className="mt-4 flex items-center text-[#2BE82A]">
                <span>90-Day Target</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-zinc-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Take Control of Your{" "}
              <span className="text-[#2BE82A]">Financial Health</span>
            </h2>
            <p className="text-zinc-400">
              Our platform provides tools to analyze and improve your school's
              financial performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-xl border border-zinc-700">
              <div className="bg-[#2BE82A]/10 p-3 rounded-full inline-flex mb-4">
                <Shield className="h-6 w-6 text-[#2BE82A]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Secure Transactions
              </h3>
              <p className="text-zinc-400">
                End-to-end encryption and industry-standard security protocols
                to protect all financial data.
              </p>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-xl border border-zinc-700">
              <div className="bg-[#2BE82A]/10 p-3 rounded-full inline-flex mb-4">
                <BarChart3 className="h-6 w-6 text-[#2BE82A]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Detailed Analytics</h3>
              <p className="text-zinc-400">
                Track payment trends, view financial reports, and make
                data-driven decisions.
              </p>
            </div>
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 rounded-xl border border-zinc-700">
              <div className="bg-[#2BE82A]/10 p-3 rounded-full inline-flex mb-4">
                <PieChart className="h-6 w-6 text-[#2BE82A]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Financial Planning</h3>
              <p className="text-zinc-400">
                Set targets, create budgets, and monitor your school's financial
                health in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Increase your relative return by{" "}
                <span className="text-[#2BE82A]">3.5%</span>
              </h2>
              <p className="text-zinc-400 mb-8">
                Our platform helps educational institutions optimize their
                payment processes, reduce costs, and increase operational
                efficiency.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                  <p>Age 32 - Early adoption benefits</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#2BE82A]"></div>
                  <p>Age 42 - Peak operational efficiency</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#98E49B]"></div>
                  <p>Age 52 - Long-term growth trajectory</p>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] bg-gradient-to-tr from-zinc-900 to-black rounded-xl border border-zinc-800 p-8">
              <div className="absolute bottom-0 left-0 right-0 h-[200px]">
                <div className="absolute bottom-0 left-0 right-0 h-[50px] bg-gradient-to-r from-[#2BE82A]/20 to-[#2BE82A]/5 z-10 rounded-bl-xl"></div>
                <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-r from-[#2BE82A]/30 to-[#2BE82A]/10 z-20 rounded-bl-xl"></div>
                <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-r from-[#2BE82A]/40 to-[#2BE82A]/20 z-30 rounded-bl-xl"></div>
              </div>
              <div className="absolute top-8 right-8 text-right">
                <div className="text-sm text-zinc-400">$4M</div>
                <div className="text-sm text-zinc-400 mt-6">$3M</div>
                <div className="text-sm text-zinc-400 mt-6">$2M</div>
                <div className="text-sm text-zinc-400 mt-6">$1M</div>
                <div className="text-sm text-zinc-400 mt-6">$0</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-zinc-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your School's Financial Management?
            </h2>
            <p className="text-zinc-400 mb-8">
              Join hundreds of educational institutions already benefiting from
              our platform.
            </p>
            <Link href="/login">
              <Button className="h-12 px-8 bg-[#2BE82A] text-black hover:bg-[#2BE82A]/90 text-lg">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <CreditCard className="h-6 w-6 text-[#2BE82A]" />
              <span className="font-bold text-xl">Edviron Finance</span>
            </div>
            <div className="text-zinc-400 text-sm">
              &copy; {new Date().getFullYear()} Edviron. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
