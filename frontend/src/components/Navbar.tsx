import React, { useState, useEffect } from 'react';
import { Car, Activity, Sparkles, Cpu, Layers, Network, BarChart3, Scale } from 'lucide-react';
import { checkHealth } from '../services/api';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [modelOnline, setModelOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const verifyHealth = async () => {
      try {
        const res = await checkHealth();
        setModelOnline(res.model_loaded);
      } catch {
        setModelOnline(false);
      }
    };
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Car },
    { id: 'predict', label: 'Predict Fare', icon: Sparkles },
    { id: 'architecture', label: 'Architecture', icon: Network },
    { id: 'comparison', label: 'Comparison', icon: BarChart3 },
    { id: 'insights', label: 'Data Insights', icon: Scale },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'how-it-works', label: 'How It Works', icon: Layers },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className={`flex items-center justify-between px-5 py-2.5 rounded-full transition-all duration-300 ${
            isScrolled
              ? 'glass-panel shadow-glass border-white/10'
              : 'bg-charcoal-900/60 backdrop-blur-md border border-white/5'
          }`}
          aria-label="Main Navigation"
        >
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-taxi-yellow to-taxi-orange flex items-center justify-center shadow-taxi-glow group-hover:scale-105 transition-transform duration-200">
              <Car className="w-5 h-5 text-charcoal-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-lg text-white">
                  TAXI<span className="text-taxi-yellow">FARE</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-taxi-yellow/15 text-taxi-yellow border border-taxi-yellow/30">
                  ML 3D
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono hidden sm:block">
                Random Forest Inference
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-charcoal-950/40 p-1 rounded-full border border-white/5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-taxi-yellow text-charcoal-950 shadow-taxi-glow font-bold'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-charcoal-950' : 'text-gray-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Model Status Indicator & Action */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border ${
                modelOnline === true
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : modelOnline === false
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
              title={
                modelOnline === true
                  ? 'Model loaded in memory & ready for inference'
                  : 'Model offline or connecting'
              }
            >
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  modelOnline === true
                    ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                    : modelOnline === false
                    ? 'bg-rose-400 shadow-[0_0_8px_#f87171]'
                    : 'bg-amber-400'
                }`}
              />
              <span className="hidden sm:inline">
                {modelOnline === true ? 'RF Model Ready' : modelOnline === false ? 'API Offline' : 'Connecting'}
              </span>
            </div>

            <button
              onClick={() => onNavigate('predict')}
              className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-taxi-yellow to-taxi-orange text-charcoal-950 font-bold text-xs tracking-wide shadow-taxi-glow hover:brightness-110 active:scale-95 transition-all"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Predict Fare</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
