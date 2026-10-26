import React from 'react';
import { Compass, Clock, Zap, Sparkles, Loader2, BookmarkCheck } from 'lucide-react';
import { PredictionRequest } from '../services/api';

export interface PresetRide {
  id: string;
  name: string;
  tag: string;
  distance: number;
  duration: number;
  surge: number;
  description: string;
}

export const PRESETS: PresetRide[] = [
  {
    id: 'short',
    name: 'Short Ride',
    tag: 'Quick Commute',
    distance: 5,
    duration: 15,
    surge: 1.0,
    description: 'Quick local trip under standard traffic conditions',
  },
  {
    id: 'city',
    name: 'City Ride',
    tag: 'Urban Transit',
    distance: 10,
    duration: 30,
    surge: 1.2,
    description: 'Notebook reference benchmark (₹191.13)',
  },
  {
    id: 'long',
    name: 'Long Ride',
    tag: 'Airport / Suburb',
    distance: 25,
    duration: 60,
    surge: 1.5,
    description: 'Long distance highway trip with moderate demand',
  },
  {
    id: 'surge',
    name: 'High Surge',
    tag: 'Peak Hour',
    distance: 15,
    duration: 40,
    surge: 2.0,
    description: 'Severe weather or festival demand peak (2.0x)',
  },
];

interface PredictionFormProps {
  values: PredictionRequest;
  onChange: (field: keyof PredictionRequest, value: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onApplyPreset: (preset: PresetRide) => void;
  activePresetId?: string;
  loading: boolean;
  errorMessage?: string | null;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({
  values,
  onChange,
  onSubmit,
  onApplyPreset,
  activePresetId,
  loading,
  errorMessage,
}) => {
  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/10 shadow-glass">
      {/* Decorative top ambient glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-taxi-yellow/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-taxi-orange/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-taxi-yellow animate-ping" />
            <span className="text-xs uppercase tracking-widest font-mono text-taxi-yellow font-bold">
              Feature Workspace
            </span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">
            Trip Parameter Controls
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Adjust the 3 model features or choose a preset for immediate testing.
          </p>
        </div>
      </div>

      {/* Quick Demo Presets */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <BookmarkCheck className="w-3.5 h-3.5 text-taxi-yellow" />
            Quick Demo Presets
          </span>
          <span className="text-[11px] text-gray-500 font-mono">
            Click to auto-populate
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className={`p-3.5 rounded-2xl text-left transition-all duration-200 border relative group ${
                  isSelected
                    ? 'bg-taxi-yellow/15 border-taxi-yellow text-white shadow-taxi-glow'
                    : 'bg-charcoal-850/80 border-white/5 text-gray-300 hover:bg-charcoal-800 hover:border-taxi-yellow/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-taxi-yellow transition-colors">
                    {preset.name}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-taxi-yellow text-charcoal-950 font-bold'
                        : 'bg-charcoal-700 text-gray-400'
                    }`}
                  >
                    {preset.tag}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400 mt-1">
                  <span>{preset.distance}km</span>
                  <span>•</span>
                  <span>{preset.duration}m</span>
                  <span>•</span>
                  <span className="text-taxi-yellow font-semibold">{preset.surge}x</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Controls */}
      <form onSubmit={onSubmit} className="space-y-6 relative z-10">
        {/* Input 1: Distance */}
        <div className="p-5 rounded-2xl bg-charcoal-900/90 border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="distance-input"
              className="flex items-center gap-2 text-sm font-semibold text-gray-200"
            >
              <div className="w-8 h-8 rounded-lg bg-taxi-yellow/10 flex items-center justify-center text-taxi-yellow border border-taxi-yellow/20">
                <Compass className="w-4 h-4" />
              </div>
              <span>Distance</span>
              <span className="text-xs font-mono text-gray-500">(Distance_km)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="distance-input"
                type="number"
                min="0.5"
                max="150"
                step="0.1"
                value={values.Distance_km}
                onChange={(e) => onChange('Distance_km', parseFloat(e.target.value) || 0)}
                className="w-24 px-3 py-1.5 rounded-xl bg-charcoal-950 border border-white/15 text-white font-mono text-right text-sm font-bold focus:outline-none focus:border-taxi-yellow focus:ring-1 focus:ring-taxi-yellow"
                required
              />
              <span className="text-xs font-mono text-gray-400 w-6">km</span>
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="0.5"
            value={values.Distance_km}
            onChange={(e) => onChange('Distance_km', parseFloat(e.target.value))}
            className="w-full mt-2"
            aria-label="Distance in kilometres slider"
          />
          <div className="flex justify-between text-[11px] font-mono text-gray-500 mt-1.5">
            <span>1 km</span>
            <span>25 km</span>
            <span>50 km</span>
            <span>100 km</span>
          </div>
        </div>

        {/* Input 2: Trip Duration */}
        <div className="p-5 rounded-2xl bg-charcoal-900/90 border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="duration-input"
              className="flex items-center gap-2 text-sm font-semibold text-gray-200"
            >
              <div className="w-8 h-8 rounded-lg bg-taxi-orange/10 flex items-center justify-center text-taxi-orange border border-taxi-orange/20">
                <Clock className="w-4 h-4" />
              </div>
              <span>Trip Duration</span>
              <span className="text-xs font-mono text-gray-500">(Trip_Duration)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="duration-input"
                type="number"
                min="1"
                max="300"
                step="1"
                value={values.Trip_Duration}
                onChange={(e) => onChange('Trip_Duration', parseFloat(e.target.value) || 0)}
                className="w-24 px-3 py-1.5 rounded-xl bg-charcoal-950 border border-white/15 text-white font-mono text-right text-sm font-bold focus:outline-none focus:border-taxi-yellow focus:ring-1 focus:ring-taxi-yellow"
                required
              />
              <span className="text-xs font-mono text-gray-400 w-6">min</span>
            </div>
          </div>
          <input
            type="range"
            min="2"
            max="180"
            step="1"
            value={values.Trip_Duration}
            onChange={(e) => onChange('Trip_Duration', parseFloat(e.target.value))}
            className="w-full mt-2"
            aria-label="Trip duration in minutes slider"
          />
          <div className="flex justify-between text-[11px] font-mono text-gray-500 mt-1.5">
            <span>2 min</span>
            <span>45 min</span>
            <span>90 min</span>
            <span>180 min</span>
          </div>
        </div>

        {/* Input 3: Surge Multiplier */}
        <div className="p-5 rounded-2xl bg-charcoal-900/90 border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="surge-input"
              className="flex items-center gap-2 text-sm font-semibold text-gray-200"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                <Zap className="w-4 h-4" />
              </div>
              <span>Surge Multiplier</span>
              <span className="text-xs font-mono text-gray-500">(Surge_Multiplier)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="surge-input"
                type="number"
                min="1.0"
                max="5.0"
                step="0.1"
                value={values.Surge_Multiplier}
                onChange={(e) => onChange('Surge_Multiplier', parseFloat(e.target.value) || 1.0)}
                className="w-24 px-3 py-1.5 rounded-xl bg-charcoal-950 border border-white/15 text-white font-mono text-right text-sm font-bold focus:outline-none focus:border-taxi-yellow focus:ring-1 focus:ring-taxi-yellow"
                required
              />
              <span className="text-xs font-mono text-gray-400 w-6">x</span>
            </div>
          </div>
          <input
            type="range"
            min="1.0"
            max="3.5"
            step="0.05"
            value={values.Surge_Multiplier}
            onChange={(e) => onChange('Surge_Multiplier', parseFloat(e.target.value))}
            className="w-full mt-2"
            aria-label="Surge multiplier slider"
          />
          <div className="flex justify-between text-[11px] font-mono text-gray-500 mt-1.5">
            <span>1.0x (Standard)</span>
            <span>1.5x (Busy)</span>
            <span>2.0x (Peak)</span>
            <span>3.5x (Extreme)</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm font-medium flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Predict Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-taxi-yellow via-amber-400 to-taxi-orange text-charcoal-950 font-extrabold text-base tracking-wider uppercase shadow-taxi-glow-lg hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-charcoal-950" />
              <span>Running Inference on RF Model...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-charcoal-950 group-hover:rotate-12 transition-transform" />
              <span>PREDICT FARE</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
