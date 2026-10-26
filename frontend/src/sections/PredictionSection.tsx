import React, { useState } from 'react';
import { PredictionForm, PRESETS, PresetRide } from '../components/PredictionForm';
import { PredictionResult } from '../components/PredictionResult';
import { PredictionHistory, HistoryItem } from '../components/PredictionHistory';
import { PredictionRequest, PredictionResponse, predictFare } from '../services/api';

export const PredictionSection: React.FC = () => {
  const [formValues, setFormValues] = useState<PredictionRequest>({
    Distance_km: 10,
    Trip_Duration: 30,
    Surge_Multiplier: 1.2,
  });

  const [activePresetId, setActivePresetId] = useState<string>('city');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = sessionStorage.getItem('taxi_fare_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleFieldChange = (field: keyof PredictionRequest, value: number) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    setActivePresetId(''); // clear preset when user customises values
  };

  const handleApplyPreset = (preset: PresetRide) => {
    setActivePresetId(preset.id);
    setFormValues({
      Distance_km: preset.distance,
      Trip_Duration: preset.duration,
      Surge_Multiplier: preset.surge,
    });
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (formValues.Distance_km <= 0) {
      setErrorMessage('Distance must be greater than 0 km.');
      return;
    }
    if (formValues.Trip_Duration <= 0) {
      setErrorMessage('Trip duration must be greater than 0 minutes.');
      return;
    }
    if (formValues.Surge_Multiplier < 1.0) {
      setErrorMessage('Surge multiplier cannot be less than 1.0x.');
      return;
    }

    setLoading(true);

    try {
      const response = await predictFare(formValues);
      setResult(response);

      // Append to history
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        predicted_fare: response.predicted_fare,
        currency: response.currency,
        distance: response.features.Distance_km,
        duration: response.features.Trip_Duration,
        surge: response.features.Surge_Multiplier,
        timestamp: new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setHistory((prev) => {
        const updated = [newHistoryItem, ...prev.slice(0, 9)];
        try {
          sessionStorage.setItem('taxi_fare_history', JSON.stringify(updated));
        } catch {
          // ignore storage error
        }
        return updated;
      });
    } catch (err: any) {
      const serverMessage =
        err?.response?.data?.detail ||
        err?.message ||
        'Failed to connect to the prediction backend. Ensure FastAPI is running on port 8000.';
      setErrorMessage(
        typeof serverMessage === 'string'
          ? serverMessage
          : JSON.stringify(serverMessage)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setFormValues({
      Distance_km: item.distance,
      Trip_Duration: item.duration,
      Surge_Multiplier: item.surge,
    });
    setActivePresetId('');
    setErrorMessage(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      sessionStorage.removeItem('taxi_fare_history');
    } catch {
      // ignore
    }
  };

  return (
    <section id="predict" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taxi-yellow/10 border border-taxi-yellow/20 text-xs font-mono font-bold text-taxi-yellow mb-3">
            <span>Interactive Fare Engine</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Live Prediction Workspace
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-400">
            Submit trip attributes to run real-time inference against the trained scikit-learn Random Forest model via FastAPI.
          </p>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: 7 cols */}
          <div className="lg:col-span-7">
            <PredictionForm
              values={formValues}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
              onApplyPreset={handleApplyPreset}
              activePresetId={activePresetId}
              loading={loading}
              errorMessage={errorMessage}
            />
          </div>

          {/* Right Result & History: 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            <PredictionResult result={result} onReset={handleReset} />
            <PredictionHistory
              history={history}
              onSelect={handleSelectHistoryItem}
              onClear={handleClearHistory}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
