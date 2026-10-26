import React from 'react';
import { Sliders, Cpu, IndianRupee, ArrowRight, ShieldCheck, Terminal, Layers } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Enter Trip Details',
      subtitle: 'Client-side parameter configuration',
      description:
        'The user inputs the trip parameters: distance in kilometres, trip duration in minutes, and the surge multiplier. Built-in validation guarantees strictly positive values and synchronized range sliders.',
      icon: Sliders,
      badge: 'React + TypeScript',
      color: 'from-taxi-yellow to-amber-500',
      glow: 'shadow-[0_0_30px_rgba(255,184,0,0.25)]',
    },
    {
      number: '02',
      title: 'ML Inference Engine',
      subtitle: 'FastAPI + scikit-learn pipeline',
      description:
        'The FastAPI backend receives the POST request, shapes a pandas DataFrame with the exact column order (Distance_km, Trip_Duration, Surge_Multiplier), and evaluates the preloaded 100-tree Random Forest Regressor.',
      icon: Cpu,
      badge: 'FastAPI + joblib',
      color: 'from-taxi-orange to-red-500',
      glow: 'shadow-[0_0_30px_rgba(255,138,0,0.25)]',
    },
    {
      number: '03',
      title: 'View Predicted Fare',
      subtitle: 'Instant spatial feedback',
      description:
        'The frontend renders the true model output formatted in Indian Rupees (INR) with an animated counter, feature breakdown cards, and logs the transaction to the local session history.',
      icon: IndianRupee,
      badge: '3D Spatial UI',
      color: 'from-amber-400 to-taxi-yellow',
      glow: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-taxi-yellow/10 border border-taxi-yellow/20 text-xs font-mono font-bold text-taxi-yellow mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture Flow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            How The Inference Pipeline Works
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-300">
            A clear, transparent walkthrough of how user parameters move from the 3D client interface to the trained model and back.
          </p>
        </div>

        {/* 3 Step Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-taxi-yellow/30 transition-all duration-300 flex flex-col justify-between relative group hover:-translate-y-2"
              >
                {/* Step Top */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-charcoal-950 font-black text-xl shadow-lg ${step.glow} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-7 h-7 stroke-[2.2]" />
                    </div>
                    <span className="font-mono text-3xl font-black text-white/20 group-hover:text-taxi-yellow/40 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-wider text-taxi-yellow font-bold block mb-1">
                    {step.subtitle}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Tech Badge */}
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="px-2.5 py-1 rounded-full bg-charcoal-900 border border-white/10">
                    {step.badge}
                  </span>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-taxi-yellow hidden md:block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Architecture Summary Box */}
        <div className="mt-12 glass-panel p-6 sm:p-7 rounded-3xl border border-white/10 bg-charcoal-900/60 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-charcoal-800 flex items-center justify-center text-taxi-yellow border border-white/5 flex-shrink-0">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                Zero Hardcoded Formulas
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                All numbers are produced strictly by executing <code className="text-taxi-yellow">model.predict(features)</code> on the 14MB saved scikit-learn binary.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 whitespace-nowrap">
            <ShieldCheck className="w-4 h-4" />
            <span>Pure ML Inference Guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
};
