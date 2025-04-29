import Link from "next/link";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6">
      <div className="max-w-md text-center">
        <div className="bg-gradient-to-br from-primary/30 to-primary/10 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
          <CreditCard className="h-10 w-10 text-primary" />
        </div>

        <h1 className="text-7xl font-bold text-white mb-6">404</h1>

        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>

        <p className="text-gray-400 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="space-y-4">
          <Link href="/">
            <Button className="bg-primary text-black hover:bg-primary/90 w-full">
              Back to Home
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button
              variant="outline"
              className="w-full border-2 border-gray-800 hover:bg-muted"
            >
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-12 inline-flex items-center text-sm text-gray-500">
          <CreditCard className="h-4 w-4 mr-2 text-primary" />
          <span>Edviron Finance</span>
        </div>
      </div>
    </div>
  );
}
