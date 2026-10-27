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

export interface CorrelationCell {
  row: string;
  col: string;
  correlation: number;
  strength: string;
  direction: string;
}

export interface TargetInsight {
  feature: string;
  r: number;
  r_squared_pct: number;
  strength: string;
  direction: string;
  interpretation: string;
  simple_words: string;
  note?: string;
}

export interface HypothesisTestA {
  id: string;
  title: string;
  research_question: string;
  h0: string;
  h1: string;
  alpha: number;
  test_type: string;
  sample_size: number;
  sample_size_str: string;
  r: number;
  t_statistic: number;
  degrees_of_freedom: number;
  p_value: number;
  p_value_formatted: string;
  decision: string;
  decision_label: string;
  is_significant: boolean;
  conclusion: string;
  practical_meaning: string;
  simple_words: string;
  presentation_bullet: string;
}

export interface HypothesisTestB {
  id: string;
  title: string;
  research_question: string;
  group_variable: string;
  median_split_value: number;
  group_short: {
    label: string;
    condition: string;
    sample_size: number;
    mean: number;
    std: number;
  };
  group_long: {
    label: string;
    condition: string;
    sample_size: number;
    mean: number;
    std: number;
  };
  mean_difference: number;
  ci_95_lower: number;
  ci_95_upper: number;
  t_statistic: number;
  degrees_of_freedom: number;
  p_value: number;
  p_value_formatted: string;
  cohens_d: number;
  cohens_d_interpretation: string;
  alpha: number;
  test_type: string;
  decision: string;
  decision_label: string;
  is_significant: boolean;
  conclusion: string;
  practical_meaning: string;
  simple_words: string;
  presentation_bullet: string;
}

export interface ScatterPoint {
  x: number;
  y: number;
  trend?: number;
  count?: number;
}

export interface StatisticsResponse {
  summary: {
    clean_records: number;
    total_raw_records: number;
    missing_values_dropped: number;
    numerical_features_count: number;
    features_evaluated: string[];
    strongest_positive_predictor: {
      feature: string;
      r: number;
      strength: string;
      note: string;
    };
    strongest_negative_predictor: {
      feature: string;
      r: number;
      strength: string;
      note: string;
    };
    statistically_significant_tests: number;
    dataset_name: string;
  };
  correlation_analysis: {
    core_features: string[];
    matrix: Record<string, Record<string, number>>;
    heatmap_data: CorrelationCell[];
    target_insights: TargetInsight[];
    formula_investigation: {
      formula: string;
      exact_match: boolean;
      max_deviation: number;
      explanation: string;
    };
    scatter_trends: {
      distance: {
        feature: string;
        slope: number;
        intercept: number;
        points: ScatterPoint[];
      };
      duration: {
        feature: string;
        slope: number;
        intercept: number;
        points: ScatterPoint[];
      };
      surge: {
        feature: string;
        points: ScatterPoint[];
      };
    };
  };
  hypothesis_testing: {
    test_a: HypothesisTestA;
    test_b: HypothesisTestB;
  };
  methodology: {
    dataset: string;
    correlation_method: string;
    two_sample_test: string;
    significance_threshold: string;
    median_partition: string;
    causality_caveat: string;
    synthetic_disclaimer: string;
  };
  presentation_notes: string[];
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

export const fetchStatistics = async (): Promise<StatisticsResponse> => {
  const response = await apiClient.get<StatisticsResponse>('/statistics');
  return response.data;
};
