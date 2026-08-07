/**
 * YieldSense AI — Dashboard Page (Milestone 3 — Live Data)
 *
 * Fully connected to analytics API with real-time data,
 * recent predictions, risk overview, and mini yield chart.
 */

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  MapPin, Wheat, Ruler, BarChart3, Plus, TrendingUp,
  ArrowRight, Sprout, Cloud, Layers, AlertTriangle,
  ShieldCheck, ShieldAlert, ShieldX, AlertCircle,
  History, FileText, RefreshCw, Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { analyticsService } from "@/services/m3services";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import YieldTrendChart from "@/components/charts/YieldTrendChart";
import { ROUTES } from "@/utils/constants";
import { formatArea, getRelativeTime } from "@/utils/formatters";
import type { DashboardSummary } from "@/types/analytics";

const RISK_STYLES: Record<string, { badge: string; icon: React.ReactNode; text: string }> = {
  Low: {
    badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    icon: <ShieldCheck className="h-4 w-4 text-green-600" />,
    text: "text-green-700 dark:text-green-400",
  },
  Medium: {
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    icon: <AlertCircle className="h-4 w-4 text-yellow-600" />,
    text: "text-yellow-700 dark:text-yellow-400",
  },
  High: {
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    icon: <ShieldAlert className="h-4 w-4 text-orange-600" />,
    text: "text-orange-700 dark:text-orange-400",
  },
  Critical: {
    badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: <ShieldX className="h-4 w-4 text-red-600" />,
    text: "text-red-700 dark:text-red-400",
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getDashboardSummary();
      setSummary(data);
    } catch {
      // Set empty defaults on error
      setSummary({
        total_farms: 0,
        total_area: 0,
        unique_crops: 0,
        crop_list: [],
        total_predictions: 0,
        avg_predicted_yield: null,
        latest_prediction: null,
        latest_risk_level: null,
        latest_risk_score: null,
        high_risk_count: 0,
        recent_predictions: [],
        recent_farms: [],
        model_name: null,
        model_accuracy: null,
        model_status: "not_trained",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile && profile.role === "admin") {
      router.replace(ROUTES.ADMIN);
      return;
    }
    loadDashboard();
  }, [user?.uid, profile?.role]);



  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const modelReady = summary?.model_status === "ready" && summary?.model_name;
  const riskStyle = summary?.latest_risk_level
    ? RISK_STYLES[summary.latest_risk_level] || RISK_STYLES.Low
    : null;

  const statCards = [
    {
      label: "Total Farms",
      value: summary?.total_farms || 0,
      icon: <MapPin className="h-5 w-5" />,
      color: "from-green-500 to-emerald-500",
      bgLight: "bg-green-50 dark:bg-green-900/20",
    },
    {
      label: "Total Area",
      value: formatArea(summary?.total_area || 0),
      icon: <Ruler className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Crop Types",
      value: summary?.unique_crops || 0,
      icon: <Wheat className="h-5 w-5" />,
      color: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      label: "Total Predictions",
      value: summary?.total_predictions || 0,
      icon: <BarChart3 className="h-5 w-5" />,
      color: "from-purple-500 to-violet-500",
      bgLight: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="space-y-8 animate-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {profile?.display_name?.split(" ")[0] || "Farmer"} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here&apos;s an overview of your agricultural performance today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboard}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <Link href={ROUTES.FARM_NEW}>
            <Button>
              <Plus className="h-4 w-4" />
              Add Farm
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {statCards.map((stat) => (
          <Card key={stat.label} padding="md" className="relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                {stat.icon}
              </div>
            </div>
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${stat.bgLight} rounded-full blur-2xl opacity-60`} />
          </Card>
        ))}
      </div>

      {/* Risk + Avg Yield Banner — if predictions exist */}
      {summary && summary.total_predictions > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Avg Yield */}
          <Card padding="md" className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Average Yield</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {summary.avg_predicted_yield ? `${summary.avg_predicted_yield.toFixed(2)} t/ha` : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-1">across {summary.total_predictions} predictions</p>
          </Card>

          {/* Latest Risk */}
          <Card padding="md" className={`${riskStyle ? "border-current" : ""} relative overflow-hidden`}>
            <div className="flex items-center gap-2 mb-1">
              {riskStyle ? riskStyle.icon : <ShieldCheck className="h-4 w-4 text-gray-400" />}
              <p className="text-sm text-gray-500 dark:text-gray-400">Latest Risk Level</p>
            </div>
            <p className={`text-2xl font-bold mt-1 ${riskStyle ? riskStyle.text : "text-gray-400"}`}>
              {summary.latest_risk_level || "No data"}
            </p>
            {summary.latest_risk_score !== null && (
              <p className="text-xs text-gray-400 mt-1">Score: {summary.latest_risk_score.toFixed(1)}/100</p>
            )}
            {summary.high_risk_count > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
                <span className="text-xs text-orange-600">{summary.high_risk_count} high-risk prediction{summary.high_risk_count !== 1 ? "s" : ""}</span>
              </div>
            )}
          </Card>

          {/* AI Model */}
          <Card padding="md" className={modelReady ? "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200 dark:border-purple-800" : ""}>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-purple-600" />
              <p className="text-sm text-gray-500 dark:text-gray-400">AI Model</p>
            </div>
            <p className="text-base font-bold text-gray-900 dark:text-white mt-1">
              {summary.model_name || "Not Trained"}
            </p>
            {summary.model_accuracy && (
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                R² = {(summary.model_accuracy * 100).toFixed(1)}%
              </p>
            )}
            <Link href={ROUTES.PREDICTION} className="block mt-2">
              <span className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Make a Prediction
              </span>
            </Link>
          </Card>
        </div>
      )}

      {/* Recent Predictions + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Predictions */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Predictions
            </h2>
            <Link href={ROUTES.HISTORY}>
              <span className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>

          {summary && summary.recent_predictions.length > 0 ? (
            <div className="space-y-3">
              {summary.recent_predictions.map((pred) => {
                const rs = pred.risk_level ? RISK_STYLES[pred.risk_level] : null;
                return (
                  <div key={pred.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {pred.crop.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{pred.crop}</p>
                        <span className="text-xs text-gray-400">{pred.season}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-green-600 font-medium">{pred.predicted_yield.toFixed(2)} t/ha</p>
                        {pred.risk_level && rs && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${rs.badge}`}>
                            {pred.risk_level}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{getRelativeTime(pred.created_at)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No predictions yet</p>
              <Link href={ROUTES.PREDICTION} className="mt-2 inline-block">
                <Button size="sm" variant="outline" className="mt-2">
                  <TrendingUp className="h-4 w-4" /> Make First Prediction
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card padding="md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Add a New Farm", href: ROUTES.FARM_NEW, icon: <Plus className="h-4 w-4" />, desc: "Register farm details and soil data" },
              { label: "AI Prediction", href: ROUTES.PREDICTION, icon: <TrendingUp className="h-4 w-4" />, desc: "Predict crop yields with AI + risk analysis" },
              { label: "Analytics Dashboard", href: ROUTES.ANALYTICS, icon: <BarChart3 className="h-4 w-4" />, desc: "View charts, trends, and performance insights" },
              { label: "Prediction History", href: ROUTES.HISTORY, icon: <History className="h-4 w-4" />, desc: "Browse and export all past predictions" },
              { label: "Reports & Export", href: ROUTES.REPORTS, icon: <FileText className="h-4 w-4" />, desc: "Generate PDF and CSV reports" },
              { label: "Weather Data", href: ROUTES.WEATHER, icon: <Cloud className="h-4 w-4" />, desc: "Live weather for farm locations" },
              { label: "Soil Analysis", href: ROUTES.SOIL, icon: <Layers className="h-4 w-4" />, desc: "Analyze soil health and NPK levels" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors shrink-0">
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</p>
                  <p className="text-xs text-gray-500 truncate">{action.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Mini Yield Chart + Active Crops */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Trend Mini Chart */}
        {summary && summary.total_predictions > 0 && (
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Yield Trend</h2>
              <Link href={ROUTES.ANALYTICS}>
                <span className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                  Full Analytics <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </div>
            {/* Import chart lazily to avoid SSR issues */}
            <YieldTrendChart
              data={(summary.recent_predictions || []).map((p) => ({
                date: p.created_at.slice(0, 10),
                predicted_yield: p.predicted_yield,
                crop: p.crop,
                season: p.season,
                area: p.area,
              }))}
              height={180}
            />
          </Card>
        )}

        {/* Active Crops */}
        <Card padding="md">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Crops</h2>
          {summary?.crop_list && summary.crop_list.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {summary.crop_list.map((crop) => (
                <span
                  key={crop}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                >
                  <Sprout className="h-3.5 w-3.5" />
                  {crop}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Wheat className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No crops yet</p>
              <p className="text-xs text-gray-400 mt-1">Add a farm to see your crops here</p>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Farms */}
      {summary && summary.recent_farms.length > 0 && (
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Farms</h2>
            <Link href={ROUTES.FARMS}>
              <span className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {summary.recent_farms.map((farm) => (
              <Link key={farm.id} href={ROUTES.FARM_DETAIL(farm.id)}>
                <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-all cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 text-xs font-bold">
                      {farm.name.charAt(0)}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{farm.name}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{farm.location}</span>
                    <span>·</span>
                    <span>{farm.crop}</span>
                    <span>·</span>
                    <span>{formatArea(farm.area)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
