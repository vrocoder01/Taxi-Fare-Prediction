import React from 'react';
import {
  BarChart3,
  Award,
  AlertTriangle,
} from 'lucide-react';

interface ModelComparisonProps {
  onNavigateToAnalytics?: () => void;
}

export const ModelComparisonSection: React.FC<ModelComparisonProps> = () => {
  // Notebook Step 30 Initial Model Comparison Results (Features included Base_Fare)
  const comparisonTable = [
    {
      name: 'Random Forest Regressor',
      shortName: 'Random Forest',
      mae: 0.5339,
      mse: 0.7232,
      rmse: 0.8504,
      r2: 1.0000,
      isWinner: true,
      tag: 'Selected Algorithm',
      color: '#FFB800',
    },
    {
      name: 'Decision Tree Regressor',
      shortName: 'Decision Tree',
      mae: 1.9832,
      mse: 6.9555,
      rmse: 2.6373,
      r2: 0.9998,
      isWinner: false,
      tag: 'Prone to Variance',
      color: '#FF8A00',
    },
    {
      name: 'Ridge Regression (L2)',
      shortName: 'Ridge',
      mae: 32.8174,
      mse: 1814.664,
      rmse: 42.5989,
      r2: 0.9548,
      isWinner: false,
      tag: 'Linear Regularized',
      color: '#94A3B8',
    },
    {
      name: 'Linear Regression (OLS)',
      shortName: 'Linear Reg.',
      mae: 32.8173,
      mse: 1814.6655,
      rmse: 42.5989,
      r2: 0.9548,
      isWinner: false,
      tag: 'Baseline OLS',
      color: '#64748B',
    },
    {
      name: 'Lasso Regression (L1)',
      shortName: 'Lasso',
      mae: 32.8187,
      mse: 1814.7096,
      rmse: 42.5994,
      r2: 0.9548,
      isWinner: false,
      tag: 'Sparse Linear',
      color: '#475569',
    },
  ];

  return (
    <section id="comparison" className="py-20 relative bg-charcoal-950">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[350px] bg-taxi-yellow/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-96 h-96 bg-taxi-orange/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-taxi-yellow/10 border border-taxi-yellow/20 text-xs font-mono font-bold text-taxi-yellow mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Algorithm Evaluation & Benchmark</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
            Model Performance Comparison
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
            Empirical evaluation of 5 candidate regression algorithms from <code className="text-taxi-yellow font-mono">notebooks/Taxi_Fare_Prediction.ipynb (Step 30)</code> and the architectural rationale for deploying Random Forest Regressor.
          </p>

          {/* Explicit Experiment Disclaimer Pill */}
          <div className="mt-6 inline-flex items-center gap-2 p-3 rounded-2xl bg-charcoal-900/90 border border-amber-500/30 text-left max-w-2xl text-xs text-gray-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">Experimental Configuration Note:</strong> The initial 5-model benchmark evaluated all models with Base_Fare included. The final deployed model (<strong className="text-taxi-yellow font-mono">R² = 0.9725, MAE = 26.0278</strong>) was evaluated separately on physical trip features with Base_Fare excluded. Both experiments are distinctly documented below.
            </span>
          </div>
        </div>

        {/* CANDIDATE ALGORITHMS COMPARISON TABLE */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-glass overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-taxi-yellow" />
                <h3 className="text-xl font-bold text-white">
                  Candidate Algorithms Comparison Table
                </h3>
              </div>
              <p className="text-xs text-gray-400 mt-1 font-mono">
                Source: Notebook Step 30 • 9,846 Holdout Test Split • Sorted by R² Score
              </p>
            </div>

            <span className="text-[11px] font-mono text-taxi-yellow px-3 py-1 rounded-full bg-taxi-yellow/10 border border-taxi-yellow/30 self-start sm:self-auto font-bold">
              Random Forest #1 Rank
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Regression Model</th>
                  <th className="py-3 px-4 text-right">MAE (₹)</th>
                  <th className="py-3 px-4 text-right">MSE</th>
                  <th className="py-3 px-4 text-right">RMSE (₹)</th>
                  <th className="py-3 px-4 text-right">R² Score</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {comparisonTable.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      row.isWinner
                        ? 'bg-taxi-yellow/10 font-bold hover:bg-taxi-yellow/15'
                        : 'hover:bg-charcoal-850/60 text-gray-300'
                    }`}
                  >
                    <td className="py-4 px-4 flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: row.color }}
                      />
                      <span className={row.isWinner ? 'text-white font-bold' : ''}>
                        {row.name}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono">
                      {row.mae.toFixed(4)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-gray-400">
                      {row.mse.toFixed(4)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono">
                      {row.rmse.toFixed(4)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          row.isWinner
                            ? 'bg-taxi-yellow text-charcoal-950 font-black'
                            : 'text-gray-300'
                        }`}
                      >
                        {row.r2.toFixed(4)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                          row.isWinner
                            ? 'bg-taxi-yellow/20 text-taxi-yellow border-taxi-yellow/40 font-bold'
                            : 'bg-charcoal-900 text-gray-400 border-white/5'
                        }`}
                      >
                        {row.tag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
