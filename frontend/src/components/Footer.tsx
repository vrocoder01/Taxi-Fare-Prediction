import React from 'react';
import { Car, Github, ShieldAlert, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-charcoal-950 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          {/* Logo & Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-taxi-yellow to-taxi-orange flex items-center justify-center text-charcoal-950 shadow-taxi-glow">
              <Car className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base text-white">
                TAXI<span className="text-taxi-yellow">FARE</span>.AI
              </span>
              <p className="text-xs text-gray-400 font-mono">
                Random Forest Regressor • scikit-learn & FastAPI
              </p>
            </div>
          </div>

          {/* Tech stack badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-gray-400">
            <span className="px-2.5 py-1 rounded-lg bg-charcoal-900 border border-white/5">
              Python 3.9
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-charcoal-900 border border-white/5 text-taxi-yellow">
              FastAPI
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-charcoal-900 border border-white/5">
              scikit-learn 1.6
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-charcoal-900 border border-white/5 text-sky-400">
              React 18
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-charcoal-900 border border-white/5 text-emerald-400">
              Three.js
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-charcoal-900 border border-white/5">
              Tailwind CSS
            </span>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-mono text-center sm:text-left">
          <p>
            Academic Machine Learning Demonstration • Not a commercial ride booking service.
          </p>
          <p className="text-gray-400">
            Target Features: <span className="text-taxi-yellow">Distance_km</span>, <span className="text-taxi-orange">Trip_Duration</span>, <span className="text-amber-400">Surge_Multiplier</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
