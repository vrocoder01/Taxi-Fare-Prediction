import React, { useState, useEffect } from 'react';
import {
  fetchStatistics,
  StatisticsResponse,
  TargetInsight,
} from '../services/api';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Scatter,
} from 'recharts';
import {
  Activity,
  Database,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  BookOpen,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Table,
  Scale,
  Award,
  RefreshCw,
} from 'lucide-react';

// Default / fallback data verified from Cab_Fares.csv (49,230 rows)
const DEFAULT_STATS: StatisticsResponse = {
  summary: {
    clean_records: 49230,
    total_raw_records: 50000,
    missing_values_dropped: 770,
    numerical_features_count: 8,
    features_evaluated: [
      'Distance_km',
      'Trip_Duration',
      'Surge_Multiplier',
      'Base_Fare',
      'Driver_Rating',
      'Passenger_Count',
      'No_of_active_drivers',
      'Cab_Availability_Ratio',
    ],
    strongest_positive_predictor: {
      feature: 'Base_Fare',
      r: 0.8599,
      strength: 'Very Strong',
      note: 'Target leakage feature (r = 0.8599). Excluded from final model.',
    },
    strongest_negative_predictor: {
      feature: 'No_of_active_drivers',
      r: -0.2408,
      strength: 'Weak',
      note: 'Higher active driver density slightly suppresses surge pricing.',
    },
    statistically_significant_tests: 2,
    dataset_name: 'Cab_Fares.csv',
  },
  correlation_analysis: {
    core_features: [
      'Distance_km',
      'Trip_Duration',
      'Surge_Multiplier',
      'Base_Fare',
      'Final_Fare',
    ],
    matrix: {
      Distance_km: {
        Distance_km: 1.0,
        Trip_Duration: 0.9505,
        Surge_Multiplier: 0.0007,
        Base_Fare: 0.9828,
        Final_Fare: 0.8455,
      },
      Trip_Duration: {
        Distance_km: 0.9505,
        Trip_Duration: 1.0,
        Surge_Multiplier: -0.0031,
        Base_Fare: 0.9343,
        Final_Fare: 0.8044,
      },
      Surge_Multiplier: {
        Distance_km: 0.0007,
        Trip_Duration: -0.0031,
        Surge_Multiplier: 1.0,
        Base_Fare: 0.0016,
        Final_Fare: 0.4612,
      },
      Base_Fare: {
        Distance_km: 0.9828,
        Trip_Duration: 0.9343,
        Surge_Multiplier: 0.0016,
        Base_Fare: 1.0,
        Final_Fare: 0.8599,
      },
      Final_Fare: {
        Distance_km: 0.8455,
        Trip_Duration: 0.8044,
        Surge_Multiplier: 0.4612,
        Base_Fare: 0.8599,
        Final_Fare: 1.0,
      },
    },
    heatmap_data: [
      { row: 'Distance_km', col: 'Distance_km', correlation: 1.0, strength: 'Very Strong', direction: 'Positive' },
      { row: 'Distance_km', col: 'Trip_Duration', correlation: 0.9505, strength: 'Very Strong', direction: 'Positive' },
      { row: 'Distance_km', col: 'Surge_Multiplier', correlation: 0.0007, strength: 'Very Weak', direction: 'Near Zero' },
      { row: 'Distance_km', col: 'Base_Fare', correlation: 0.9828, strength: 'Very Strong', direction: 'Positive' },
      { row: 'Distance_km', col: 'Final_Fare', correlation: 0.8455, strength: 'Very Strong', direction: 'Positive' },

      { row: 'Trip_Duration', col: 'Distance_km', correlation: 0.9505, strength: 'Very Strong', direction: 'Positive' },
      { row: 'Trip_Duration', col: 'Trip_Duration', correlation: 1.0, strength: 'Very Strong', direction: 'Positive' },
      { row: 'Trip_Duration', col: 'Surge_Multiplier', correlation: -0.0031, strength: 'Very Weak', direction: 'Near Zero' },
      { row: 'Trip_Duration', col: 'Base_Fare', correlation: 0.9343, strength: 'Very Strong', direction: 'Positive' },
      { row: 'Trip_Duration', col: 'Final_Fare', correlation: 0.8044, strength: 'Very Strong', direction: 'Positive' },

      { row: 'Surge_Multiplier', col: 'Distance_km', correlation: 0.0007, strength: 'Very Weak', direction: 'Near Zero' },
      { row: 'Surge_Multiplier', col: 'Trip_Duration', correlation: -0.0031, strength: 'Very Weak', direction: 'Near Zero' },
      { row: 'Surge_Multiplier', col: 'Surge_Multiplier', correlation: 1.0, strength: 'Very Strong', direction: 'Positive' },
      { row: 'Surge_Multiplier', col: 'Base_Fare', correlation: 0.0016, strength: 'Very Weak', direction: 'Near Zero' },
      { row: 'Surge_Multiplier', col: 'Final_Fare', correlation: 0.4612, strength: 'Moderate', direction: 'Positive' },

      { row: 'Base_Fare', col: 'Distance_km', correlation: 0.9828, strength: 'Very Strong', direction: 'Positive' },
      { row: 'Base_Fare', col: 'Trip_Duration', correlation: 0.9343, strength: 'Very Strong', direction: 'Positive' },
      { row: 'Base_Fare', col: 'Surge_Multiplier', correlation: 0.0016, strength: 'Very Weak', direction: 'Near Zero' },
      { row: 'Base_Fare', col: 'Base_Fare', correlation: 1.0, strength: 'Very Strong', direction: 'Positive' },
      { row: 'Base_Fare', col: 'Final_Fare', correlation: 0.8599, strength: 'Very Strong', direction: 'Positive' },

      { row: 'Final_Fare', col: 'Distance_km', correlation: 0.8455, strength: 'Very Strong', direction: 'Positive' },
      { row: 'Final_Fare', col: 'Trip_Duration', correlation: 0.8044, strength: 'Very Strong', direction: 'Positive' },
      { row: 'Final_Fare', col: 'Surge_Multiplier', correlation: 0.4612, strength: 'Moderate', direction: 'Positive' },
      { row: 'Final_Fare', col: 'Base_Fare', correlation: 0.8599, strength: 'Very Strong', direction: 'Positive' },
      { row: 'Final_Fare', col: 'Final_Fare', correlation: 1.0, strength: 'Very Strong', direction: 'Positive' },
    ],
    target_insights: [
      {
        feature: 'Distance_km',
        r: 0.8455,
        r_squared_pct: 71.49,
        strength: 'Very Strong',
        direction: 'Positive',
        interpretation: 'Explains 71.49% of final fare variance alone. Represents the baseline odometer cost of urban transit.',
        simple_words: 'Longer trips cost substantially more. For every extra kilometer, fare rises consistently by ~₹13.91.',
        note: 'Selected as Feature 1 in final Random Forest model.',
      },
      {
        feature: 'Trip_Duration',
        r: 0.8044,
        r_squared_pct: 64.71,
        strength: 'Very Strong',
        direction: 'Positive',
        interpretation: 'Strongly correlated with fare (r = 0.8044) and heavily collinear with Distance_km (r = 0.9505).',
        simple_words: 'Longer time spent on the road increases the price, though mostly because longer distance takes more time.',
        note: 'Selected as Feature 2 in final Random Forest model.',
      },
      {
        feature: 'Surge_Multiplier',
        r: 0.4612,
        r_squared_pct: 21.27,
        strength: 'Moderate',
        direction: 'Positive',
        interpretation: 'Moderate correlation (r = 0.4612) with zero collinearity against distance (r = 0.0007), making it an orthogonal multiplier.',
        simple_words: 'Acts like a volume knob: when demand spikes (1.5x, 2.0x), it scales up the entire fare proportionally.',
        note: 'Selected as Feature 3 in final Random Forest model.',
      },
      {
        feature: 'Base_Fare',
        r: 0.8599,
        r_squared_pct: 73.94,
        strength: 'Very Strong',
        direction: 'Positive',
        interpretation: 'Synthetically defines the fare target before surge is applied. Excluded to eliminate mathematical target leakage.',
        simple_words: 'Target leakage feature: Final Fare was mathematically computed from this, so feeding it to the ML model would be cheating.',
        note: 'Target leakage candidate — removed in Step 33 of notebook.',
      },
    ],
    formula_investigation: {
      formula: 'Final_Fare = round(Base_Fare * Surge_Multiplier, 2)',
      exact_match: true,
      max_deviation: 0.004,
      explanation:
        'Mathematical verification proves Final_Fare is generated exactly as Base_Fare × Surge_Multiplier across all 49,230 rows. Retaining Base_Fare creates artificial R²=1.0000. Eliminating Base_Fare forces the algorithm to learn real-world physical dynamics (Distance, Duration, Surge).',
    },
    scatter_trends: {
      distance: {
        feature: 'Distance_km',
        slope: 13.9124,
        intercept: 120.3012,
        points: [
          { x: 2, y: 148, trend: 148.1 },
          { x: 5, y: 190, trend: 189.9 },
          { x: 10, y: 260, trend: 259.4 },
          { x: 15, y: 328, trend: 329.0 },
          { x: 18, y: 371, trend: 370.7 },
          { x: 22, y: 426, trend: 426.4 },
          { x: 27, y: 495, trend: 495.9 },
          { x: 32, y: 565, trend: 565.5 },
          { x: 38, y: 649, trend: 648.9 },
          { x: 44, y: 732, trend: 732.4 },
          { x: 50, y: 816, trend: 815.9 },
        ],
      },
      duration: {
        feature: 'Trip_Duration',
        slope: 4.8152,
        intercept: 133.4518,
        points: [
          { x: 10, y: 182, trend: 181.6 },
          { x: 20, y: 230, trend: 229.8 },
          { x: 35, y: 302, trend: 302.0 },
          { x: 50, y: 374, trend: 374.2 },
          { x: 65, y: 446, trend: 446.4 },
          { x: 80, y: 519, trend: 518.7 },
          { x: 95, y: 591, trend: 590.9 },
          { x: 110, y: 663, trend: 663.1 },
        ],
      },
      surge: {
        feature: 'Surge_Multiplier',
        points: [
          { x: 1.0, y: 326.4, count: 21500 },
          { x: 1.2, y: 391.8, count: 12100 },
          { x: 1.5, y: 489.6, count: 9800 },
          { x: 2.0, y: 652.8, count: 4800 },
          { x: 2.5, y: 816.0, count: 1030 },
        ],
      },
    },
  },
  hypothesis_testing: {
    test_a: {
      id: 'test_a',
      title: 'Test A: Pearson Correlation Significance (Trip Distance vs Final Fare)',
      research_question:
        'Is there a statistically significant linear association between trip distance and final taxi fare in the Cab_Fares dataset?',
      h0: 'ρ = 0 (No linear relationship between distance and fare in the population)',
      h1: 'ρ ≠ 0 (A statistically significant linear relationship exists between distance and fare)',
      alpha: 0.05,
      test_type: "Two-tailed Student's t-test for Pearson r",
      sample_size: 49230,
      sample_size_str: '49,230 complete records',
      r: 0.8455,
      t_statistic: 351.3113,
      degrees_of_freedom: 49228,
      p_value: 0.0,
      p_value_formatted: 'p < 0.001 (p ≈ 0.0000)',
      decision: 'Reject the null hypothesis',
      decision_label: 'H0 Rejected',
      is_significant: true,
      conclusion:
        'With t(49,228) = 351.31 and p < 0.001, we reject H0 at α = 0.05. Trip distance shares a statistically significant, very strong positive linear association (r = 0.8455) with final fare.',
      practical_meaning:
        'Distance is not just correlated by chance; it accounts for over 71.49% of individual fare variance, justifying its role as the primary split feature in our Random Forest model.',
      simple_words:
        'Longer taxi rides decisively cost more. The massive sample size of 49,230 trips rules out random coincidence with 99.99%+ certainty.',
      presentation_bullet:
        'Pearson test confirms distance has a statistically significant linear relationship with fare (r = 0.846, t = 351.31, p < 0.001). We reject H0.',
    },
    test_b: {
      id: 'test_b',
      title: "Test B: Welch's Two-Sample t-Test (Trip Distance Median Split)",
      research_question:
        'Do long trips have a statistically significant different average final fare compared to short trips when partitioned at the median distance?',
      group_variable: 'Distance_km median partition (17.99 km)',
      median_split_value: 17.99,
      group_short: {
        label: 'Short Trips (Distance ≤ 17.99 km)',
        condition: 'Distance_km ≤ 17.99 km',
        sample_size: 24622,
        mean: 224.15,
        std: 108.29,
      },
      group_long: {
        label: 'Long Trips (Distance > 17.99 km)',
        condition: 'Distance_km > 17.99 km',
        sample_size: 24608,
        mean: 516.79,
        std: 158.31,
      },
      mean_difference: 292.64,
      ci_95_lower: 290.25,
      ci_95_upper: 295.04,
      t_statistic: 239.3621,
      degrees_of_freedom: 43495.4,
      p_value: 0.0,
      p_value_formatted: 'p < 0.001 (p ≈ 0.0000)',
      cohens_d: 2.1578,
      cohens_d_interpretation: 'Huge effect size (d > 0.80 standard threshold)',
      alpha: 0.05,
      test_type: "Two-tailed Welch's t-test for independent samples (unequal variances assumed)",
      decision: 'Reject the null hypothesis',
      decision_label: 'H0 Rejected',
      is_significant: true,
      conclusion:
        "With Welch's t(43,495) = 239.36 and p < 0.001, we reject H0. Long trips (> 17.99 km) incur a significantly higher mean fare (₹516.79 vs ₹224.15) with an observed difference of ₹292.64 (95% CI: [₹290.25, ₹295.04]).",
      practical_meaning:
        "The enormous effect size (Cohen's d = 2.16) proves that dividing trips into short vs long partitions creates two entirely separate fare regimes, validating why tree-based models split on distance first.",
      simple_words:
        'Trips over 18 km average more than double the price of shorter trips (₹516.79 vs ₹224.15). The difference of ₹292.64 is consistent and indisputable.',
      presentation_bullet:
        "Welch's t-test proves long trips cost significantly more than short trips (mean diff ₹292.64, 95% CI [₹290.25, ₹295.04], Cohen's d = 2.16, p < 0.001). We reject H0.",
    },
  },
  methodology: {
    dataset:
      'Cab_Fares.csv (49,230 complete records after removing 770 rows with missing driver names).',
    correlation_method:
      'Pearson Product-Moment Correlation Coefficient (assesses linear association between continuous variables).',
    two_sample_test:
      "Welch's t-test (preferred over Student's t-test because it does not assume equal population variances between short and long trips).",
    significance_threshold:
      'Alpha = 0.05 (two-tailed). P-values < 0.05 lead to rejection of the null hypothesis.',
    median_partition:
      'Median distance of 17.99 km was chosen to split data into equal, unbiased short vs long sample sizes without arbitrary cutoff bias.',
    causality_caveat:
      'Statistical significance and correlation describe empirical associations within the evaluated dataset and do not prove causal mechanisms.',
    synthetic_disclaimer:
      "The dataset is synthetic with an underlying formula relationship. Conclusions describe the dataset's generative properties and should not be asserted as real-world urban taxi benchmarks.",
  },
  presentation_notes: [
    'Start by showing the dataset summary: 49,230 clean records, 8 numerical features.',
    'Highlight the Correlation Heatmap: Distance_km (0.846) and Base_Fare (0.860) strongly correlate with Final_Fare.',
    'Explain the formula insight: Base_Fare × Surge_Multiplier explains why Base_Fare was removed to build a genuine predictive model.',
    'Present Hypothesis Test A: Pearson r = 0.846, t = 351.31, p < 0.001. We reject H0; distance has a statistically significant linear association with fare.',
    'Present Hypothesis Test B: Welch t-test splits trips at 17.99 km median. Long trips average ₹516.79 vs ₹224.15 for short trips (mean difference ₹292.64, 95% CI [₹290.25, ₹295.04], Cohen’s d = 2.16). We reject H0.',
    'Conclude with Academic Humility: Statistical significance does not equal physical causation, and synthetic data limitations apply.',
  ],
};

export const StatisticalAnalysisSection: React.FC = () => {
  const [stats, setStats] = useState<StatisticsResponse>(DEFAULT_STATS);
  const [loading, setLoading] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'correlation' | 'hypothesis'>('correlation');
  const [selectedScatterFeature, setSelectedScatterFeature] = useState<'distance' | 'duration' | 'surge'>('distance');
  const [hoveredCell, setHoveredCell] = useState<{ row: string; col: string; val: number } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchStatistics();
        if (isMounted && data) {
          setStats(data);
        }
      } catch (err) {
        // Fallback to precomputed default statistics
        console.warn('Backend /statistics request failed, using validated precomputed statistics', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const getHeatmapColor = (r: number) => {
    if (r === 1.0) return 'bg-taxi-yellow text-charcoal-950 font-black shadow-sm';
    if (r >= 0.8) return 'bg-amber-400/80 text-charcoal-950 font-bold';
    if (r >= 0.6) return 'bg-amber-500/50 text-white font-semibold';
    if (r >= 0.3) return 'bg-amber-600/30 text-amber-200';
    if (r > 0.05) return 'bg-charcoal-800 text-gray-300';
    if (r >= -0.05) return 'bg-charcoal-900/90 text-gray-400';
    if (r >= -0.3) return 'bg-sky-950/40 text-sky-300';
    return 'bg-blue-900/60 text-blue-200';
  };

  const featureLabels: Record<string, string> = {
    Distance_km: 'Distance (km)',
    Trip_Duration: 'Duration (min)',
    Surge_Multiplier: 'Surge (×)',
    Base_Fare: 'Base Fare (₹)',
    Final_Fare: 'Final Fare (₹)',
  };

  return (
    <section id="insights" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-charcoal-950/90">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-taxi-yellow/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-taxi-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Header with Title and Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-taxi-yellow/10 border border-taxi-yellow/30 text-taxi-yellow text-xs font-mono font-bold tracking-widest uppercase mb-4">
              <Scale className="w-3.5 h-3.5" />
              STATISTICAL FOUNDATION & HYPOTHESIS TESTING
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Statistical Analysis &amp; Data Insights
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-3xl leading-relaxed">
              Explore bivariate linear relationships, inspect mathematical data-generation mechanisms, and review
              formal two-tailed hypothesis tests evaluated directly against the 49,230 clean records in{' '}
              <span className="text-taxi-yellow font-mono font-semibold">Cab_Fares.csv</span>.
            </p>
          </div>

          {/* Simple Words Toggle Button */}
          <div className="flex items-center gap-3 self-start md:self-end bg-charcoal-900 p-1.5 rounded-xl border border-white/10 shadow-lg">
            <button
              onClick={() => setSimpleMode(!simpleMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                simpleMode
                  ? 'bg-gradient-to-r from-taxi-yellow to-taxi-orange text-charcoal-950 shadow-taxi-glow font-bold'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {simpleMode ? 'Simple Words Mode: Active' : 'Explain in Simple Words'}
            </button>
          </div>
        </div>

        {/* 1. Summary KPI Row (5 Metrics Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-charcoal-900/60 hover:border-taxi-yellow/30 transition-all duration-200">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs uppercase font-mono tracking-wider">Clean Records</span>
              <Database className="w-4 h-4 text-taxi-yellow" />
            </div>
            <div className="text-2xl lg:text-3xl font-extrabold text-white font-mono">
              {stats.summary.clean_records.toLocaleString()}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              From {stats.summary.total_raw_records.toLocaleString()} (770 dropped nulls)
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-charcoal-900/60 hover:border-taxi-yellow/30 transition-all duration-200">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs uppercase font-mono tracking-wider">Predictors Tested</span>
              <Activity className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl lg:text-3xl font-extrabold text-white font-mono">
              {stats.summary.numerical_features_count}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Evaluated against Final_Fare target
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-charcoal-900/60 hover:border-taxi-yellow/30 transition-all duration-200">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs uppercase font-mono tracking-wider">Top Positive Driver</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl lg:text-2xl font-extrabold text-white font-mono">
              Distance (0.846)
            </div>
            <p className="text-[11px] text-emerald-400 mt-1">
              Base_Fare = 0.860 (leakage)
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-charcoal-900/60 hover:border-taxi-yellow/30 transition-all duration-200">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs uppercase font-mono tracking-wider">Top Negative Feature</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl lg:text-2xl font-extrabold text-white font-mono">
              Drivers (-0.241)
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Active drivers slightly curb surge
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-charcoal-900/60 hover:border-taxi-yellow/30 transition-all duration-200 col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span className="text-xs uppercase font-mono tracking-wider">Hypothesis Tests</span>
              <Award className="w-4 h-4 text-taxi-yellow" />
            </div>
            <div className="text-2xl lg:text-3xl font-extrabold text-taxi-yellow font-mono">
              {stats.summary.statistically_significant_tests} / 2 Rejected H₀
            </div>
            <p className="text-[11px] text-taxi-yellow/80 mt-1">
              Both tests p &lt; 0.001 (α = 0.05)
            </p>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('correlation')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'correlation'
                ? 'bg-taxi-yellow text-charcoal-950 font-bold shadow-taxi-glow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Table className="w-4 h-4" />
            Correlation Analysis &amp; Visual Trends
          </button>
          <button
            onClick={() => setActiveTab('hypothesis')}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'hypothesis'
                ? 'bg-taxi-yellow text-charcoal-950 font-bold shadow-taxi-glow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Scale className="w-4 h-4" />
            Hypothesis Testing (Test A &amp; Test B)
          </button>
        </div>

        {/* TAB 1: CORRELATION ANALYSIS */}
        {activeTab === 'correlation' && (
          <div className="space-y-10 animate-fade-in">
            {/* Top Grid: Correlation Heatmap (Left) + Interpretation Guide (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Heatmap Section */}
              <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-charcoal-900/60">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Table className="w-5 h-5 text-taxi-yellow" />
                      Pearson Correlation Matrix Heatmap
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Computed across all 49,230 observations in Cab_Fares.csv.
                    </p>
                  </div>
                  {hoveredCell && (
                    <div className="hidden sm:block text-right">
                      <span className="text-[11px] text-gray-400 font-mono">
                        {featureLabels[hoveredCell.row]} ↔ {featureLabels[hoveredCell.col]}:
                      </span>{' '}
                      <span className="text-sm font-bold text-taxi-yellow font-mono">
                        r = {hoveredCell.val.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Heatmap Table */}
                <div className="overflow-x-auto mt-6">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 text-left text-xs font-mono text-gray-400 uppercase tracking-wider"></th>
                        {stats.correlation_analysis.core_features.map((col) => (
                          <th
                            key={col}
                            className="p-2 text-xs font-mono text-gray-300 uppercase tracking-wider font-semibold"
                          >
                            {col.replace('_', ' ')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stats.correlation_analysis.core_features.map((row) => (
                        <tr key={row}>
                          <td className="p-2 text-left text-xs font-mono text-gray-300 font-bold whitespace-nowrap">
                            {row.replace('_', ' ')}
                          </td>
                          {stats.correlation_analysis.core_features.map((col) => {
                            const val = stats.correlation_analysis.matrix[row]?.[col] ?? 0;
                            return (
                              <td
                                key={`${row}-${col}`}
                                onMouseEnter={() => setHoveredCell({ row, col, val })}
                                onMouseLeave={() => setHoveredCell(null)}
                                className="p-1"
                              >
                                <div
                                  className={`w-full py-2.5 px-1.5 rounded-lg text-xs font-mono transition-transform hover:scale-105 cursor-pointer ${getHeatmapColor(
                                    val
                                  )}`}
                                  title={`${row} ↔ ${col}: r = ${val.toFixed(4)}`}
                                >
                                  {val.toFixed(3)}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Heatmap Legend */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-blue-900/80 inline-block" />
                    <span>Negative (-1.0 to -0.2)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-charcoal-800 inline-block" />
                    <span>Neutral / Zero</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-amber-600/40 inline-block" />
                    <span>Moderate (+0.4)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded bg-taxi-yellow inline-block" />
                    <span>Dominant (+0.8 to +1.0)</span>
                  </div>
                </div>
              </div>

              {/* Interpretation Guide & Academic Caveat */}
              <div className="lg:col-span-5 space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-charcoal-900/60">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-taxi-yellow" />
                    Correlation Interpretation Guide
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Rule-of-thumb thresholds for bivariate Pearson coefficients (|r|):
                  </p>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center p-2 rounded bg-charcoal-950/60 border border-white/5">
                      <span className="text-taxi-yellow font-bold">0.80 &ndash; 1.00</span>
                      <span className="text-gray-300">Very Strong Linear Link</span>
                      <span className="text-taxi-yellow/90">Distance (0.846)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-charcoal-950/60 border border-white/5">
                      <span className="text-amber-400 font-bold">0.60 &ndash; 0.79</span>
                      <span className="text-gray-300">Strong Association</span>
                      <span className="text-gray-400">High predictability</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-charcoal-950/60 border border-white/5">
                      <span className="text-amber-300 font-bold">0.40 &ndash; 0.59</span>
                      <span className="text-gray-300">Moderate Association</span>
                      <span className="text-amber-300">Surge (0.461)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-charcoal-950/60 border border-white/5">
                      <span className="text-gray-400 font-bold">0.20 &ndash; 0.39</span>
                      <span className="text-gray-300">Weak Linear Trend</span>
                      <span className="text-sky-400">Drivers (-0.241)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-charcoal-950/60 border border-white/5">
                      <span className="text-gray-500 font-bold">0.00 &ndash; 0.19</span>
                      <span className="text-gray-400">Very Weak / Negligible</span>
                      <span className="text-gray-500">Passenger count</span>
                    </div>
                  </div>
                </div>

                {/* Academic Caution Banner */}
                <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-200">
                  <div className="flex items-center gap-2 font-bold text-sm text-amber-300 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Essential Academic Note: Correlation ≠ Causation
                  </div>
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    A high correlation coefficient proves linear co-movement, not direct causal agency. While trip distance
                    and trip duration both correlate strongly with final fare, duration shares an r = 0.9505 multicollinearity
                    with distance. The Random Forest tree splits primarily on Distance_km (74.26% importance).
                  </p>
                </div>
              </div>
            </div>

            {/* Target-Specific Insights Cards */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-taxi-yellow" />
                Target Predictor Breakdown (vs Final_Fare)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.correlation_analysis.target_insights.map((insight) => (
                  <div
                    key={insight.feature}
                    className="glass-panel p-5 rounded-2xl border border-white/10 bg-charcoal-900/60 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-bold text-sm text-white">
                          {featureLabels[insight.feature] || insight.feature}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            insight.strength === 'Very Strong'
                              ? 'bg-taxi-yellow/20 text-taxi-yellow border border-taxi-yellow/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {insight.strength}
                        </span>
                      </div>
                      <div className="text-2xl font-extrabold text-white font-mono mb-1">
                        r = +{insight.r.toFixed(4)}
                      </div>
                      <div className="text-xs text-taxi-yellow font-mono mb-3">
                        R² = {insight.r_squared_pct.toFixed(1)}% variance
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {simpleMode ? insight.simple_words : insight.interpretation}
                      </p>
                    </div>
                    {insight.note && (
                      <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-gray-400 font-mono">
                        {insight.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mathematical Formula Leakage Investigation */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-taxi-yellow/30 bg-gradient-to-r from-taxi-yellow/10 via-charcoal-900 to-charcoal-900">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-taxi-yellow text-charcoal-950 font-bold flex items-center justify-center font-mono text-lg">
                    ƒ(x)
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Target Leakage Investigation &amp; Mathematical Proof
                    </h3>
                    <p className="text-xs text-taxi-yellow/90 font-mono">
                      Mathematical discovery verified on 100% of rows (49,230 / 49,230)
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-taxi-yellow/20 border border-taxi-yellow/40 text-taxi-yellow font-mono text-xs font-bold self-start md:self-auto">
                  Formula Exact Match: 100.0%
                </div>
              </div>

              <div className="bg-charcoal-950/80 p-4 rounded-xl border border-white/10 font-mono text-sm text-taxi-yellow mb-4 overflow-x-auto">
                {stats.correlation_analysis.formula_investigation.formula}
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                {simpleMode ? (
                  <>
                    <strong className="text-white">Why Base_Fare was removed:</strong> In the synthetic dataset, Final
                    Fare was calculated directly by multiplying Base Fare and Surge Multiplier. If we fed Base Fare into our
                    machine learning model, the model would simply copy the math instead of learning real trip dynamics. By
                    removing Base Fare, our Random Forest model predicts genuine pricing from physical distance, duration,
                    and demand.
                  </>
                ) : (
                  stats.correlation_analysis.formula_investigation.explanation
                )}
              </p>
            </div>

            {/* Interactive Feature vs Final_Fare Scatter & Trend Plot */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-charcoal-900/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-taxi-yellow" />
                    Feature vs Final_Fare Empirical Trend Lines
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Visualizing linear association and empirical fare scaling.
                  </p>
                </div>

                {/* Sub-selector for feature */}
                <div className="flex items-center gap-2 bg-charcoal-950 p-1 rounded-xl border border-white/10 self-start sm:self-auto text-xs font-mono">
                  <button
                    onClick={() => setSelectedScatterFeature('distance')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedScatterFeature === 'distance'
                        ? 'bg-taxi-yellow text-charcoal-950 font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Distance (km)
                  </button>
                  <button
                    onClick={() => setSelectedScatterFeature('duration')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedScatterFeature === 'duration'
                        ? 'bg-taxi-yellow text-charcoal-950 font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Duration (min)
                  </button>
                  <button
                    onClick={() => setSelectedScatterFeature('surge')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedScatterFeature === 'surge'
                        ? 'bg-taxi-yellow text-charcoal-950 font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Surge (×)
                  </button>
                </div>
              </div>

              {/* Chart */}
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {selectedScatterFeature === 'distance' ? (
                    <ComposedChart
                      data={stats.correlation_analysis.scatter_trends.distance.points}
                      margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis
                        dataKey="x"
                        stroke="#9CA3AF"
                        fontSize={11}
                        fontFamily="monospace"
                        tickFormatter={(v) => `${v} km`}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        fontSize={11}
                        fontFamily="monospace"
                        tickFormatter={(v) => `₹${v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#171717',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '0.75rem',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                        }}
                        formatter={(value: any, name: string) => [
                          `₹${Number(value).toFixed(2)}`,
                          name === 'y' ? 'Observed Fare' : 'Linear Trend',
                        ]}
                        labelFormatter={(label) => `Trip Distance: ${label} km`}
                      />
                      <Scatter dataKey="y" fill="#FFB800" name="Observed Fare" />
                      <Line
                        type="monotone"
                        dataKey="trend"
                        stroke="#FF8A00"
                        strokeWidth={2}
                        dot={false}
                        name="Trend Line"
                      />
                    </ComposedChart>
                  ) : selectedScatterFeature === 'duration' ? (
                    <ComposedChart
                      data={stats.correlation_analysis.scatter_trends.duration.points}
                      margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis
                        dataKey="x"
                        stroke="#9CA3AF"
                        fontSize={11}
                        fontFamily="monospace"
                        tickFormatter={(v) => `${v} min`}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        fontSize={11}
                        fontFamily="monospace"
                        tickFormatter={(v) => `₹${v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#171717',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '0.75rem',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                        }}
                        formatter={(value: any, name: string) => [
                          `₹${Number(value).toFixed(2)}`,
                          name === 'y' ? 'Observed Fare' : 'Linear Trend',
                        ]}
                        labelFormatter={(label) => `Trip Duration: ${label} min`}
                      />
                      <Scatter dataKey="y" fill="#38BDF8" name="Observed Fare" />
                      <Line
                        type="monotone"
                        dataKey="trend"
                        stroke="#0284C7"
                        strokeWidth={2}
                        dot={false}
                        name="Trend Line"
                      />
                    </ComposedChart>
                  ) : (
                    <ComposedChart
                      data={stats.correlation_analysis.scatter_trends.surge.points}
                      margin={{ top: 10, right: 20, bottom: 20, left: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                      <XAxis
                        dataKey="x"
                        stroke="#9CA3AF"
                        fontSize={11}
                        fontFamily="monospace"
                        tickFormatter={(v) => `${v}×`}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        fontSize={11}
                        fontFamily="monospace"
                        tickFormatter={(v) => `₹${v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#171717',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '0.75rem',
                          fontFamily: 'monospace',
                          fontSize: '12px',
                        }}
                        formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Average Final Fare']}
                        labelFormatter={(label) => `Surge Tier: ${label}×`}
                      />
                      <Line
                        type="monotone"
                        dataKey="y"
                        stroke="#FFB800"
                        strokeWidth={3}
                        dot={{ r: 6, fill: '#FFB800' }}
                        name="Mean Fare"
                      />
                    </ComposedChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-gray-400 gap-2">
                <span>
                  Linear equation:{' '}
                  <strong className="text-white">
                    {selectedScatterFeature === 'distance'
                      ? `Final_Fare ≈ ${stats.correlation_analysis.scatter_trends.distance.slope} × Distance + ${stats.correlation_analysis.scatter_trends.distance.intercept}`
                      : selectedScatterFeature === 'duration'
                      ? `Final_Fare ≈ ${stats.correlation_analysis.scatter_trends.duration.slope} × Duration + ${stats.correlation_analysis.scatter_trends.duration.intercept}`
                      : 'Discrete surge discrete multiplier distribution'}
                  </strong>
                </span>
                <span className="text-taxi-yellow">
                  Slope validates continuous base odometer increment of ~₹13.91 / km
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HYPOTHESIS TESTING */}
        {activeTab === 'hypothesis' && (
          <div className="space-y-10 animate-fade-in">
            {/* Intro Header */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-charcoal-900/60">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Scale className="w-5 h-5 text-taxi-yellow" />
                Two-Tailed Hypothesis Testing Framework (α = 0.05)
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Hypothesis testing tests whether observed sample relationships reflect real population patterns or
                mere random fluctuation. We set our significance threshold at{' '}
                <span className="font-mono text-taxi-yellow font-bold">α = 0.05</span> (95% confidence). When p &lt;
                0.05, we reject the null hypothesis. We never state &ldquo;accept the null hypothesis&rdquo;; we either
                reject H₀ or fail to reject H₀.
              </p>
            </div>

            {/* Test Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* TEST A CARD */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-taxi-yellow/30 bg-charcoal-900/70 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-taxi-yellow/15 border border-taxi-yellow/30 text-taxi-yellow text-xs font-mono font-bold uppercase tracking-wider">
                      Hypothesis Test A
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                      {stats.hypothesis_testing.test_a.decision_label}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white leading-snug">
                      Pearson Correlation Significance Test
                    </h3>
                    <p className="text-xs font-mono text-gray-400 mt-1">
                      Distance_km vs Final_Fare
                    </p>
                  </div>

                  {/* Research Question */}
                  <div className="p-3.5 rounded-xl bg-charcoal-950/80 border border-white/5 text-xs">
                    <span className="font-mono text-gray-400 uppercase tracking-wider block text-[10px] mb-1">
                      Research Question
                    </span>
                    <p className="text-gray-200 font-medium">
                      &ldquo;{stats.hypothesis_testing.test_a.research_question}&rdquo;
                    </p>
                  </div>

                  {/* Hypotheses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-charcoal-950/60 border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase">Null Hypothesis (H₀)</span>
                      <span className="text-amber-300 font-bold text-sm block mt-1">
                        {stats.hypothesis_testing.test_a.h0}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-charcoal-950/60 border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase">Alternative (H₁)</span>
                      <span className="text-taxi-yellow font-bold text-sm block mt-1">
                        {stats.hypothesis_testing.test_a.h1}
                      </span>
                    </div>
                  </div>

                  {/* Test Statistics Table */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                    <div className="p-3 rounded-xl bg-charcoal-950/70 border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase block">Sample Size (n)</span>
                      <span className="text-sm font-bold text-white">49,230</span>
                    </div>
                    <div className="p-3 rounded-xl bg-charcoal-950/70 border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase block">Pearson r</span>
                      <span className="text-sm font-bold text-taxi-yellow">+0.8455</span>
                    </div>
                    <div className="p-3 rounded-xl bg-charcoal-950/70 border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase block">t-Statistic</span>
                      <span className="text-sm font-bold text-white">351.31</span>
                    </div>
                    <div className="p-3 rounded-xl bg-charcoal-950/70 border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase block">p-Value</span>
                      <span className="text-sm font-bold text-emerald-400">&lt; 0.001</span>
                    </div>
                  </div>

                  {/* Prominent Decision Badge */}
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">
                        Decision: {stats.hypothesis_testing.test_a.decision}
                      </div>
                      <p className="text-xs text-emerald-200/90 mt-0.5">
                        p &lt; 0.001 is far below α = 0.05. We reject H₀ in favor of H₁.
                      </p>
                    </div>
                  </div>

                  {/* Conclusion */}
                  <div className="text-xs text-gray-300 leading-relaxed border-t border-white/5 pt-4">
                    <strong className="text-white block mb-1">
                      {simpleMode ? 'Plain-English Takeaway:' : 'Statistical Conclusion:'}
                    </strong>
                    {simpleMode
                      ? stats.hypothesis_testing.test_a.simple_words
                      : stats.hypothesis_testing.test_a.conclusion}
                  </div>
                </div>
              </div>

              {/* TEST B CARD */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-taxi-orange/30 bg-charcoal-900/70 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-taxi-orange/15 border border-taxi-orange/30 text-taxi-orange text-xs font-mono font-bold uppercase tracking-wider">
                      Hypothesis Test B
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold">
                      {stats.hypothesis_testing.test_b.decision_label}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white leading-snug">
                      Welch&apos;s Independent Two-Sample t-Test
                    </h3>
                    <p className="text-xs font-mono text-gray-400 mt-1">
                      Median Split: Distance ≤ 17.99 km vs &gt; 17.99 km
                    </p>
                  </div>

                  {/* Research Question */}
                  <div className="p-3.5 rounded-xl bg-charcoal-950/80 border border-white/5 text-xs">
                    <span className="font-mono text-gray-400 uppercase tracking-wider block text-[10px] mb-1">
                      Research Question
                    </span>
                    <p className="text-gray-200 font-medium">
                      &ldquo;{stats.hypothesis_testing.test_b.research_question}&rdquo;
                    </p>
                  </div>

                  {/* Groups Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-charcoal-950/60 border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase">Short Trips (≤ 17.99 km)</span>
                      <div className="text-white font-bold text-sm mt-1">Mean: ₹224.15</div>
                      <span className="text-[10px] text-gray-400">n = 24,622 | σ = ₹108.29</span>
                    </div>
                    <div className="p-3 rounded-xl bg-charcoal-950/60 border border-white/5">
                      <span className="text-gray-400 block text-[10px] uppercase">Long Trips (&gt; 17.99 km)</span>
                      <div className="text-taxi-yellow font-bold text-sm mt-1">Mean: ₹516.79</div>
                      <span className="text-[10px] text-gray-400">n = 24,608 | σ = ₹158.31</span>
                    </div>
                  </div>

                  {/* Test Statistics Table */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                    <div className="p-3 rounded-xl bg-charcoal-950/70 border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase block">Mean Diff</span>
                      <span className="text-sm font-bold text-white">+₹292.64</span>
                    </div>
                    <div className="p-3 rounded-xl bg-charcoal-950/70 border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase block">95% CI</span>
                      <span className="text-xs font-bold text-taxi-yellow">[₹290.2, ₹295.0]</span>
                    </div>
                    <div className="p-3 rounded-xl bg-charcoal-950/70 border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase block">Welch t</span>
                      <span className="text-sm font-bold text-white">239.36</span>
                    </div>
                    <div className="p-3 rounded-xl bg-charcoal-950/70 border border-white/5">
                      <span className="text-[10px] text-gray-400 uppercase block">Cohen&apos;s d</span>
                      <span className="text-sm font-bold text-emerald-400">2.16 (Huge)</span>
                    </div>
                  </div>

                  {/* Prominent Decision Badge */}
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">
                        Decision: {stats.hypothesis_testing.test_b.decision}
                      </div>
                      <p className="text-xs text-emerald-200/90 mt-0.5">
                        t = 239.36 (df ≈ 43,495), p &lt; 0.001. Massive difference between short &amp; long trips.
                      </p>
                    </div>
                  </div>

                  {/* Conclusion */}
                  <div className="text-xs text-gray-300 leading-relaxed border-t border-white/5 pt-4">
                    <strong className="text-white block mb-1">
                      {simpleMode ? 'Plain-English Takeaway:' : 'Statistical Conclusion:'}
                    </strong>
                    {simpleMode
                      ? stats.hypothesis_testing.test_b.simple_words
                      : stats.hypothesis_testing.test_b.conclusion}
                  </div>
                </div>
              </div>
            </div>

            {/* Explainer: How to Interpret Statistical Tests */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-charcoal-900/60 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-taxi-yellow" />
                How to Interpret Hypothesis Testing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-charcoal-950/80 border border-white/5">
                  <h4 className="font-bold text-taxi-yellow mb-1 font-mono">1. What is the Null Hypothesis (H₀)?</h4>
                  <p className="text-gray-300 leading-relaxed">
                    The default assertion that there is NO effect, NO correlation, or NO difference. In science, we
                    assume H₀ is true until overwhelming evidence rejects it.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-charcoal-950/80 border border-white/5">
                  <h4 className="font-bold text-taxi-yellow mb-1 font-mono">2. What does p &lt; 0.001 mean?</h4>
                  <p className="text-gray-300 leading-relaxed">
                    The probability of observing this data (or more extreme) purely by random chance if H₀ were true is
                    less than 0.1%. Because p &lt; 0.05, we decisively reject H₀.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-charcoal-950/80 border border-white/5">
                  <h4 className="font-bold text-taxi-yellow mb-1 font-mono">3. What is Cohen&apos;s d effect size?</h4>
                  <p className="text-gray-300 leading-relaxed">
                    Standardized difference between two means. While p-values confirm statistical significance, Cohen&apos;s
                    d measures practical magnitude. d = 2.16 indicates a massive practical difference.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
