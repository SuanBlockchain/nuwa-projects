import dynamic from 'next/dynamic';

// OPTIMIZATION: Dynamically import chart components with loading fallback
// This reduces initial bundle size by code-splitting heavy visualization libraries

export const BarChartAggregatedLazy = dynamic(
  () => import('./bar-chart-aggregated'),
  {
    loading: () => (
      <div className="h-[500px] w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">Loading chart...</span>
      </div>
    ),
    ssr: false // Disable SSR for charts to reduce initial bundle
  }
);

export const BarChartCO2Lazy = dynamic(
  () => import('./bar-chart-co2'),
  {
    loading: () => (
      <div className="h-[500px] w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-400">Loading chart...</span>
      </div>
    ),
    ssr: false
  }
);
