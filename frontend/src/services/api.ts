import axios from 'axios';

export interface PredictionRequest {
  Distance_km: number;
  Trip_Duration: number;
  Surge_Multiplier: number;
}

export interface PredictionResponse {
  predicted_fare: number;
  currency: string;
  features: {
    Distance_km: number;
    Trip_Duration: number;
    Surge_Multiplier: number;
  };
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await apiClient.get<HealthResponse>('/health');
  return response.data;
};

export const predictFare = async (
  request: PredictionRequest
): Promise<PredictionResponse> => {
  const response = await apiClient.post<PredictionResponse>('/predict', request);
  return response.data;
};
