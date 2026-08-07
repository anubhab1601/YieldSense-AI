/**
 * YieldSense AI — Season Comparison Chart + Rainfall vs Yield Scatter
 */

"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from "recharts";
import type { SeasonYieldPoint, RainfallYieldPoint } from "@/types/analytics";

// ============================================================
// Season Comparison Chart
// ============================================================

const SEASON_COLORS: Record<string, string> = {
  Kharif: "#16a34a",
  Rabi: "#2563eb",
  Annual: "#d97706",
  Summer: "#dc2626",
  Zaid: "#7c3aed",
};

interface SeasonProps {
  data: SeasonYieldPoint[];
  height?: number;
}

const SeasonTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload as SeasonYieldPoint;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-900 dark:text-white mb-1">{d.season} Season</p>
        <p className="text-blue-600">Avg Yield: <span className="font-bold">{d.avg_yield.toFixed(3)} t/ha</span></p>
        <p className="text-gray-500">Predictions: {d.count}</p>
      </div>
    );
  }
  return null;
};

export function SeasonComparisonChart({ data, height = 280 }: SeasonProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-600 text-sm">
        No season data available yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
        <XAxis
          dataKey="season"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          unit=" t/ha"
          width={65}
        />
        <Tooltip content={<SeasonTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
        <Bar dataKey="avg_yield" radius={[6, 6, 0, 0]} maxBarSize={60}>
          {data.map((entry, i) => (
            <Cell key={i} fill={SEASON_COLORS[entry.season] || "#6b7280"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ============================================================
// Rainfall vs Yield Scatter Chart
// ============================================================

interface RainfallProps {
  data: RainfallYieldPoint[];
  height?: number;
}

const CROP_COLORS = [
  "#16a34a", "#2563eb", "#d97706", "#dc2626", "#7c3aed",
  "#0891b2", "#65a30d", "#c026d3",
];

const ScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload as RainfallYieldPoint;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-900 dark:text-white mb-1">{d.crop}</p>
        <p className="text-blue-600">Rainfall: <span className="font-bold">{d.rainfall.toFixed(0)} mm</span></p>
        <p className="text-green-600">Yield: <span className="font-bold">{d.yield_value.toFixed(3)} t/ha</span></p>
        <p className="text-orange-500">Temp: {d.temperature.toFixed(1)}°C</p>
      </div>
    );
  }
  return null;
};

export function RainfallVsYieldChart({ data, height = 280 }: RainfallProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-600 text-sm">
        No data available yet.
      </div>
    );
  }

  // Group by crop for color mapping
  const crops = [...new Set(data.map((d) => d.crop))];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
        <XAxis
          dataKey="rainfall"
          type="number"
          name="Rainfall"
          unit=" mm"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          label={{ value: "Rainfall (mm)", position: "insideBottomRight", offset: -5, fontSize: 10, fill: "#9ca3af" }}
        />
        <YAxis
          dataKey="yield_value"
          type="number"
          name="Yield"
          unit=" t/ha"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickLine={false}
          axisLine={false}
          width={65}
        />
        <ZAxis range={[40, 40]} />
        <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: "3 3" }} />
        {crops.map((crop, i) => (
          <Scatter
            key={crop}
            name={crop}
            data={data.filter((d) => d.crop === crop)}
            fill={CROP_COLORS[i % CROP_COLORS.length]}
            fillOpacity={0.7}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
