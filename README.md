# 🌾 YieldSense AI

> AI-powered Crop Yield Prediction and Agricultural Productivity Forecasting System

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📋 Overview

YieldSense AI is a production-ready Web and Machine Learning platform designed to help farmers and agricultural administrators make intelligent, data-driven farming choices. By integrating historical agricultural data, live weather forecasts, soil characteristics, and machine learning models, the system predicts crop yields, recommends optimal crops, generates analytical insights, exports PDF/CSV reports, and provides complete system administration.

This codebase contains the complete implementation for **Milestone 1** (Core Software Foundation & Infrastructure), **Milestone 2** (Machine Learning, Integration, and Advanced Services), and **Milestone 3** (Analytics, History, Reporting, Multi-Tenant Isolation, and Admin Governance).

---

## 🚀 Milestone Features

### Milestone 1: Software Foundation & Core Infrastructure
* 🏗️ **Complete Software Foundation**: Setup a robust FastAPI backend and Next.js frontend with Tailwind CSS and TypeScript.
* 🔐 **Firebase Authentication Integration**: Client-side SDK and Backend Admin SDK validation (Signup, Login, Forgot Password, protected routes).
* 🚜 **Farm Management System**: Full CRUD capability for farm attributes (Area, Crop, Location) stored in Google Firestore.
* 🔔 **Notifications & Settings**: Infrastructure for farm notifications, settings pages, and user profile management.
* 🐳 **Containerization**: Backend Dockerfile, Frontend Dockerfile, and `docker-compose.yml` for multi-container orchestration.

### Milestone 2: Machine Learning & Intelligent Services
* 🧠 **Dual Machine Learning Pipelines**: Independent pipelines for classification (crop recommendation) and regression (yield prediction).
* 📊 **Automated Model Selection**: Evaluates 5 different algorithms for classification and regression, generating comparison matrices and saving the best-performing models dynamically.
* 📈 **KNN Hyperparameter Tuning**: Automatically conducts KNN elbow curve searches (plotting accuracy/$R^2$ scores vs. $k$-neighbors) to train with optimal parameters.
* 🛡️ **Agronomic Boundary Safety Overrides**: Implements strict physical rule overrides inside the prediction engine to force a 0.0 tons/ha output in unviable growing conditions (e.g., freezing temperature, extreme drought, extreme soil pH, or severe nutrient depletion).
* 🌤️ **Live Weather Integration**: Connects with Open-Meteo API to fetch current weather conditions and 7-day daily forecasts with caching to optimize performance.
* 🌱 **Soil Health Analysis**: Rule-based soil health evaluation assessing NPK ratings, pH status, and crop-specific suitability.
* 🖥️ **Interactive Dashboards**: Live pages for Predictions, Weather monitoring, and Soil analysis connected to FastAPI endpoints.

### Milestone 3: Analytics, History, Reports, Isolation & Admin Governance
* 📈 **Analytics & Live Charts Dashboard**: Interactive visual insights featuring Yield Trends, Crop Yield Comparison, Season Performance, and Scatter Analysis (Rainfall vs. Yield).
* 📜 **Historical Predictions System**: Comprehensive prediction history with individual search, pagination, detailed modal view, and record deletion.
* 📄 **PDF & CSV Export Engine**: Professional ReportLab PDF generator (with custom canvas headers, non-latin1 unicode sanitization, metrics table, risk badges, agronomic recommendations) and CSV downloader.
* 🛡️ **Multi-Tenant User Isolation**: Automatic user-scoped Firestore queries (`user_id == uid`) ensuring 100% data separation between individual farmers.
* ⚙️ **Dedicated Admin Control Center (`/admin`)**: System administration platform with live KPI metrics (Total Users, System Farms, System Predictions, Reports), user management table with role switching (`Farmer` ↔ `Admin`), ML engine status monitoring, system-wide prediction audit stream, and role-guarded access.
* ⚡ **Auto-Refresh Auth Lifecycle**: Zero-delay single page refresh on login and registration for clean session isolation across Farmer and Admin accounts.

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
│   │   └── train.py                 # ML training orchestrator CLI
│   ├── package.json                 # npm runner scripts for backend dev & training
│   ├── requirements.txt
│   └── main.py                      # FastAPI App entrypoint
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
└── README.md
```

---

## 📁 Milestone File Mapping

### Milestone 1 Files (Core Foundation)
* **Backend Core & Config**: `backend/app/core/config.py`, `backend/app/core/security.py`, `backend/app/firebase/client.py`
* **Database & Firebase Integration**: `backend/app/firebase/firestore.py`
* **Domain Models & CRUD Services**: `backend/app/models/farm.py`, `backend/app/models/user.py`, `backend/app/services/farm_service.py`, `backend/app/services/auth_service.py`, `backend/app/services/user_service.py`
* **API Routers**: `backend/app/api/v1/auth.py`, `backend/app/api/v1/farms.py`, `backend/app/api/v1/users.py`, `backend/app/api/v1/notifications.py`
* **Deployment Setup**: `backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml`
* **Frontend Auth & Views**: `frontend/src/app/(auth)/login/page.tsx`, `frontend/src/app/(auth)/signup/page.tsx`, `frontend/src/app/(dashboard)/farms/page.tsx`

### Milestone 2 Files (Machine Learning & Integration)
* **ML Pipeline & Runner**: `backend/ml/train.py`, `backend/ml/preprocessing/`, `backend/ml/training/`, `backend/ml/evaluation/`
* **Model Inference Engine**: `backend/ml/inference/predictor.py`
* **Weather, Soil, & Prediction Services**: `backend/app/services/weather_service.py`, `backend/app/services/soil_service.py`, `backend/app/services/prediction_service.py`
* **Prediction, Weather, & Soil APIs**: `backend/app/api/v1/prediction.py`, `backend/app/api/v1/weather.py`, `backend/app/api/v1/soil.py`

### Milestone 3 Files (Analytics, History, Exports & Admin Control)
* **Analytics & History Services**: `backend/app/services/analytics_service.py`, `backend/app/services/history_service.py`
* **Report & PDF/CSV Export Engine**: `backend/app/services/report_service.py`, `backend/app/services/export_service.py`
* **Admin System & Governance**: `backend/app/services/admin_service.py`, `backend/app/api/v1/admin.py`, `frontend/src/services/adminService.ts`, `frontend/src/app/(dashboard)/admin/page.tsx`
* **Milestone 3 Routers**: `backend/app/api/v1/analytics.py`, `backend/app/api/v1/history.py`, `backend/app/api/v1/reports.py`, `backend/app/api/v1/exports.py`
* **Frontend Pages & Charts**: `frontend/src/app/(dashboard)/analytics/page.tsx`, `frontend/src/app/(dashboard)/history/page.tsx`, `frontend/src/app/(dashboard)/reports/page.tsx`, `frontend/src/components/charts/`

---

## 🧠 Machine Learning Engine

YieldSense AI employs a modular machine learning pipeline built on `scikit-learn` and `joblib`.

### 1. Crop Recommendation (Classification)
* **Dataset**: `Crop_recommendation_processed.csv` (2,200 rows)
* **Goal**: Classify the optimal crop based on NPK, temperature, humidity, pH, and rainfall.
* **Algorithms Evaluated**: Logistic Regression, Decision Trees, Random Forest, KNN Classifier.
* **KNN Optimization**: Optimal parameter **$k=3$**.
* **Best Model**: **Random Forest** (Accuracy: **0.9932**, F1: 0.9932).

### 2. Crop Yield Prediction (Regression)
* **Dataset**: `yield_df_processed.csv` (25,932 rows, 114 columns)
* **Goal**: Predict yield in tons/hectare using environmental parameters, location, and crop category.
* **Algorithms Evaluated**: Linear Regression, Decision Trees, Random Forest Regressor, KNN Regressor.
* **KNN Optimization**: Optimal parameter **$k=2$**.
* **Best Model**: **KNN Regressor (tuned)** ($R^2$ Score: **0.9860**).

### 3. Agronomic Safety Overrides
Rule-based boundary layers prevent false positive predictions under extreme conditions:
* 🌧️ **Extreme Drought**: `annual_rainfall` < 50.0 mm
* 🌡️ **Extreme Temperature**: `temperature` < 5.0°C or > 48.0°C
* 🧪 **Extreme Soil pH**: `soil_ph` < 4.0 or > 9.5
* 📉 **Severe Nutrient Depletion**: N, P, K all < 5.0 kg/ha

---

## ⚙️ Project Setup & Configuration

### Prerequisites
* Python 3.10+
* Node.js 18+

### Running Locally

#### 1. Start Backend
```bash
cd backend
npm run dev
```
*(Runs uvicorn on http://localhost:8000)*

#### 2. Start Frontend
```bash
cd frontend
npm run dev
```
*(Runs Next.js development server on http://localhost:3000)*

---

## 🚀 Repository & Deployment Note

* **Active Development Branch**: `anubhab-mishra` (synced with `main`).
* **Multi-Tenant Security**: User datasets are isolated at the database query level (`user_id == uid`).
* **Admin Governance**: Dedicated role-based access control guarding `/admin`.
