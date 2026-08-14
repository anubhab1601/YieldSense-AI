/**
 * YieldSense AI — Prediction Page (Milestone 3 Enhanced)
 *
 * Full crop yield prediction form with results, weather,
 * soil, risk assessment, and recommendations.
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3, Wheat, CloudRain, Layers, Send,
  Thermometer, Droplets, Wind, AlertTriangle,
  CheckCircle, TrendingUp, MapPin, Sprout, FileText,
  History, ShieldAlert, Lightbulb,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { predictionService } from "@/services/predictionService";
import { farmService } from "@/services/farmService";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import RiskCard from "@/components/shared/RiskCard";
import RecommendationCard from "@/components/shared/RecommendationCard";
import { CROP_OPTIONS, ROUTES } from "@/utils/constants";
import type { PredictionRequest, PredictionResponse } from "@/types/prediction";
import type { Farm } from "@/types/farm";
import type { RiskAssessmentResponse, RecommendationResponse } from "@/types/m3types";

const SEASON_OPTIONS = ["Kharif", "Rabi", "Annual"];

const defaultForm: PredictionRequest = {
  crop: "Rice",
  season: "Kharif",
  state: "Unknown",
  area: 1000,
  temperature: 28,
  annual_rainfall: 1000,
  humidity: 65,
  soil_ph: 6.5,
  nitrogen: 80,
  phosphorus: 40,
  potassium: 35,
  fertilizer_usage: 150,
  pesticide_usage: 10,
  production: 0,
  latitude: undefined,
  longitude: undefined,
};

type ResultTab = "prediction" | "risk" | "recommendations";

export default function PredictionPage() {
  const [form, setForm] = useState<PredictionRequest>(defaultForm);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [activeTab, setActiveTab] = useState<ResultTab>("prediction");

  useEffect(() => {
    const loadFarms = async () => {
      try {
        const data = await farmService.listFarms(1, 100);
        setFarms(data.farms);
      } catch { /* ignore */ }
    };
    loadFarms();
  }, []);

  const handleFarmSelect = (farmId: string) => {
    setSelectedFarmId(farmId);
    const farm = farms.find((f) => f.id === farmId);
    if (farm) {
      setForm((prev) => ({
        ...prev,
        crop: farm.crop,
        area: farm.area,
        soil_ph: farm.soil_ph,
        nitrogen: farm.nitrogen,
        phosphorus: farm.phosphorus,
        potassium: farm.potassium,
        latitude: farm.latitude,
        longitude: farm.longitude,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const prediction = await predictionService.predictYield(form);
      setResult(prediction);
      setActiveTab("prediction");
      toast.success("Prediction generated & saved to history!");
    } catch (err: any) {
      toast.error(err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key: keyof PredictionRequest, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const risk = result?.risk_assessment as RiskAssessmentResponse | undefined;
  const recommendations = result?.recommendations as RecommendationResponse | undefined;

  const tabs: { id: ResultTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "prediction", label: "Results", icon: <TrendingUp className="h-4 w-4" /> },
    ...(risk ? [{ id: "risk" as ResultTab, label: "Risk", icon: <ShieldAlert className="h-4 w-4" />, badge: risk.overall_risk_level }] : []),
    ...(recommendations ? [{ id: "recommendations" as ResultTab, label: "Recommendations", icon: <Lightbulb className="h-4 w-4" /> }] : []),
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-green-600" />
            AI Yield Prediction
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter crop and soil data — get AI yield prediction, risk assessment, and recommendations instantly.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={ROUTES.HISTORY}>
            <Button variant="outline" size="sm">
              <History className="h-4 w-4" /> History
            </Button>
          </Link>
          <Link href={ROUTES.REPORTS}>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4" /> Reports
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Prediction Form */}
        <div className="xl:col-span-1">
          <Card padding="md">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Farm Selector */}
              {farms.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Auto-fill from Farm
                  </label>
                  <select
                    value={selectedFarmId}
                    onChange={(e) => handleFarmSelect(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select a farm (optional)</option>
                    {farms.map((farm) => (
                      <option key={farm.id} value={farm.id}>
                        {farm.name} — {farm.crop}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Crop Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Sprout className="h-4 w-4 text-green-600" /> Crop Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Crop</label>
                    <select value={form.crop} onChange={(e) => updateField("crop", e.target.value)}
                      className="form-select">
                      {CROP_OPTIONS.filter(c => c !== "Other").map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Season</label>
                    <select value={form.season} onChange={(e) => updateField("season", e.target.value)}
                      className="form-select">
                      {SEASON_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                  <Input label="Area (ha)" type="number" value={String(form.area)} onChange={(e) => updateField("area", Number(e.target.value))} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">State / Region</label>
                    <input
                      type="text" value={form.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      placeholder="e.g. Punjab, Maharashtra"
                      className="form-select"
                    />
                  </div>
                </div>
              </div>

              {/* Environment */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CloudRain className="h-4 w-4 text-blue-500" /> Environmental Conditions
                </h3>
                <div className="space-y-3">
                  <Input label="Temperature (°C)" type="number" value={String(form.temperature)} onChange={(e) => updateField("temperature", Number(e.target.value))} />
                  <Input label="Annual Rainfall (mm)" type="number" value={String(form.annual_rainfall)} onChange={(e) => updateField("annual_rainfall", Number(e.target.value))} />
                  <Input label="Humidity (%)" type="number" value={String(form.humidity || "")} onChange={(e) => updateField("humidity", Number(e.target.value))} />
                </div>
              </div>

              {/* Soil */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-amber-600" /> Soil Parameters
                </h3>
                <div className="space-y-3">
                  <Input label="Soil pH" type="number" value={String(form.soil_ph)} onChange={(e) => updateField("soil_ph", Number(e.target.value))} />
                  <Input label="Nitrogen (kg/ha)" type="number" value={String(form.nitrogen)} onChange={(e) => updateField("nitrogen", Number(e.target.value))} />
                  <Input label="Phosphorus (kg/ha)" type="number" value={String(form.phosphorus)} onChange={(e) => updateField("phosphorus", Number(e.target.value))} />
                  <Input label="Potassium (kg/ha)" type="number" value={String(form.potassium)} onChange={(e) => updateField("potassium", Number(e.target.value))} />
                </div>
              </div>

              {/* Agricultural Inputs */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Wheat className="h-4 w-4 text-green-700" /> Agricultural Inputs
                </h3>
                <div className="space-y-3">
                  <Input label="Fertilizer (kg/ha)" type="number" value={String(form.fertilizer_usage)} onChange={(e) => updateField("fertilizer_usage", Number(e.target.value))} />
                  <Input label="Pesticide (kg/ha)" type="number" value={String(form.pesticide_usage)} onChange={(e) => updateField("pesticide_usage", Number(e.target.value))} />
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" /> Location (optional)
                </h3>
                <div className="space-y-3">
                  <Input label="Latitude" type="number" value={String(form.latitude || "")} placeholder="e.g. 28.6139" onChange={(e) => updateField("latitude", Number(e.target.value) || undefined as any)} />
                  <Input label="Longitude" type="number" value={String(form.longitude || "")} placeholder="e.g. 77.2090" onChange={(e) => updateField("longitude", Number(e.target.value) || undefined as any)} />
                </div>
              </div>

              <Button type="submit" className="w-full" isLoading={loading}>
                <Send className="h-4 w-4" /> Generate Prediction
              </Button>
            </form>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="xl:col-span-2 space-y-4">
          {loading && <LoadingSpinner text="Running AI prediction, risk assessment, and recommendations..." />}

          {result && !loading && (
            <>
              {/* Tab Bar */}
              <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                        tab.badge === "Low" ? "bg-green-100 text-green-700" :
                        tab.badge === "Medium" ? "bg-yellow-100 text-yellow-700" :
                        tab.badge === "High" ? "bg-orange-100 text-orange-700" :
                        "bg-red-100 text-red-700"
                      }`}>{tab.badge}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "prediction" && (
                <div className="space-y-4">
                  {/* Prediction Result */}
                  <Card padding="md" className="border-2 border-green-200 dark:border-green-800">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Main yield */}
                      <div className="text-center">
                        <div className="w-14 h-14 mx-auto rounded-lg bg-[#e8f5ec] dark:bg-green-900/20 flex items-center justify-center text-[#1a6b3c] dark:text-green-400 mb-3">
                          <TrendingUp className="h-7 w-7" />
                        </div>
                        <p className="text-xs text-gray-500 mb-1">Predicted Yield</p>
                        <p className="text-4xl font-bold text-[#1a6b3c] dark:text-green-400">{result.predicted_yield.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{result.prediction_unit}</p>
                      </div>

                      {/* Stats */}
                      <div className="flex-1 w-full space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                          <span className="text-sm text-gray-500">Total Production</span>
                          <span className="font-bold text-gray-900 dark:text-white text-lg">{result.total_production.toFixed(1)} tons</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                          <span className="text-sm text-gray-500">Crop / Season</span>
                          <span className="font-medium text-gray-900 dark:text-white">{result.crop} · {result.season}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                          <span className="text-sm text-gray-500">Farm Area</span>
                          <span className="font-medium text-gray-900 dark:text-white">{result.area.toLocaleString()} ha</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-500">ML Model (R²)</span>
                          <span className="font-medium text-gray-900 dark:text-white text-xs">
                            {result.model_used} · {result.model_accuracy ? (result.model_accuracy * 100).toFixed(1) + "%" : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          <Badge variant={result.confidence === "High" ? "success" : result.confidence === "Medium" ? "warning" : "danger"}>
                            {result.confidence} Confidence
                          </Badge>
                          {risk && (
                            <Badge variant={
                              risk.overall_risk_level === "Low" ? "success" :
                              risk.overall_risk_level === "Medium" ? "warning" : "danger"
                            }>
                              {risk.overall_risk_level} Risk
                            </Badge>
                          )}
                          {result.prediction_id && (
                            <Badge variant="info" size="sm">Saved to history</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Weather + Soil in 2 cols */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Weather Summary */}
                    {result.weather_summary && (
                      <Card padding="md">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <CloudRain className="h-4 w-4 text-blue-500" /> Live Weather
                        </h3>
                        <div className="space-y-2">
                          {[
                            { label: "Temperature", icon: <Thermometer className="h-3.5 w-3.5" />, value: `${result.weather_summary.temperature}°C` },
                            { label: "Humidity", icon: <Droplets className="h-3.5 w-3.5" />, value: `${result.weather_summary.humidity}%` },
                            { label: "Rainfall", icon: <CloudRain className="h-3.5 w-3.5" />, value: `${result.weather_summary.rainfall} mm` },
                            { label: "Wind", icon: <Wind className="h-3.5 w-3.5" />, value: `${result.weather_summary.wind_speed} km/h` },
                          ].map(({ label, icon, value }) => (
                            <div key={label} className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2 text-gray-500">{icon} {label}</span>
                              <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                            </div>
                          ))}
                          <p className="text-xs text-gray-400 pt-1">{result.weather_summary.description}</p>
                        </div>
                      </Card>
                    )}

                    {/* Soil Summary */}
                    {result.soil_summary && (
                      <Card padding="md">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Layers className="h-4 w-4 text-amber-600" /> Soil Health
                        </h3>
                        <div className="text-center mb-3">
                          <p className="text-3xl font-bold text-gray-900 dark:text-white">{result.soil_summary.health_score}</p>
                          <p className="text-xs text-gray-400 mt-0.5">/ 100 · {result.soil_summary.health_label}</p>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                            <div
                              className="h-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                              style={{ width: `${result.soil_summary.health_score}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 text-center">{result.soil_summary.ph_status}</p>
                        {result.soil_summary.warnings?.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {result.soil_summary.warnings.slice(0, 2).map((w: string, i: number) => (
                              <p key={i} className="text-xs text-amber-600 flex items-start gap-1.5">
                                <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" /> {w}
                              </p>
                            ))}
                          </div>
                        )}
                      </Card>
                    )}
                  </div>

                  {/* Generate Report CTA */}
                  {result.prediction_id && (
                    <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Prediction saved! Generate a report?</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">Download this analysis as a professional PDF or CSV.</p>
                        </div>
                      </div>
                      <Link href={ROUTES.REPORTS}>
                        <Button size="sm">
                          <FileText className="h-4 w-4" /> Reports
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Risk Tab */}
              {activeTab === "risk" && risk && (
                <RiskCard risk={risk} />
              )}

              {/* Recommendations Tab */}
              {activeTab === "recommendations" && recommendations && (
                <RecommendationCard recommendations={recommendations} />
              )}
            </>
          )}

          {!result && !loading && (
            <Card padding="md" className="text-center">
              <div className="py-12">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to Predict</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  Fill in the form and click "Generate Prediction" to get your AI-powered yield forecast
                  with risk assessment and agronomic recommendations.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
