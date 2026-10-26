import React, { useState } from 'react';
import {
  Workflow,
  FolderTree,
  FileSpreadsheet,
  Layers,
  GitBranch,
  Cpu,
  Zap,
  Database,
  Server,
  FileCode2,
  Network,
} from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'artifacts'>('pipeline');

  // ML Development Pipeline Stages (from Colab Notebook)
  const pipelineStages = [
    {
      step: '01',
      title: 'Dataset Ingestion',
      file: 'data/Cab_Fares.csv',
      detail: '49,230 rows × 21 columns of ride records collected across Indian metro cities.',
      icon: FileSpreadsheet,
      badge: 'Raw Data',
    },
    {
      step: '02',
      title: 'Data Cleaning & Prep',
      file: 'Notebook Steps 6–7',
      detail: 'Null value audits, datetime parsing, extracting ride hour, day, month, weekday, and fare grouping.',
      icon: Workflow,
      badge: 'Preprocessing',
    },
    {
      step: '03',
      title: 'Feature Selection',
      file: 'Notebook Steps 17 & 33',
      detail: 'Selected Distance_km, Trip_Duration, and Surge_Multiplier. Base_Fare intentionally excluded to build a real estimator.',
      icon: Layers,
      badge: '3 Features',
    },
    {
      step: '04',
      title: 'Train / Test Split',
      file: 'Notebook Step 18',
      detail: '80% training set (39,384 rides) and 20% holdout test set (9,846 rides) with random_state=42.',
      icon: GitBranch,
      badge: '80/20 Split',
    },
    {
      step: '05',
      title: 'Random Forest Training',
      file: 'Notebook Step 34',
      detail: 'Fitted RandomForestRegressor with n_estimators=100, max_depth=10, random_state=42, and n_jobs=-1.',
      icon: Cpu,
      badge: '100 Trees',
    },
    {
      step: '06',
      title: 'Empirical Evaluation',
      file: 'Notebook Step 39',
      detail: 'Evaluated on holdout set: R² = 0.9725, MAE = 26.0278, RMSE = 33.2361. Benchmark test ride: ₹191.13.',
      icon: Zap,
      badge: 'R² = 0.9725',
    },
    {
      step: '07',
      title: 'Model Persistence',
      file: 'Notebook Step 37',
      detail: 'Exported fitted model using joblib.dump() to taxi_fare_random_forest.pkl (14,366,737 bytes).',
      icon: Database,
      badge: '14.4 MB .pkl',
    },
    {
      step: '08',
      title: 'FastAPI Serving',
      file: 'backend/main.py',
      detail: 'Deserialized once into memory on API lifespan startup for sub-millisecond production inference.',
      icon: Server,
      badge: 'Live Production',
    },
  ];

  // Project Artifacts Map
  const artifacts = [
    {
      category: 'Source Dataset',
      badge: 'Raw CSV',
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      items: [
        {
          path: 'data/Cab_Fares.csv',
          size: '~6.8 MB',
          desc: 'Primary ride dataset with 49,230 rows and 21 columns including distance, duration, surge, and final fare.',
        },
      ],
    },
    {
      category: 'Model Development Notebook',
      badge: 'Jupyter / Colab',
      color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
      items: [
        {
          path: 'notebooks/Taxi_Fare_Prediction.ipynb',
          size: '39 Steps',
          desc: 'Complete exploratory data analysis, hypothesis testing, ANOVA, formula investigation, model training, and evaluation.',
        },
      ],
    },
    {
      category: 'Persisted Trained Model',
      badge: 'Serialized Binary',
      color: 'text-taxi-yellow border-taxi-yellow/30 bg-taxi-yellow/10',
      items: [
        {
          path: 'backend/models/taxi_fare_random_forest.pkl',
          size: '14.4 MB',
          desc: 'Pretrained 100-tree scikit-learn Random Forest Regressor serialized using joblib.dump().',
        },
      ],
    },
    {
      category: 'Backend Inference Service',
      badge: 'FastAPI + Python',
      color: 'text-taxi-orange border-taxi-orange/30 bg-taxi-orange/10',
      items: [
        {
          path: 'backend/main.py',
          size: 'Lifespan App',
          desc: 'FastAPI application with CORS, lifespan model pre-loading, and GET /health and POST /predict endpoints.',
        },
        {
          path: 'backend/prediction.py',
          size: 'Schemas & Logic',
          desc: 'Pydantic validation schemas and pandas feature-matrix builder enforcing exact column ordering.',
        },
        {
          path: 'backend/requirements.txt',
          size: 'Dependencies',
          desc: 'Pinned backend packages (fastapi, uvicorn, scikit-learn, joblib, pandas, numpy, pydantic).',
        },
      ],
    },
    {
      category: 'Frontend 3D Web Interface',
      badge: 'React 18 + Three.js',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      items: [
        {
          path: 'frontend/src/components/Taxi3DCanvas.tsx',
          size: 'Three.js Engine',
          desc: 'Procedural 3D taxi model with headlights, perspective road, rotating wheels, and parallax.',
        },
        {
          path: 'frontend/src/components/PredictionForm.tsx',
          size: 'Interactive Form',
          desc: 'Synchronized range sliders, 4 quick demo presets, and real-time input validation.',
        },
        {
          path: 'frontend/src/sections/ArchitectureSection.tsx',
          size: 'ML Pipeline UI',
          desc: 'Interactive ML lifecycle stages and artifact file explorer.',
        },
        {
          path: 'frontend/src/services/api.ts',
          size: 'Axios Client',
          desc: 'Typesafe API client connecting React frontend to the FastAPI backend at port 8000.',
        },
      ],
    },
  ];

  return (
    <section id="architecture" className="py-20 relative bg-charcoal-950/80 border-t border-b border-white/5">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-taxi-yellow/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-taxi-orange/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-taxi-yellow/10 border border-taxi-yellow/20 text-xs font-mono font-bold text-taxi-yellow mb-3">
            <Network className="w-3.5 h-3.5" />
            <span>Complete Technical Blueprint</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            Project Architecture & ML Pipeline
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
            Understand the complete lifecycle of the application: from offline model training on 49,230 rides to live inference across the FastAPI backend and 3D React interface.
          </p>

          {/* Interactive Navigation Switcher: Exactly 2 tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-8 p-1.5 rounded-2xl bg-charcoal-900 border border-white/10 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setActiveTab('pipeline')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
                activeTab === 'pipeline'
                  ? 'bg-taxi-yellow text-charcoal-950 shadow-taxi-glow font-extrabold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span>ML Pipeline</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('artifacts')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
                activeTab === 'artifacts'
                  ? 'bg-taxi-yellow text-charcoal-950 shadow-taxi-glow font-extrabold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Project Artifacts</span>
            </button>
          </div>
        </div>

        {/* TAB 1: ML MODEL DEVELOPMENT PIPELINE (8 Stages from Notebook) */}
        {activeTab === 'pipeline' && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-6">
              <p className="text-xs sm:text-sm text-gray-300">
                The 8 sequential stages conducted in <code className="text-taxi-yellow font-mono">notebooks/Taxi_Fare_Prediction.ipynb</code> leading to the finalized Random Forest model.
              </p>
            </div>

            {/* Horizontal Timeline Grid on Desktop, Vertical on Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {pipelineStages.map((stage, idx) => {
                const Icon = stage.icon;
                return (
                  <div
                    key={idx}
                    className="glass-panel p-5 rounded-3xl border border-white/10 hover:border-taxi-yellow/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
                  >
                    <div>
                      {/* Step Number & Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-charcoal-850 border border-white/5 flex items-center justify-center text-taxi-yellow group-hover:scale-105 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-mono font-bold text-gray-500 group-hover:text-taxi-yellow transition-colors">
                          Stage {stage.step}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono uppercase tracking-wider text-taxi-yellow font-bold block mb-1">
                        {stage.badge}
                      </span>
                      <h4 className="text-base font-bold text-white mb-2">
                        {stage.title}
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">
                        {stage.detail}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
                      <span>Source:</span>
                      <span className="text-gray-300 font-bold">{stage.file}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Formula Investigation Disclosure Card */}
            <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-charcoal-900/60 max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                  <Workflow className="w-5 h-5" />
                </div>
                <div className="text-xs space-y-1.5">
                  <h4 className="font-bold text-white text-sm">
                    Why Base_Fare Was Intentionally Excluded
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    Notebook Steps 31–33 verified that the synthetic dataset generated <code className="text-taxi-yellow font-mono">Final_Fare = Base_Fare × Surge_Multiplier</code> with an exact mathematical identity. If Base_Fare were retained as a feature, the model would merely multiply two numbers. By removing Base_Fare and using <code className="text-taxi-yellow font-mono">[Distance_km, Trip_Duration, Surge_Multiplier]</code>, the Random Forest learns the underlying cost surface and estimates fares directly from physical trip variables.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECT ARTIFACTS MAP (Interactive File Tree) */}
        {activeTab === 'artifacts' && (
          <div className="animate-fade-in space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-6">
              <p className="text-xs sm:text-sm text-gray-300">
                Repository structure distinguishing source dataset, Jupyter training notebook, serialized model, FastAPI service, and React frontend.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artifacts.map((cat, idx) => (
                <div
                  key={idx}
                  className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
                        {cat.category}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${cat.color}`}>
                        {cat.badge}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {cat.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className="p-3.5 rounded-2xl bg-charcoal-900/90 border border-white/5 hover:border-taxi-yellow/30 transition-all"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-xs font-bold text-white break-all">
                              {item.path}
                            </span>
                            <span className="text-[10px] font-mono text-taxi-yellow font-bold px-1.5 py-0.5 rounded bg-charcoal-950 ml-2 whitespace-nowrap">
                              {item.size}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Compact Terminal Verification Command Reference */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-charcoal-900/80 max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-taxi-yellow font-bold flex items-center gap-2">
                  <FileCode2 className="w-4 h-4" />
                  Terminal Verification Checks
                </span>
                <span className="text-[10px] font-mono text-gray-500">macOS Shell</span>
              </div>
              <div className="space-y-2 font-mono text-xs text-gray-300">
                <div className="p-3 rounded-xl bg-charcoal-950 border border-white/5 flex items-center justify-between">
                  <code>curl http://127.0.0.1:8000/health</code>
                  <span className="text-emerald-400">→ {"{\"status\":\"healthy\",\"model_loaded\":true}"}</span>
                </div>
                <div className="p-3 rounded-xl bg-charcoal-950 border border-white/5 flex items-center justify-between">
                  <code>POST /predict {"{\"Distance_km\":10,\"Trip_Duration\":30,\"Surge_Multiplier\":1.2}"}</code>
                  <span className="text-taxi-yellow font-bold">→ ₹191.13 INR</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
