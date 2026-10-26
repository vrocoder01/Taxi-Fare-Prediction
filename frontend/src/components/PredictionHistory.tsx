import React from 'react';
import { History, Trash2, ArrowUpRight, IndianRupee } from 'lucide-react';
import { PredictionResponse } from '../services/api';

export interface HistoryItem {
  id: string;
  predicted_fare: number;
  currency: string;
  distance: number;
  duration: number;
  surge: number;
  timestamp: string;
}

interface PredictionHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const PredictionHistory: React.FC<PredictionHistoryProps> = ({
  history,
  onSelect,
  onClear,
}) => {
  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-glass">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-taxi-yellow/10 flex items-center justify-center text-taxi-yellow border border-taxi-yellow/20">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Prediction History</h4>
            <p className="text-[11px] text-gray-400 font-mono">
              {history.length} {history.length === 1 ? 'record' : 'records'} in session
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Clear all session history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-8 text-center text-gray-500 text-xs font-mono">
          No predictions recorded yet. Run inference to log history.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="p-3.5 rounded-xl bg-charcoal-900/90 hover:bg-charcoal-800 border border-white/5 hover:border-taxi-yellow/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-charcoal-850 flex items-center justify-center text-taxi-yellow font-mono font-bold text-sm border border-white/5 group-hover:border-taxi-yellow/30">
                  ₹
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-white font-mono group-hover:text-taxi-yellow transition-colors">
                      ₹{item.predicted_fare.toFixed(2)}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      {item.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400 mt-0.5">
                    <span>{item.distance} km</span>
                    <span>•</span>
                    <span>{item.duration} min</span>
                    <span>•</span>
                    <span className="text-taxi-yellow">{item.surge}x</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="w-7 h-7 rounded-lg bg-charcoal-950 flex items-center justify-center text-gray-400 group-hover:text-taxi-yellow group-hover:bg-taxi-yellow/10 transition-all"
                title="Restore these parameters"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
