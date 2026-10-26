import React, { useEffect, useState } from 'react';
import { IndianRupee, RotateCcw, AlertCircle, Compass, Clock, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PredictionResponse } from '../services/api';

interface PredictionResultProps {
  result: PredictionResponse | null;
  onReset: () => void;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({ result, onReset }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!result) return;

    // Trigger celebratory confetti burst on successful prediction
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FFB800', '#FF8A00', '#ffffff', '#F59E0B'],
      });
    } catch {
      // ignore
    }

    // Number counter animation from 0 to target
    const target = result.predicted_fare;
    const duration = 900;
    const startTime = performance.now();

    const animateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = easeProgress * target;
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      } else {
        setDisplayValue(target);
      }
    };

    requestAnimationFrame(animateNumber);
  }, [result]);

  if (!result) {
    return (
      <div className="glass-panel rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center text-center h-full min-h-[380px]">
        <div className="w-16 h-16 rounded-2xl bg-charcoal-850 flex items-center justify-center text-gray-500 mb-4 border border-white/5">
          <IndianRupee className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h4 className="text-lg font-bold text-gray-300">Awaiting Trip Parameters</h4>
        <p className="text-sm text-gray-500 max-w-xs mt-1.5 leading-relaxed">
          Configure distance, duration, and surge multiplier on the left, then click{' '}
          <span className="text-taxi-yellow font-semibold">PREDICT FARE</span> to view the model's estimate.
        </p>
      </div>
    );
  }

  const timestamp = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between h-full border border-taxi-yellow/30 shadow-taxi-glow animate-fade-in">
      {/* Top Banner */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-taxi-yellow" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-taxi-yellow">
              Inference Complete
            </span>
          </div>
          <span className="text-[11px] font-mono text-gray-400">
            {timestamp}
          </span>
        </div>

        {/* Primary Fare Display */}
        <div className="text-center py-6">
          <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
            Estimated Taxi Fare
          </span>
          <div className="flex items-baseline justify-center gap-1 mt-2 mb-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-taxi-yellow font-mono">
              ₹
            </span>
            <span className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tight text-glow-yellow">
              {displayValue.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-gray-400 font-bold ml-1">
              INR
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Calculated via Random Forest Regressor trained on 49,230 trip records.
          </p>
        </div>

        {/* Feature Breakdown Pills */}
        <div className="grid grid-cols-3 gap-3 my-6">
          <div className="p-3 rounded-xl bg-charcoal-900/90 border border-white/5 text-center">
            <div className="flex items-center justify-center text-taxi-yellow mb-1">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] text-gray-400 uppercase font-mono block">Distance</span>
            <span className="text-sm font-bold text-white font-mono">
              {result.features.Distance_km} km
            </span>
          </div>

          <div className="p-3 rounded-xl bg-charcoal-900/90 border border-white/5 text-center">
            <div className="flex items-center justify-center text-taxi-orange mb-1">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] text-gray-400 uppercase font-mono block">Duration</span>
            <span className="text-sm font-bold text-white font-mono">
              {result.features.Trip_Duration} min
            </span>
          </div>

          <div className="p-3 rounded-xl bg-charcoal-900/90 border border-white/5 text-center">
            <div className="flex items-center justify-center text-amber-400 mb-1">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] text-gray-400 uppercase font-mono block">Surge</span>
            <span className="text-sm font-bold text-white font-mono">
              {result.features.Surge_Multiplier}x
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer & Action */}
      <div className="pt-4 border-t border-white/10 space-y-4">
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-charcoal-950/70 border border-amber-500/20 text-gray-400 text-xs">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="text-amber-300 font-semibold">Model Disclaimer:</span> Estimated fare generated by a machine learning model. Actual taxi fares may differ.
          </p>
        </div>

        <button
          onClick={onReset}
          className="w-full py-3 px-4 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-gray-200 font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 border border-white/10"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Adjust & Predict Another Trip</span>
        </button>
      </div>
    </div>
  );
};
