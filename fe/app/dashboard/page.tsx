"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { CircularProgress } from "@/components/circular-progress";
import { CustomAreaChart } from "@/components/area-chart";
import { AnimatedCard } from "@/components/card";
import { AnimatedCounter } from "@/components/animated-counter";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  useDashboardSummary,
  useRecentSuccessfulTransactions,
  useTransactionAnalytics,
} from "@/hooks/use-dashboard-data";
import { Skeleton } from "@/components/ui/skeleton";

// Age data points for financial roadmap
const ageData = [
  { age: "Age 32", active: true },
  { age: "Age 42", active: true },
  { age: "Age 52", active: true },
  { age: "Age 62", active: true },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("net-worth");

  // Fetch API data
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useDashboardSummary();

  const { data: recentTransactions, isLoading: isRecentLoading } =
    useRecentSuccessfulTransactions();

  const { data: analyticsData, isLoading: isAnalyticsLoading } =
    useTransactionAnalytics();

  // Format amounts as currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate percentage change from previous period (mock data for now)
  const calculateChange = (value: number, percentage: number = 5): string => {
    const change = value * (percentage / 100);
    return `+${formatCurrency(change)}`;
  };

  // Prepare chart data for the area chart
  const prepareChartData = () => {
    if (
      !analyticsData ||
      !analyticsData.chartData ||
      analyticsData.chartData.length === 0
    ) {
      return [{ name: "No Data", value: 0 }];
    }

    // Convert analytics chart data to the format expected by the component
    return analyticsData.chartData.map((item) => ({
      name: item.date,
      value: item.count,
    }));
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        {/* Financial Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium mr-2">Financial Roadmap</span>
            <ChevronDown className="h-4 w-4" />
          </div>
          <div className="flex items-center">
            <div className="flex-1 relative h-0.5 bg-gray-700">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-primary flex items-center justify-center"
              >
                <Check className="h-4 w-4 text-black" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="absolute left-1/4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-primary flex items-center justify-center"
              >
                <Check className="h-4 w-4 text-black" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="absolute left-1/2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-primary flex items-center justify-center"
              >
                <Check className="h-4 w-4 text-black" />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                className="absolute left-3/4 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-gray-600"
              />
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {["net-worth", "deposit", "withdrawal", "savings", "loans"].map(
            (tab, index) => (
              <motion.button
                key={tab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-black"
                    : "bg-transparent border border-gray-700 text-white hover:border-primary"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </motion.button>
            )
          )}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Transactions Card */}
          <AnimatedCard delay={0.4} className="p-6 rounded-3xl bg-card">
            <div className="flex items-center mb-4">
              <CircularProgress
                value={
                  isSummaryLoading
                    ? 0
                    : ((summaryData?.successfulTransactions || 0) /
                        (summaryData?.totalTransactions || 1)) *
                      100
                }
                size={60}
                strokeWidth={6}
              />
              <div className="ml-4">
                <div className="text-sm font-medium">Total Transactions</div>
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
                    value={summaryData?.totalTransactions.toString() || "0"}
                  />
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-400">30-Day</span>
                  <span className="ml-2 text-sm text-primary">
                    {calculateChange(summaryData?.totalTransactions || 0)}
                  </span>
                </div>
              </>
            )}
          </AnimatedCard>

          {/* Total Revenue Card */}
          <AnimatedCard delay={0.5} className="p-6 rounded-3xl bg-card">
            <div className="flex items-center mb-4">
              <CircularProgress
                value={isSummaryLoading ? 0 : 60}
                size={60}
                strokeWidth={6}
              />
              <div className="ml-4">
                <div className="text-sm font-medium">Total Revenue</div>
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
                  Target:{" "}
                  {formatCurrency((summaryData?.totalAmount || 0) * 1.2)}
                </div>
              </>
            )}
          </AnimatedCard>
        </div>

        {/* Transaction Analytics */}
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl font-bold mb-4"
        >
          Transaction Analytics
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Successful Transactions Card */}
          <AnimatedCard
            delay={0.7}
            className="p-6 rounded-3xl bg-primary text-black col-span-2"
          >
            <div className="flex justify-between mb-4">
              <div className="text-sm font-medium">Successful Transactions</div>
              <div className="text-2xl font-bold">
                {isSummaryLoading ? (
                  <Skeleton className="h-8 w-20 bg-black/10" />
                ) : (
                  <>
                    <AnimatedCounter
                      value={
                        summaryData?.successfulTransactions.toString() || "0"
                      }
                    />
                  </>
                )}
              </div>
            </div>
            {isSummaryLoading ? (
              <Skeleton className="h-10 w-32 bg-black/10 mb-2" />
            ) : (
              <>
                <div className="text-4xl font-bold mb-2">
                  {analyticsData?.successRate || 0}%
                </div>
                <div className="text-sm">
                  Success Rate <TrendingUp className="inline h-4 w-4" />
                </div>
              </>
            )}

            {/* Chart placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-4 h-24 flex items-end space-x-2"
            >
              {isAnalyticsLoading
                ? Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton
                        key={i}
                        className="w-1/6 h-16 bg-black/10 rounded-t-lg"
                      />
                    ))
                : analyticsData?.chartData.slice(-6).map((item, index) => {
                    const maxCount = Math.max(
                      ...analyticsData.chartData.map((d) => d.count)
                    );
                    const height = (item.count / maxCount) * 100;

                    return (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 1.0 + index * 0.1, duration: 0.5 }}
                        className={`w-1/6 ${
                          index === 5 ? "bg-black" : "bg-black/20"
                        } rounded-t-lg`}
                      />
                    );
                  })}
            </motion.div>
          </AnimatedCard>

          {/* Pending Transactions Card */}
          <AnimatedCard
            delay={0.8}
            className="p-6 rounded-3xl bg-gray-200 text-black"
          >
            <div className="text-sm font-medium mb-2">Pending Transactions</div>
            {isSummaryLoading ? (
              <Skeleton className="h-8 w-32 bg-gray-300 mb-1" />
            ) : (
              <>
                <div className="text-2xl font-bold mb-1">
                  <AnimatedCounter
                    value={summaryData?.pendingTransactions.toString() || "0"}
                  />
                </div>
                <div className="text-2xl font-bold">
                  {summaryData?.pendingTransactions &&
                  summaryData.totalTransactions
                    ? `${Math.round(
                        (summaryData.pendingTransactions /
                          summaryData.totalTransactions) *
                          100
                      )}%`
                    : "0%"}
                </div>
              </>
            )}
          </AnimatedCard>
        </div>

        {/* Success and Failed Transactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Success Rate Card */}
          <AnimatedCard delay={0.9} className="p-6 rounded-3xl bg-gray-700">
            <div className="text-sm font-medium mb-2">Success Rate</div>
            {isAnalyticsLoading ? (
              <Skeleton className="h-8 w-32 mb-1" />
            ) : (
              <>
                <div className="text-2xl font-bold mb-1">
                  <AnimatedCounter
                    value={(analyticsData?.successRate || 0).toString()}
                  />
                  %
                </div>
                <div className="text-2xl font-bold">
                  +{(analyticsData?.successRate || 0) * 0.1}%
                </div>
              </>
            )}
          </AnimatedCard>

          {/* Failed Transactions Card */}
          <AnimatedCard delay={1.0} className="p-6 rounded-3xl bg-gray-700">
            <div className="text-sm font-medium mb-2">Failed Transactions</div>
            {isSummaryLoading ? (
              <Skeleton className="h-8 w-32 mb-1" />
            ) : (
              <>
                <div className="text-2xl font-bold mb-1">
                  <AnimatedCounter
                    value={summaryData?.failedTransactions.toString() || "0"}
                  />
                </div>
                <div className="text-2xl font-bold">
                  {summaryData?.failedTransactions &&
                  summaryData.totalTransactions
                    ? `${Math.round(
                        (summaryData.failedTransactions /
                          summaryData.totalTransactions) *
                          100
                      )}%`
                    : "0%"}
                </div>
              </>
            )}
          </AnimatedCard>
        </div>

        {/* Transaction Volume Chart */}
        <AnimatedCard delay={1.1} className="p-6 rounded-3xl bg-card mb-8">
          <div className="text-sm mb-2">
            Increase your transaction volume by
          </div>
          <div className="text-5xl font-bold mb-6">3.5%</div>

          {/* Area Chart */}
          <div className="h-48">
            {isAnalyticsLoading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <CustomAreaChart
                data={prepareChartData()}
                dataKey="value"
                height={180}
              />
            )}
          </div>

          {/* Age indicators */}
          <div className="flex flex-wrap gap-4 mt-4">
            {ageData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="flex items-center"
              >
                <div
                  className={`h-3 w-3 rounded-full ${
                    item.active ? "bg-primary" : "bg-gray-600"
                  } mr-2`}
                ></div>
                <span className="text-sm">{item.age}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
          >
            <h3 className="text-xl font-bold mb-4 mt-6">Recent Transactions</h3>
            <div className="grid grid-cols-2 gap-4">
              {isRecentLoading ? (
                <>
                  <Skeleton className="h-24 w-full rounded-3xl" />
                  <Skeleton className="h-24 w-full rounded-3xl" />
                </>
              ) : recentTransactions && recentTransactions.length >= 2 ? (
                <>
                  {/* Most Recent Transaction */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.7 }}
                    className="p-4 rounded-3xl bg-primary text-black"
                  >
                    <div className="text-3xl font-bold">
                      ₹{recentTransactions[0].order_amount}
                    </div>
                    <div className="flex items-center text-sm">
                      {new Date(
                        recentTransactions[0].created_at
                      ).toLocaleDateString()}
                    </div>
                    <div className="text-sm mt-2">Latest transaction</div>
                  </motion.div>

                  {/* Second Most Recent Transaction */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.8 }}
                    className="p-4 rounded-3xl bg-white text-black"
                  >
                    <div className="text-3xl font-bold">
                      ₹{recentTransactions[1].order_amount}
                    </div>
                    <div className="flex items-center text-sm text-primary">
                      {new Date(
                        recentTransactions[1].created_at
                      ).toLocaleDateString()}
                    </div>
                    <div className="text-sm mt-2">Previous transaction</div>
                  </motion.div>
                </>
              ) : (
                <div className="col-span-2 p-4 rounded-3xl bg-gray-700 text-center">
                  <p>No recent transactions found</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Navigation dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9 }}
            className="flex justify-center mt-6 space-x-1"
          >
            <div className="h-2 w-2 rounded-full bg-white"></div>
            <div className="h-2 w-2 rounded-full bg-gray-600"></div>
            <div className="h-2 w-2 rounded-full bg-gray-600"></div>
          </motion.div>

          {/* Navigation arrows */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0 }}
            className="flex justify-end mt-4 space-x-2"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-700 hover:border-primary transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-black"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </AnimatedCard>
      </div>
    </DashboardLayout>
  );
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Check(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
