"use client";

import { motion } from "framer-motion";
import { TrendingUp, AlertCircle } from "lucide-react";
import { CustomAreaChart } from "@/components/area-chart";
import { CircularProgress } from "@/components/circular-progress";
import { AnimatedCard } from "@/components/card";
import { AnimatedCounter } from "@/components/animated-counter";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  useInvestmentSummary,
  useMonthlyTransactionData,
} from "@/hooks/use-investment-data";
import { Skeleton } from "@/components/ui/skeleton";

export default function InvestmentsPage() {
  // Fetch API data
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useInvestmentSummary();

  const { data: monthlyData, isLoading: isMonthlyLoading } =
    useMonthlyTransactionData();

  // Format amounts as currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Investment Card */}
          <AnimatedCard delay={0.3} className="p-6 rounded-3xl bg-card">
            <div className="flex items-center mb-4">
              <CircularProgress
                value={
                  isSummaryLoading
                    ? 0
                    : ((summaryData?.totalAmount || 0) /
                        (summaryData?.targetAmount || 1)) *
                      100
                }
                size={60}
                strokeWidth={6}
              />
              <div className="ml-4">
                <div className="text-sm font-medium">Investments</div>
              </div>
            </div>
            {isSummaryLoading ? (
              <Skeleton className="h-10 w-40 mb-1" />
            ) : isSummaryError ? (
              <div className="text-sm text-red-500 flex items-center mb-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                Error loading data
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold mb-1">
                  <AnimatedCounter
                    value={formatCurrency(summaryData?.totalAmount || 0)}
                  />
                </div>
                <div className="text-sm text-gray-400">
                  Target: {formatCurrency(summaryData?.targetAmount || 0)}
                </div>
              </>
            )}
          </AnimatedCard>

          {/* Credit Card */}
          <AnimatedCard delay={0.4} className="p-6 rounded-3xl bg-card">
            <div className="flex items-center mb-4">
              <CircularProgress
                value={isSummaryLoading ? 0 : 40}
                size={60}
                strokeWidth={6}
                color="#FF4D4F"
                bgColor="rgba(255, 77, 79, 0.2)"
              />
              <div className="ml-4">
                <div className="text-sm font-medium">Credit</div>
              </div>
            </div>
            {isSummaryLoading ? (
              <Skeleton className="h-10 w-40 mb-1" />
            ) : (
              <>
                <div className="text-3xl font-bold mb-1">
                  -{formatCurrency(summaryData?.creditAmount || 0)}
                </div>
                <div className="text-sm text-gray-400">
                  {formatCurrency(summaryData?.creditRemaining || 0)} Remaining
                </div>
              </>
            )}
          </AnimatedCard>
        </div>

        {/* Portfolio Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnimatedCard
            delay={0.5}
            className="md:col-span-2 p-6 rounded-3xl bg-white text-black"
          >
            <div className="text-sm font-medium mb-4">Investments</div>
            {isSummaryLoading ? (
              <>
                <Skeleton className="h-10 w-32 bg-gray-200 mb-2" />
                <Skeleton className="h-10 w-20 bg-gray-200" />
              </>
            ) : (
              <>
                <div className="text-3xl font-bold mb-2">
                  <AnimatedCounter
                    value={formatCurrency(summaryData?.totalAmount || 0)}
                  />
                </div>
                <div className="text-3xl font-bold text-primary">
                  +{summaryData?.growthPercentage || 0}%
                </div>
              </>
            )}
          </AnimatedCard>

          <AnimatedCard delay={0.6} className="p-6 rounded-3xl bg-card">
            <div className="text-sm font-medium mb-2">Last 6 month</div>
            <div className="h-48">
              {isMonthlyLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <CustomAreaChart
                  data={monthlyData || []}
                  dataKey="value"
                  xAxisDataKey="month"
                  height={180}
                />
              )}
            </div>
          </AnimatedCard>
        </div>

        {/* Return Rate Card */}
        <AnimatedCard delay={0.7} className="p-6 rounded-3xl bg-card">
          <div className="text-xl font-bold mb-4">
            Increase your relative return by
          </div>
          <div className="text-5xl font-bold mb-6">3.5%</div>

          <div className="h-48 mb-6">
            {isMonthlyLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <CustomAreaChart
                data={[
                  { name: "₹0", value: 0 },
                  { name: "₹1M", value: 1000000 },
                  { name: "₹2M", value: 2000000 },
                  { name: "₹3M", value: 3000000 },
                  { name: "₹4M", value: 4000000 },
                ]}
                dataKey="value"
                height={180}
              />
            )}
          </div>

          {/* Age indicators */}
          <div className="flex flex-wrap gap-4 mb-6">
            {["Age 32", "Age 42", "Age 52", "Age 62"].map((age, index) => (
              <motion.div
                key={age}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center"
              >
                <div
                  className={`h-3 w-3 rounded-full ${
                    index === 0 ? "bg-white" : "bg-primary"
                  } mr-2`}
                ></div>
                <span className="text-sm">{age}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <h3 className="text-xl font-bold mb-4">Recent Investments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Successfully Processed Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 }}
                className="p-4 rounded-3xl bg-primary text-black"
              >
                <div className="text-3xl font-bold">
                  {isSummaryLoading ? (
                    <Skeleton className="h-8 w-24 bg-black/10" />
                  ) : (
                    formatCurrency((summaryData?.totalAmount || 0) * 0.7)
                  )}
                </div>
                <div className="flex items-center text-sm">
                  +22% <TrendingUp className="ml-1 h-3 w-3" />
                </div>
                <div className="text-sm mt-2">Successfully processed</div>
              </motion.div>

              {/* Points Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 }}
                className="p-4 rounded-3xl bg-white text-black"
              >
                <div className="text-3xl font-bold">
                  {isMonthlyLoading ? (
                    <Skeleton className="h-8 w-16 bg-gray-200" />
                  ) : (
                    monthlyData?.length || 0
                  )}
                </div>
                <div className="flex items-center text-sm text-primary">
                  +{(monthlyData?.length || 0) * 2.5}%{" "}
                  <TrendingUp className="ml-1 h-3 w-3" />
                </div>
                <div className="text-sm mt-2">Transaction count</div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatedCard>
      </div>
    </DashboardLayout>
  );
}
