import { Loader2 } from "lucide-react";

export default function PaymentLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h3 className="mt-2 text-lg font-semibold">Loading payment data...</h3>
      </div>
    </div>
  );
}
