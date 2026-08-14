/**
 * YieldSense AI — Risk Assessment Card Component
 */

"use client";

import React, { useState } from "react";
import {
  AlertTriangle, ShieldCheck, ShieldAlert, ShieldX,
  ChevronDown, ChevronUp, Zap, Droplets, Thermometer,
  FlaskConical, AlertCircle, Info,
} from "lucide-react";
import type { RiskAssessmentResponse, RiskItem } from "@/types/m3types";

interface Props {
  risk: RiskAssessmentResponse;
  compact?: boolean;
}

const SEVERITY_STYLES: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  Low: {
    bg: "bg-green-50 dark:bg-green-950/20",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
    icon: <ShieldCheck className="h-4 w-4" />,
  },
  Medium: {
    bg: "bg-yellow-50 dark:bg-yellow-950/20",
    text: "text-yellow-700 dark:text-yellow-400",
    border: "border-yellow-200 dark:border-yellow-800",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  High: {
    bg: "bg-orange-50 dark:bg-orange-950/20",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    icon: <ShieldAlert className="h-4 w-4" />,
  },
  Critical: {
    bg: "bg-red-50 dark:bg-red-950/20",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
    icon: <ShieldX className="h-4 w-4" />,
  },
};

const OVERALL_STYLES: Record<string, { gradient: string; badge: string; icon: React.ReactNode }> = {
  Low: {
    gradient: "from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800",
    badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    icon: <ShieldCheck className="h-5 w-5 text-green-600" />,
  },
  Medium: {
    gradient: "from-yellow-500/10 to-amber-500/10 border-yellow-200 dark:border-yellow-800",
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
  },
  High: {
    gradient: "from-orange-500/10 to-red-500/10 border-orange-200 dark:border-orange-800",
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
  },
  Critical: {
    gradient: "from-red-500/10 to-rose-500/10 border-red-200 dark:border-red-800",
    badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: <ShieldX className="h-5 w-5 text-red-600" />,
  },
};

function RiskItemRow({ risk }: { risk: RiskItem }) {
  const [expanded, setExpanded] = useState(false);
  const style = SEVERITY_STYLES[risk.severity] || SEVERITY_STYLES.Low;

  return (
    <div className={`rounded-lg border ${style.border} overflow-hidden`}>
      <button
        className={`w-full flex items-center justify-between p-3 ${style.bg} hover:opacity-90 transition-opacity`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 text-left">
          <span className={style.text}>{style.icon}</span>
          <span className={`text-sm font-medium ${style.text}`}>{risk.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.bg} ${style.text} border ${style.border}`}>
            {risk.severity}
          </span>
          <span className="text-xs text-gray-400">{risk.category}</span>
        </div>
        <span className={`${style.text} shrink-0`}>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>
      {expanded && (
        <div className="p-3 bg-white dark:bg-gray-900/50 space-y-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Why this is a risk</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{risk.reason}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Mitigation</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{risk.mitigation}</p>
          </div>
          {risk.affected_aspects && risk.affected_aspects.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {risk.affected_aspects.map((a) => (
                <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RiskCard({ risk, compact = false }: Props) {
  const [showAll, setShowAll] = useState(false);
  const overall = OVERALL_STYLES[risk.overall_risk_level] || OVERALL_STYLES.Low;

  const displayedRisks = showAll ? risk.risks : risk.risks.slice(0, 3);

  return (
    <div className={`rounded-lg border bg-white dark:bg-gray-900 overflow-hidden`}>
      {/* Risk level accent bar */}
      <div className={`h-1 w-full ${
        risk.overall_risk_level === "Low" ? "bg-green-500" :
        risk.overall_risk_level === "Medium" ? "bg-amber-500" :
        risk.overall_risk_level === "High" ? "bg-orange-500" :
        "bg-red-500"
      }`} />
      <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {overall.icon}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Risk Assessment</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{risk.crop} · {risk.detected_risk_count} risk{risk.detected_risk_count !== 1 ? "s" : ""} detected</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-2.5 py-0.5 rounded-md text-sm font-semibold ${overall.badge}`}>
            {risk.overall_risk_level}
          </span>
          <span className="text-xs text-gray-400">Score: {risk.risk_score.toFixed(1)}/100</span>
        </div>
      </div>

      {/* Priority */}
      <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{risk.priority_level}</span>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">{risk.priority_reason}</p>
      </div>

      {/* Risk Items */}
      {!compact && risk.risks.length > 0 && (
        <div className="space-y-2">
          {displayedRisks.map((r, i) => (
            <RiskItemRow key={i} risk={r} />
          ))}
          {risk.risks.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-[#1a6b3c] hover:text-[#155730] font-medium flex items-center gap-1"
            >
              {showAll ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {showAll ? "Show fewer" : `Show ${risk.risks.length - 3} more risks`}
            </button>
          )}
        </div>
      )}

      {/* Category badge */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-1 border-t border-gray-100 dark:border-gray-800">
        <span>Category: <span className="font-medium text-gray-700 dark:text-gray-300">{risk.risk_category}</span></span>
        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${overall.badge}`}>
          {risk.risk_category === "Stable" ? "No Action Needed" : risk.priority_level}
        </span>
      </div>
      </div>
    </div>
  );
}
