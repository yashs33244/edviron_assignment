import { Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        {/* Financial Roadmap Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-1 w-full mb-2" />
        </div>

        {/* Tab Navigation Skeleton */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* Main Content Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>

        {/* Analytics Section Skeleton */}
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-48 rounded-3xl md:col-span-2" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>

        {/* Additional Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
        </div>

        {/* Chart Section Skeleton */}
        <Skeleton className="h-96 rounded-3xl mb-8" />

        {/* Loading Indicator */}
        <div className="flex justify-center items-center my-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading dashboard data...</span>
        </div>
      </div>
    </DashboardLayout>
  );
}
