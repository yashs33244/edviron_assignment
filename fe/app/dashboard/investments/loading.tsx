import { DashboardLayout } from "@/components/dashboard-layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvestmentsLoading() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-40 rounded-3xl" />
          <Skeleton className="h-40 rounded-3xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-48 rounded-3xl md:col-span-2" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>

        <Skeleton className="h-96 rounded-3xl" />
      </div>
    </DashboardLayout>
  );
}
