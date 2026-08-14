# 🌾 YieldSense AI

> AI-powered Crop Yield Prediction and Agricultural Productivity Forecasting System

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📋 Overview

YieldSense AI is an enterprise-grade agricultural decision support platform engineered to help farmers, agronomists, and agricultural administrators optimize crop yields. By unifying historical production datasets, live Open-Meteo weather intelligence, soil nutrient chemistry, and dual machine learning inference pipelines, the application delivers actionable yield forecasts, agronomic recommendations, risk management, analytics, PDF/CSV report generation, and system administration.

---

## 🛠️ End-to-End Development Lifecycle Phases

### PHASE 1 — PROJECT FOUNDATION
* **Objective**: Establish project architecture, repository structure, and core technical dependencies.
* **Key Components**: FastAPI backend, Next.js 16 frontend with App Router, TypeScript type safety, and Tailwind CSS design system tokens.
* **Implementation & Verification**: `/api/v1/health` and Next.js root landing page configured and active.

### PHASE 2 — APPLICATION & AUTHENTICATION
* **Objective**: Build identity management, access control, and multi-tenant farm data management.
* **Key Components**: Client-side and server-side Firebase Authentication (Signup, Login, Password Reset, Profile Management); Firestore Farm CRUD operations with strict `user_id` multi-tenant data isolation.
* **Implementation & Verification**: Authenticated user sessions function with single-refresh state updates and user-scoped data access.

### PHASE 3 — DATA MANAGEMENT & PREPROCESSING
* **Objective**: Ingest, clean, encode, and scale agricultural datasets for machine learning training pipelines.
* **Key Components**: Processing pipelines for `Crop_recommendation_processed.csv` and `yield_df_processed.csv`; One-Hot Encoding for region and crop attributes; `StandardScaler` transformations for numerical feature scaling.
* **Implementation & Verification**: Preprocessed datasets saved under `backend/datasets/processed/` ready for ML pipelines.

### PHASE 4 — MACHINE LEARNING & YIELD PREDICTION
* **Objective**: Train, optimize, evaluate, and serve machine learning inference models.
* **Key Components**:
  - **Classification Model**: Random Forest Crop Recommendation Model (**99.32% Accuracy**, **0.9937 Precision**, **0.9932 F1**).
  - **Regression Model**: Tuned KNN Crop Yield Prediction Model (**0.9860 R² Score**, **0.414 tons/ha MAE**, **1.009 tons/ha RMSE**).
  - **Agronomic Safety Overrides**: Deterministic physical boundary rules forcing 0.0 tons/ha yield on freezing temperatures, extreme drought, severe soil pH, or nutrient depletion.
* **Implementation & Verification**: Singleton inference engine (`predictor.py`) loads `.joblib` model artifacts and serves real-time predictions.

### PHASE 5 — ANALYTICS & VISUALIZATION
* **Objective**: Surface aggregate operational metrics and live interactive data visualizations.
* **Key Components**: Live Analytics Dashboard (`/analytics`) featuring Yield Trends, Crop Yield Comparison, Season Performance, and Scatter Analysis (Rainfall vs. Yield); History log (`/history`) with search, pagination, and modal views.
* **Implementation & Verification**: Live charts render in real time from prediction history and farm records.

### PHASE 6 — RECOMMENDATION & RISK ASSESSMENT
* **Objective**: Provide rule-based agronomic recommendations and point-based agricultural risk scoring.
* **Key Components**:
  - Centralized agronomic thresholds (`SOIL_ACIDIC_THRESHOLD`, `YIELD_LOW_THRESHOLD`, `RAINFALL_WARNING_DEVIATION`).
  - Rule-Based Advisory Engine: Generates plain-English recommendations based on soil pH, yield deviation vs. farm average, and rainfall deviation.
  - Risk Assessment Engine: Assigns `Low`, `Medium`, or `High` risk levels with priority guidance and identified risk explanations.
  - Farm-Linked API: `GET /api/v1/recommendations/farm/{farm_id}` endpoint and `FarmAdvisoryPanel` frontend component.
* **Implementation & Verification**: 100% test coverage on all 11 core agronomic scenarios with graceful missing data handling.

### PHASE 7 — TESTING & DEPLOYMENT
* **Objective**: Ensure comprehensive test coverage, containerization, and production cloud readiness.
* **Key Components**:
  - **Automated Pytest Suite**: 15 test modules (`backend/tests/`) covering Health, Auth, Farms, Prediction, Weather, Soil, Analytics, Recommendations, Risk, and Error Handling (`100% pass rate`).
  - **Postman API Collection**: `YieldSense_AI.postman_collection.json` with parameterized environment variables.
  - **Production Containerization**: Multi-stage `frontend/Dockerfile` (with Next.js `output: 'standalone'`), slim `backend/Dockerfile`, `.dockerignore` filters, and `docker-compose.yml`.
* **Implementation & Verification**: 15/15 pytest cases passing, clean production Docker Compose build, zero TypeScript errors.

### PHASE 8 — MODEL & REPOSITORY MANAGEMENT
* **Objective**: Maintain reproducible ML model metadata, evaluation reports, and secret-free repository security.
* **Key Components**:
  - Model evaluation script (`backend/ml/evaluate_test_set.py`) evaluating models on 20% unseen test split.
  - Evaluation Report: `backend/ml/evaluation_report.md` documenting exact test metrics.
  - Security Audit: Secret removal, clean `.env.example` templates, git ignore rules for assistant context files.
* **Implementation & Verification**: Held-out test evaluation completed and report stored cleanly.

### PHASE 9 — FINAL QUALITY ASSURANCE
* **Objective**: Complete end-to-end user workflow verification and system governance.
* **Key Components**: Dedicated Admin Control Center (`/admin`) with live system KPIs, role management (`Farmer` ↔ `Admin`), system audit stream; ReportLab PDF and CSV export engine; production deployment guide (`docs/deployment.md`).
* **Implementation & Verification**: Full end-to-end user workflow verified across landing, login, farm creation, prediction, advisory, analytics, report export, and logout.

---

## 🏗️ Architecture

```
┌─────────────────────────┐      ┌──────────────────────────┐
│   Frontend (Next.js)    │────▶│    Backend (FastAPI)      │
│   Local / Vercel Host   │      │   Local / Render Host    │
│                         │      │                          │
│  • React 19 + TypeScript│      │  • REST API (v1)         │
│  • Tailwind CSS v4      │      │  • Firebase Admin SDK    │
│  • Firebase Client SDK  │      │  • ML Inference Engine   │
│  • App Router           │      │  • ReportLab PDF Engine  │
│  • Recharts Analytics   │      │  • Open-Meteo Weather    │
└─────────────────────────┘      └──────────────────────────┘
         │                                 │
         │         ┌──────────────┐        │
         └────────▶│   Firebase   │◀──────┘
                   │              │
                   │  • Auth      │
                   │  • Firestore │
                   │  • Storage   │
                   └──────────────┘
```

---

## 📁 Folder Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py              # Auth and Firestore injectables
│   │   │   └── v1/
│   │   │       ├── auth.py          # Firebase Auth endpoints
│   │   │       ├── users.py         # User profile routes
│   │   │       ├── farms.py         # Farm collection CRUD operations
│   │   │       ├── prediction.py    # Yield prediction & Crop recommendation routes
│   │   │       ├── weather.py       # Weather data and forecasts
│   │   │       ├── soil.py          # Soil analysis endpoints
│   │   │       ├── analytics.py     # Analytics & Dashboard aggregation endpoints
│   │   │       ├── history.py       # Prediction history management endpoints
│   │   │       ├── reports.py       # Report creation & management endpoints
│   │   │       ├── exports.py       # PDF & CSV file download routes
│   │   │       ├── admin.py         # System administration endpoints
│   │   │       └── router.py        # v1 Aggregator
│   │   ├── core/
│   │   │   └── config.py            # Pydantic environment configurations
│   │   ├── services/
│   │   │   ├── weather_service.py   # Open-Meteo client wrapper with caching
│   │   │   ├── soil_service.py      # NPK & pH suitability checker
│   │   │   ├── prediction_service.py# E2E prediction orchestrator
│   │   │   ├── analytics_service.py # Analytics calculation service
│   │   │   ├── history_service.py   # Prediction history service
│   │   │   ├── report_service.py    # Report management service
│   │   │   ├── export_service.py    # ReportLab PDF & CSV generation engine
│   │   │   └── admin_service.py     # Admin stats, user management & system audit
│   │   └── schemas/                 # Request/Response validation schemas
│   ├── datasets/
│   │   ├── raw/                     # Original CSV files (Crop_recommendation, yield_df, sample_crop_data)
│   │   └── processed/               # Preprocessing output (cleaned & encoded files)
│   ├── ml/
│   │   ├── utils/
│   │   │   └── config.py            # Path & model feature configs
│   │   ├── inference/
│   │   │   └── predictor.py         # Singleton predictor loading .joblib artifacts
│   │   ├── evaluate_test_set.py     # Test evaluation validation script
│   │   ├── evaluation_report.md     # Model metrics evaluation report
│   │   └── train.py                 # ML training orchestrator CLI
│   ├── tests/                       # Automated Pytest suite
│   ├── package.json                 # npm runner scripts for backend dev & training
│   ├── requirements.txt
│   └── main.py                      # FastAPI App entrypoint
├── docs/
│   └── deployment.md                # Production Cloud & Container Deployment Guide
├── frontend/
│   ├── src/
│   │   ├── app/                     # Next.js App Router structure
│   │   │   └── (dashboard)/
│   │   │       ├── dashboard/       # Farmer Dashboard Page
│   │   │       ├── prediction/      # Interactive AI Yield Prediction Page
│   │   │       ├── analytics/       # Live Charts & Analytics Page
│   │   │       ├── history/         # Prediction History Page
│   │   │       ├── reports/         # PDF/CSV Reports Generation Page
│   │   │       ├── admin/           # Dedicated Admin Control Center
│   │   │       ├── weather/         # 7-Day Weather Forecast Page
│   │   │       └── soil/            # Soil Analysis & Recommendations Page
│   │   ├── services/                # API client calls (predictionService, adminService, etc.)
│   │   └── utils/
│   │       └── constants.ts         # Constants & route definitions matching ML categories
│   ├── package.json
│   └── tailwind.config.ts
├── YieldSense_AI.postman_collection.json
├── docker-compose.yml
└── README.md
```

---

## 🧠 Machine Learning Performance Summary

YieldSense AI employs a modular machine learning pipeline built on `scikit-learn` and `joblib`.

### 1. Crop Recommendation (Classification Model)
* **Dataset**: `Crop_recommendation_processed.csv` (2,200 total records)
* **Features**: `N`, `P`, `K`, `temperature`, `humidity`, `ph`, `rainfall` (7 features)
* **Best Model**: **Random Forest Classifier** (n_estimators=100)
* **Test Metrics (Evaluated on 20% held-out test split of 440 records)**:
  - **Accuracy**: **`99.32%`**
  - **Precision (Weighted)**: **`0.9937`**
  - **Recall (Weighted)**: **`0.9932`**
  - **F1-Score (Weighted)**: **`0.9932`**

### 2. Crop Yield Prediction (Regression Model)
* **Dataset**: `yield_df_processed.csv` (25,932 total records, 123 feature columns)
* **Features**: Numerical parameters (`Year`, `rainfall`, `pesticides`, `avg_temp`) + One-Hot Encoded `Area` and `Item` columns
* **Best Model**: **KNN Regressor (tuned, k=1)**
* **Test Metrics (Evaluated on 20% held-out test split of 5,187 records)**:
  - **R² Score**: **`0.9860`** (98.60%)
  - **Mean Absolute Error (MAE)**: **`0.4140 tons/ha`** (4,140.23 hg/ha)
  - **Root Mean Squared Error (RMSE)**: **`1.0090 tons/ha`** (10,090.20 hg/ha)

### 3. Agronomic Safety Overrides
Rule-based boundary layers prevent false positive predictions under extreme conditions:
* 🌧️ **Extreme Drought**: `annual_rainfall` < 50.0 mm
* 🌡️ **Extreme Temperature**: `temperature` < 5.0°C or > 48.0°C
* 🧪 **Extreme Soil pH**: `soil_ph` < 4.0 or > 9.5
* 📉 **Severe Nutrient Depletion**: N, P, K all < 5.0 kg/ha

---

## ⚙️ Development & Testing Execution

### Prerequisites
* Python 3.10+
* Node.js 18+
* Docker & Docker Compose (optional for containerized setup)

### Running Locally

#### 1. Backend Server
```bash
cd backend
npm run dev
# Server running at http://localhost:8000
```

#### 2. Frontend Development Server
```bash
cd frontend
npm run dev
# Next.js running at http://localhost:3000
```

---

### 🧪 Automated Testing & API Validation

#### 1. Backend Pytest Suite
```bash
cd backend
python -m pytest tests/ -v
```

#### 2. Postman API Collection
Import `YieldSense_AI.postman_collection.json` into Postman. Set environment variables `{{baseUrl}}` (`http://localhost:8000/api/v1`) and `{{authToken}}`.

---

### 🐳 Containerized Production Setup

Run the multi-container stack via Docker Compose:

```bash
docker compose up --build -d
```

- **Frontend Application**: http://localhost:3000
- **Backend REST API**: http://localhost:8000/api/v1
- **OpenAPI Swagger Docs**: http://localhost:8000/docs
- **Cloud Deployment Guide**: See [`docs/deployment.md`](docs/deployment.md) for hosting configurations.
