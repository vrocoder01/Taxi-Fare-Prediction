"""
Taxi Fare Prediction API – FastAPI application entry-point.

Run with:
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from prediction import (
    PredictionRequest,
    PredictionResponse,
    get_model,
    load_model,
    predict_fare,
)

logger = logging.getLogger("taxi_fare_api")
logging.basicConfig(level=logging.INFO)

# ---------------------------------------------------------------------------
# Application lifespan – load model on startup
# ---------------------------------------------------------------------------


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the ML model into memory when the application starts."""
    try:
        load_model()
        logger.info("Model loaded successfully.")
    except Exception as exc:
        logger.error("Failed to load model: %s", exc)
    yield


# ---------------------------------------------------------------------------
# FastAPI application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Taxi Fare Prediction API",
    description="Predict taxi fares in INR based on distance, duration, and surge multiplier.",
    version="1.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS middleware – allow Vite dev-server origins
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.get("/health")
async def health_check():
    """Return service health status and whether the model is loaded."""
    model_loaded = get_model() is not None
    return {"status": "healthy", "model_loaded": model_loaded}


@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Predict the taxi fare for a given trip.

    Expects a JSON body with:
    - **Distance_km** (float, > 0): Trip distance in kilometres.
    - **Trip_Duration** (float, > 0): Trip duration in minutes.
    - **Surge_Multiplier** (float, >= 1.0): Surge pricing multiplier.

    Returns the predicted fare in INR along with the input features.
    """
    # Check that the model is available.
    if get_model() is None:
        raise HTTPException(
            status_code=503,
            detail="Model is not loaded. The service is not ready to make predictions.",
        )

    try:
        response = predict_fare(request)
    except Exception as exc:
        logger.exception("Prediction failed")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction error: {str(exc)}",
        )

    return response


# ---------------------------------------------------------------------------
# Standalone execution
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
