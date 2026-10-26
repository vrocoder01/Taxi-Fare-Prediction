"""
Prediction module for the Taxi Fare Prediction API.

Handles model loading, input validation via Pydantic models,
and fare prediction using a trained RandomForestRegressor.
"""

import os
from typing import Dict

import joblib
import numpy as np
import pandas as pd
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Pydantic request / response schemas
# ---------------------------------------------------------------------------


class PredictionRequest(BaseModel):
    """Schema for incoming prediction requests."""

    Distance_km: float = Field(
        ...,
        gt=0,
        description="Trip distance in kilometres (must be > 0)",
    )
    Trip_Duration: float = Field(
        ...,
        gt=0,
        description="Trip duration in minutes (must be > 0)",
    )
    Surge_Multiplier: float = Field(
        ...,
        ge=1.0,
        description="Surge pricing multiplier (must be >= 1.0)",
    )


class PredictionResponse(BaseModel):
    """Schema for prediction results."""

    predicted_fare: float = Field(
        ...,
        description="Predicted fare in INR",
    )
    currency: str = Field(
        default="INR",
        description="Currency code for the predicted fare",
    )
    features: Dict[str, float] = Field(
        ...,
        description="Input features used for the prediction",
    )


# ---------------------------------------------------------------------------
# Model loading
# ---------------------------------------------------------------------------

# Module-level reference so the model is loaded once and reused.
_model = None


def load_model():
    """
    Load the trained RandomForestRegressor from disk.

    The model pickle is expected at ``models/taxi_fare_random_forest.pkl``
    relative to the *backend* directory (i.e. the directory containing this
    file).

    Returns
    -------
    sklearn.ensemble.RandomForestRegressor
        The deserialised model object.
    """
    global _model

    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "models", "taxi_fare_random_forest.pkl")

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model file not found at {model_path}. "
            "Ensure the trained model has been placed in the 'models/' directory."
        )

    _model = joblib.load(model_path)
    return _model


def get_model():
    """Return the currently loaded model instance (or ``None``)."""
    return _model


# ---------------------------------------------------------------------------
# Prediction logic
# ---------------------------------------------------------------------------


def predict_fare(request: PredictionRequest) -> PredictionResponse:
    """
    Run a fare prediction using the loaded model.

    Parameters
    ----------
    request : PredictionRequest
        Validated input features.

    Returns
    -------
    PredictionResponse
        The predicted fare along with the input features.

    Raises
    ------
    RuntimeError
        If the model has not been loaded yet.
    """
    if _model is None:
        raise RuntimeError(
            "Model is not loaded. Call load_model() before making predictions."
        )

    # Build a DataFrame with columns in the exact order the model expects.
    features = pd.DataFrame(
        [
            {
                "Distance_km": request.Distance_km,
                "Trip_Duration": request.Trip_Duration,
                "Surge_Multiplier": request.Surge_Multiplier,
            }
        ],
        columns=["Distance_km", "Trip_Duration", "Surge_Multiplier"],
    )

    prediction = _model.predict(features)
    predicted_fare = round(float(prediction[0]), 2)

    return PredictionResponse(
        predicted_fare=predicted_fare,
        currency="INR",
        features={
            "Distance_km": request.Distance_km,
            "Trip_Duration": request.Trip_Duration,
            "Surge_Multiplier": request.Surge_Multiplier,
        },
    )
