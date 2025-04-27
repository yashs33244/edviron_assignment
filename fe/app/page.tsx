import Link from "next/link";
import { CreditCard, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
          Edviron Payment System
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          A secure and reliable payment system designed specifically for
          educational institutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-8">
        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <CreditCard className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Make Payments</h2>
          <p className="text-center text-muted-foreground mb-4">
            Quick and secure payments for school fees and other services.
          </p>
          <Button asChild className="mt-auto">
            <Link href="/payment">Make a Payment</Link>
          </Button>
        </div>

        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Check Status</h2>
          <p className="text-center text-muted-foreground mb-4">
            Check the status of your transactions and payment history.
          </p>
          <Button asChild className="mt-auto" variant="outline">
            <Link href="/transaction-status">Transaction Status</Link>
          </Button>
        </div>

        <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-sm">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Secure & Reliable</h2>
          <p className="text-center text-muted-foreground mb-4">
            End-to-end encrypted payments with detailed payment receipts.
          </p>
          <Button asChild className="mt-auto" variant="secondary">
            <Link href="#">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
