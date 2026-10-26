import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Activity,
  Database,
  CheckCircle2,
  AlertTriangle,
  Layers,
  BarChart3,
  TrendingUp,
  Info,
  Sliders,
} from 'lucide-react';

export const AnalyticsSection: React.FC = () => {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // Empirical Feature Importance Data from Colab Notebook
  const featureData = [
    {
      name: 'Distance_km',
      displayName: 'Distance (km)',
      importance: 74.26,
      fill: '#FFB800',
      description: 'Primary driver of taxi fare — accounts for 74.26% of model splits',
      role: 'Primary Predictor',
    },
    {
      name: 'Surge_Multiplier',
      displayName: 'Surge Multiplier',
      importance: 25.57,
      fill: '#FF8A00',
      description: 'Dynamic demand multiplier — accounts for 25.57% of model splits',
      role: 'Demand Scaler',
    },
    {
      name: 'Trip_Duration',
      displayName: 'Trip Duration (min)',
      importance: 0.16,
      fill: '#38BDF8',
      description: 'Minor direct reliance — 0.16% weight after distance correlation',
      role: 'Traffic Factor',
    },
  ];

  // Evaluation Metrics
  const metrics = [
    {
      label: 'R² Determination Score',
      value: '0.9725',
      caption: '97.25% variance explained on test set',
      icon: TrendingUp,
      color: 'text-taxi-yellow',
      badge: 'High Accuracy',
    },
    {
      label: 'Mean Absolute Error (MAE)',
      value: '₹26.03',
      caption: 'Average absolute fare deviation (26.0278)',
      icon: Activity,
      color: 'text-emerald-400',
      badge: 'Holdout Metric',
    },
    {
      label: 'Root Mean Squared Error (RMSE)',
      value: '₹33.24',
      caption: 'Penalises larger outliers in test rides (33.2361)',
      icon: BarChart3,
      color: 'text-sky-400',
      badge: 'Residual Spread',
    },
    {
      label: 'Holdout Test Size',
      value: '9,846',
      caption: '20% holdout split from 49,230 dataset',
      icon: Database,
      color: 'text-purple-400',
      badge: '39,384 Train',
    },
  ];

  // Custom Tooltip that renders cleanly without obstructing the bars or labels
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-panel p-3.5 rounded-xl border border-taxi-yellow/40 shadow-xl bg-charcoal-900/95 text-xs max-w-xs pointer-events-none backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="font-bold text-white font-mono text-sm">
              {data.displayName}
            </span>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
              style={{ backgroundColor: `${data.fill}25`, color: data.fill }}
            >
              {data.role}
            </span>
          </div>
          <div className="text-lg font-black font-mono text-taxi-yellow my-0.5">
            {data.importance.toFixed(2)}%
          </div>
          <p className="text-[11px] text-gray-300 leading-snug">
            {data.description}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="analytics" className="py-20 relative bg-charcoal-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-taxi-yellow/10 border border-taxi-yellow/20 text-xs font-mono font-bold text-taxi-yellow mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Evaluation & Explainability</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Model Performance & Analytics
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
            Empirical evaluation results from the trained Random Forest Regressor (100 estimators, max depth 10) evaluated on the 9,846-ride test split.
          </p>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                    {m.label}
                  </span>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
                <div className="text-3xl font-black font-mono tracking-tight text-white mb-1.5">
                  {m.value}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                  <span className="text-[11px] text-gray-400 font-mono">
                    {m.caption}
                  </span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-gray-300">
                    {m.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts & Interpretability Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Feature Importance Bar Chart: 7 cols */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Model Feature Importance</span>
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-taxi-yellow/10 text-taxi-yellow border border-taxi-yellow/20">
                  Gini Split Weight
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-6">
                Relative reliance of the 100 decision trees on each input feature. Hover over or review the explicit values below.
              </p>

              {/* Chart container with safe height and generous margins */}
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={featureData}
                    margin={{ top: 15, right: 75, left: 25, bottom: 10 }}
                    onMouseMove={(state) => {
                      if (state.activePayload && state.activePayload.length) {
                        setHoveredFeature(state.activePayload[0].payload.name);
                      }
                    }}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    <XAxis
                      type="number"
                      domain={[0, 85]}
                      tickFormatter={(v) => `${v}%`}
                      stroke="#4B5563"
                      fontSize={11}
                      fontFamily="monospace"
                    />
                    <YAxis
                      dataKey="displayName"
                      type="category"
                      stroke="#9CA3AF"
                      fontSize={12}
                      fontFamily="monospace"
                      width={130}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: 'rgba(255, 184, 0, 0.05)' }}
                      wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}
                    />
                    <Bar
                      dataKey="importance"
                      radius={[0, 8, 8, 0]}
                      barSize={28}
                      label={{
                        position: 'right',
                        formatter: (val: number) => ` ${val.toFixed(2)}%`,
                        fill: '#FFFFFF',
                        fontSize: 12,
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                      }}
                    >
                      {featureData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          opacity={hoveredFeature ? (hoveredFeature === entry.name ? 1 : 0.45) : 0.95}
                          className="transition-opacity duration-200 cursor-pointer"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Summary pills below the chart for immediate clarity */}
              <div className="grid grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-white/5">
                {featureData.map((f) => (
                  <div
                    key={f.name}
                    className="p-2.5 rounded-xl bg-charcoal-900/80 border border-white/5 text-center"
                  >
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: f.fill }}
                      />
                      <span className="text-[11px] font-mono font-bold text-gray-300">
                        {f.name}
                      </span>
                    </div>
                    <div className="text-sm font-extrabold font-mono text-white">
                      {f.importance.toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note on Causation vs Reliance */}
            <div className="mt-5 pt-3 border-t border-white/5 text-[11px] text-gray-400 font-mono flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-taxi-yellow flex-shrink-0 mt-0.5" />
              <span>
                Feature importance describes the model's relative reliance on input features across trees and does not establish real-world physical causation.
              </span>
            </div>
          </div>

          {/* Model Specification Card: 5 cols */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-taxi-yellow" />
                  <h3 className="text-xl font-bold text-white">
                    Model Architecture
                  </h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  Deployed
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-6">
                Fixed hyperparameters established during the Google Colab workflow and deserialized via joblib.
              </p>

              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-900/90 border border-white/5">
                  <span className="text-gray-400">Algorithm</span>
                  <span className="font-bold text-white">RandomForestRegressor</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-900/90 border border-white/5">
                  <span className="text-gray-400">Ensemble Size</span>
                  <span className="font-bold text-taxi-yellow">n_estimators = 100</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-900/90 border border-white/5">
                  <span className="text-gray-400">Max Tree Depth</span>
                  <span className="font-bold text-white">max_depth = 10</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-900/90 border border-white/5">
                  <span className="text-gray-400">Parallel Jobs</span>
                  <span className="font-bold text-white">n_jobs = -1 (All Cores)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-900/90 border border-white/5">
                  <span className="text-gray-400">Reproducibility Seed</span>
                  <span className="font-bold text-white">random_state = 42</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-900/90 border border-white/5">
                  <span className="text-gray-400">Feature Exclusion</span>
                  <span className="font-bold text-amber-400">Base_Fare Excluded</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Loaded in-memory at FastAPI startup for sub-millisecond inference</span>
            </div>
          </div>
        </div>

        {/* Dataset Limitation & Academic Disclaimer Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-charcoal-900/80 shadow-glass">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-1">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Dataset Limitations & Academic Disclosure</span>
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                The dataset used in this project is synthetic, where notebook analysis demonstrated that the original target was effectively generated from <code className="bg-charcoal-800 px-1.5 py-0.5 rounded text-taxi-yellow">Base_Fare × Surge_Multiplier</code>. The final Random Forest model intentionally excludes <code className="bg-charcoal-800 px-1.5 py-0.5 rounded text-white">Base_Fare</code> from its features to predict directly from trip distance, duration, and surge multiplier.
              </p>
              <div className="pt-2">
                <blockquote className="p-3.5 rounded-xl bg-charcoal-950 border border-white/10 text-xs text-amber-200/90 font-mono italic">
                  “This application is a machine learning demonstration. Its dataset contains a synthetic fare relationship, and its predictions have not been validated against real-world taxi fares. Predictions are estimates, not guaranteed prices.”
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
