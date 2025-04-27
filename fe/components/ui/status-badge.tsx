import { cn } from "@/lib/utils";
import { CheckCircle, Clock, AlertCircle, HelpCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({
  status,
  className,
  showIcon = true,
}: StatusBadgeProps) {
  const statusLower = status?.toLowerCase() || "unknown";

  const getStatusColor = () => {
    if (statusLower === "success")
      return "bg-primary/20 text-primary border-primary/50";
    if (
      statusLower === "pending" ||
      statusLower === "processing" ||
      statusLower === "not initiated"
    )
      return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
    if (
      statusLower === "failed" ||
      statusLower === "failure" ||
      statusLower === "error"
    )
      return "bg-destructive/20 text-destructive border-destructive/50";
    return "bg-muted text-muted-foreground border-muted";
  };

  const getStatusIcon = () => {
    if (statusLower === "success")
      return <CheckCircle className="h-3 w-3 mr-1" />;
    if (
      statusLower === "pending" ||
      statusLower === "processing" ||
      statusLower === "not initiated"
    )
      return <Clock className="h-3 w-3 mr-1" />;
    if (
      statusLower === "failed" ||
      statusLower === "failure" ||
      statusLower === "error"
    )
      return <AlertCircle className="h-3 w-3 mr-1" />;
    return <HelpCircle className="h-3 w-3 mr-1" />;
  };

  // Format status for display
  const formatStatus = (status: string) => {
    // Handle special cases
    if (statusLower === "not initiated") return "Processing";

    // Capitalize each word
    return status
      .split(/[\s_-]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        getStatusColor(),
        className
      )}
    >
      {showIcon && getStatusIcon()}
      {formatStatus(status)}
    </span>
  );
}
