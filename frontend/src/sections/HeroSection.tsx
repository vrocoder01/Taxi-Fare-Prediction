import React from 'react';
import { ArrowDown, Sparkles, Activity, ShieldCheck, Compass, Clock, Zap } from 'lucide-react';
import { Taxi3DCanvas } from '../components/Taxi3DCanvas';

interface HeroSectionProps {
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  return (
    <section
      id="overview"
      className="relative min-h-screen pt-24 pb-16 flex flex-col justify-center overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-taxi-yellow/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-taxi-orange/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-charcoal-900 border border-taxi-yellow/30 shadow-taxi-glow text-xs font-mono font-bold tracking-wide text-taxi-yellow mb-6">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Automotive Machine Learning Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
            Predict the Journey. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-taxi-yellow via-amber-300 to-taxi-orange">
              Know the Fare.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl mx-auto">
            An intelligent fare estimation experience powered by machine learning. Explore how distance, trip duration, and surge multiplier influence predicted taxi fares.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-taxi-yellow to-taxi-orange text-charcoal-950 font-extrabold text-sm tracking-wider uppercase shadow-taxi-glow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2.5 group"
            >
              <span>Explore Fare Prediction</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>

            <a
              href="#analytics"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-panel text-gray-300 hover:text-white hover:border-white/20 font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4 text-taxi-yellow" />
              <span>Model Analytics (R² 0.9725)</span>
            </a>
          </div>
        </div>

        {/* 3D Scene Viewport with Floating Telemetry Badges */}
        <div className="relative w-full max-w-5xl mx-auto h-[440px] sm:h-[520px] rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl">
          {/* Subtle 3D Instructions */}
          <div className="absolute top-4 left-5 z-20 flex items-center gap-2 font-mono text-[11px] text-gray-400 bg-charcoal-950/80 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-taxi-yellow animate-pulse" />
            <span>Interactive 3D Engine • Move cursor to orbit view</span>
          </div>

          <div className="absolute top-4 right-5 z-20 flex items-center gap-2 font-mono text-[11px] text-taxi-yellow bg-charcoal-950/80 px-3 py-1.5 rounded-full border border-taxi-yellow/20 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Random Forest Regressor</span>
          </div>

          {/* 3D Three.js Simulation */}
          <Taxi3DCanvas className="w-full h-full" />

          {/* Floating Telemetry Glass Badges */}
          <div className="absolute bottom-5 left-5 right-5 z-20 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pointer-events-none">
            <div className="glass-panel p-3 rounded-2xl border border-white/10 pointer-events-auto backdrop-blur-xl">
              <div className="flex items-center gap-1.5 text-taxi-yellow text-[11px] font-mono mb-0.5">
                <Compass className="w-3.5 h-3.5" />
                <span>PRIMARY DRIVER</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white font-mono">
                Distance_km
              </div>
              <div className="text-[10px] text-gray-400 font-mono">
                74.26% Model Weight
              </div>
            </div>

            <div className="glass-panel p-3 rounded-2xl border border-white/10 pointer-events-auto backdrop-blur-xl">
              <div className="flex items-center gap-1.5 text-taxi-orange text-[11px] font-mono mb-0.5">
                <Zap className="w-3.5 h-3.5" />
                <span>DEMAND SCALER</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white font-mono">
                Surge_Multiplier
              </div>
              <div className="text-[10px] text-gray-400 font-mono">
                25.57% Model Weight
              </div>
            </div>

            <div className="glass-panel p-3 rounded-2xl border border-white/10 pointer-events-auto backdrop-blur-xl">
              <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-mono mb-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>TRAFFIC FACTOR</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white font-mono">
                Trip_Duration
              </div>
              <div className="text-[10px] text-gray-400 font-mono">
                0.16% Model Weight
              </div>
            </div>

            <div className="glass-panel p-3 rounded-2xl border border-taxi-yellow/30 pointer-events-auto backdrop-blur-xl bg-charcoal-900/90">
              <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-mono mb-0.5">
                <Activity className="w-3.5 h-3.5" />
                <span>ACCURACY METRIC</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-taxi-yellow font-mono">
                R² = 0.9725
              </div>
              <div className="text-[10px] text-gray-400 font-mono">
                MAE: 26.02 • 9,846 Test
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
