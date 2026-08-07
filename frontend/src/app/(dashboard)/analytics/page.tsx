/**
 * YieldSense AI — Analytics Dashboard Page (Milestone 3)
 *
 * Full analytics with live charts from prediction history.
 */

"use client";

import React, { useEffect, useState } from "react";
import {
  TrendingUp, BarChart3, Leaf, CloudRain, Info,
  RefreshCw, ArrowUpRight,
} from "lucide-react";
import { analyticsService } from "@/services/m3services";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import YieldTrendChart from "@/components/charts/YieldTrendChart";
import CropComparisonChart from "@/components/charts/CropComparisonChart";
import { SeasonComparisonChart, RainfallVsYieldChart } from "@/components/charts/SeasonRainfallCharts";
import type { AnalyticsData } from "@/types/analytics";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const analyticsData = await analyticsService.getAnalyticsData();
      setData(analyticsData);
    } catch (err: any) {
      setError("Failed to load analytics data. Make sure you have predictions saved.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingSpinner text="Loading analytics..." />;

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Insights from your prediction history and farm performance.
          </p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">{error}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                Make predictions on the Prediction page to generate analytics data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Predictions",
              value: data.total_predictions,
              icon: <BarChart3 className="h-5 w-5" />,
              color: "from-purple-500 to-violet-500",
            },
            {
              label: "Average Yield",
              value: data.avg_yield ? `${data.avg_yield.toFixed(2)} t/ha` : "—",
              icon: <TrendingUp className="h-5 w-5" />,
              color: "from-green-500 to-emerald-500",
            },
            {
              label: "Best Performing Crop",
              value: data.best_crop || "—",
              icon: <Leaf className="h-5 w-5" />,
              color: "from-amber-500 to-orange-500",
            },
            {
              label: "Best Season",
              value: data.best_season || "—",
              icon: <CloudRain className="h-5 w-5" />,
              color: "from-blue-500 to-cyan-500",
            },
          ].map((stat) => (
            <Card key={stat.label} padding="md" className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Yield Trend */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Yield Trend Over Time</h2>
                <p className="text-xs text-gray-500 mt-0.5">{data.yield_trend.length} predictions</p>
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <YieldTrendChart data={data.yield_trend} height={250} />
          </Card>

          {/* Crop Comparison */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Crop Yield Comparison</h2>
                <p className="text-xs text-gray-500 mt-0.5">Average yield per crop type</p>
              </div>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
            <CropComparisonChart data={data.crop_comparison} height={250} />
          </Card>

          {/* Season Comparison */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Season Performance</h2>
                <p className="text-xs text-gray-500 mt-0.5">Average yield by season</p>
              </div>
              <Leaf className="h-4 w-4 text-amber-600" />
            </div>
            <SeasonComparisonChart data={data.season_comparison} height={250} />
          </Card>

          {/* Rainfall vs Yield */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Rainfall vs Yield</h2>
                <p className="text-xs text-gray-500 mt-0.5">Scatter analysis — each dot is a prediction</p>
              </div>
              <CloudRain className="h-4 w-4 text-cyan-600" />
            </div>
            <RainfallVsYieldChart data={data.rainfall_vs_yield} height={250} />
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!data || data.total_predictions === 0 && (
        <Card padding="lg" className="text-center">
          <BarChart3 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Prediction Data Yet</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Make your first crop yield prediction to start seeing analytics data, trends, and insights here.
          </p>
        </Card>
      )}
    </div>
  );
}
