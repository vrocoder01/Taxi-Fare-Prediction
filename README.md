# Taxi Fare Prediction — Premium 3D Machine Learning Web Application

An end-to-end Machine Learning web application predicting taxi fares in Indian Rupees (INR) using a pre-trained **Random Forest Regressor** model integrated with a **FastAPI** backend and an immersive **React + Vite + Three.js** 3D automotive frontend.

> **Important Objective:** This is an intelligent machine learning demonstration for fare prediction based on trip attributes. It is not a ride booking, dispatch, or payment website.

---

## 1. Machine Learning Model & Evaluation

The predictive engine uses the model trained in `notebooks/Taxi_Fare_Prediction.ipynb` and stored in `backend/models/taxi_fare_random_forest.pkl`.

* **Algorithm:** `RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)`
* **Dataset Size:** 49,230 rides (Cab_Fares.csv)
* **Holdout Test Set:** 9,846 rides (20% split)
* **Target Variable:** `Final_Fare` (INR)

### Model Input Features (Exact Order)
1. `Distance_km` (Float, > 0) — Trip distance in kilometres
2. `Trip_Duration` (Float, > 0) — Trip duration in minutes
3. `Surge_Multiplier` (Float, >= 1.0) — Demand pricing multiplier

*(Note: `Base_Fare` is intentionally excluded from the model input features as per project specification).*

### Evaluation Metrics
| Metric | Value |
|---|---|
| **R² Determination Score** | **0.9725** |
| **Mean Absolute Error (MAE)** | **26.0278** |
| **Mean Squared Error (MSE)** | **1104.6409** |
| **Root Mean Squared Error (RMSE)** | **33.2361** |

### Feature Importance
| Feature | Model Importance |
|---|---|
| `Distance_km` | **74.26%** |
| `Surge_Multiplier` | **25.57%** |
| `Trip_Duration` | **0.16%** |

### Dataset Disclosure
> **Disclaimer:** This application is a machine learning demonstration. The dataset contains a synthetic fare relationship, and its predictions have not been validated against real-world taxi trips. Predictions are estimates, not guaranteed prices.

---

## 2. Project Directory Structure

```
Taxi_Fare_Prediction/
├── backend/
│   ├── main.py                     # FastAPI application & CORS setup
│   ├── prediction.py               # Pydantic schemas & joblib model loading
│   ├── requirements.txt            # Python dependencies
│   ├── venv/                       # Python virtual environment
│   └── models/
│       └── taxi_fare_random_forest.pkl   # Pretrained 14MB model
├── data/
│   └── Cab_Fares.csv               # 49,230-row ride dataset
├── docs/
├── frontend/
│   ├── index.html                  # HTML entry point
│   ├── package.json                # React, Three.js, Recharts, Tailwind
│   ├── tailwind.config.js          # Custom taxi-yellow / charcoal theme
│   ├── vite.config.ts              # Vite configuration
│   └── src/
│       ├── components/
│       │   ├── Navbar.tsx          # Floating glassmorphism navbar
│       │   ├── Taxi3DCanvas.tsx    # Three.js 3D taxi & perspective road
│       │   ├── PredictionForm.tsx  # Sliders, numeric inputs & 4 presets
│       │   ├── PredictionResult.tsx# Animated counter & INR fare card
│       │   ├── PredictionHistory.tsx# Session history & load action
│       │   └── Footer.tsx          # Tech stack & academic disclaimer
│       ├── sections/
│       │   ├── HeroSection.tsx     # Full-screen 3D cinematic opening
│       │   ├── PredictionSection.tsx # Live interactive prediction workspace
│       │   ├── ArchitectureSection.tsx # End-to-end architecture & ML pipeline
│       │   ├── ModelComparisonSection.tsx # 5-algorithm benchmark comparison
│       │   ├── AnalyticsSection.tsx# Metrics cards, charts & disclaimers
│       │   └── HowItWorksSection.tsx # 3-step pipeline explanation
│       ├── services/
│       │   └── api.ts              # Axios client (/health and /predict)
│       ├── App.tsx                 # Root application component
│       ├── main.tsx                # React DOM mount
│       └── index.css               # Tailwind & custom glass styles
├── notebooks/
│   └── Taxi_Fare_Prediction.ipynb  # Original Colab ML notebook
└── README.md
```

---

## 3. Quickstart & Run Instructions (macOS)

### Prerequisites
* Python 3.9+ installed
* Node.js v18+ and npm installed

---

### Step 1: Start the FastAPI Backend

Open a new terminal window:

```bash
cd ~/Desktop/Taxi_Fare_Prediction/backend

# Activate the virtual environment (created during setup)
source venv/bin/activate

# Or install dependencies if setting up a fresh environment:
# pip install -r requirements.txt

# Start the uvicorn API server
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Verify backend health in another terminal:
```bash
curl http://127.0.0.1:8000/health
# Output: {"status":"healthy","model_loaded":true}
```

---

### Step 2: Start the React + Vite Frontend

Open a second terminal window:

```bash
cd ~/Desktop/Taxi_Fare_Prediction/frontend

# Install dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```

Open your browser at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 4. API Documentation

### `GET /health`
Returns service status and confirms model availability in memory.
* **Response:**
  ```json
  {
    "status": "healthy",
    "model_loaded": true
  }
  ```

### `POST /predict`
Runs inference against the loaded Random Forest Regressor.
* **Request:**
  ```json
  {
    "Distance_km": 10.0,
    "Trip_Duration": 30.0,
    "Surge_Multiplier": 1.2
  }
  ```
* **Response:**
  ```json
  {
    "predicted_fare": 191.13,
    "currency": "INR",
    "features": {
      "Distance_km": 10.0,
      "Trip_Duration": 30.0,
      "Surge_Multiplier": 1.2
    }
  }
  ```

---

## 5. Verified Demonstration Presets

| Preset | Distance | Duration | Surge | Actual Model Prediction |
|---|---|---|---|---|
| **Short Ride** | 5 km | 15 min | 1.0x | **₹98.06 INR** |
| **City Ride** | 10 km | 30 min | 1.2x | **₹191.13 INR** *(Benchmark)* |
| **Long Ride** | 25 km | 60 min | 1.5x | **₹495.84 INR** |
| **High Surge** | 15 km | 40 min | 2.0x | **₹444.89 INR** |
