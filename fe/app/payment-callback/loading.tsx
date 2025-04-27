import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
      <p className="text-xl font-medium">Processing Payment...</p>
      <p className="text-muted-foreground">
        Please wait while we verify your transaction
      </p>
    </div>
  );
}
