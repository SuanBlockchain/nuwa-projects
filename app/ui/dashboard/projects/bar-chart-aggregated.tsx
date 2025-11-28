'use client';
import { ResponsiveBar } from '@nivo/bar';
import { BarDatum } from '@nivo/bar';
import { useTheme } from 'next-themes';
import { useMediaQuery } from 'react-responsive';
import { useMemo, memo } from 'react';

interface MyResponsiveBarProps {
    data: BarDatum[];
}

function formatNumber(value: number): string {
  if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + 'M';
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(1) + 'K';
  } else {
    return value.toString();
  }
}

// OPTIMIZATION: Memoize tooltip component to prevent re-creation
const CustomTooltip = memo(({ value }: { value: number }) => {
  const { theme } = useTheme();
  const labelBackgroundColor = theme === 'dark' ? '#333' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#000';

  return (
    <div style={{ backgroundColor: labelBackgroundColor, color: textColor, padding: '5px', borderRadius: '3px' }}>
      {formatNumber(value)}
    </div>
  );
});
CustomTooltip.displayName = 'CustomTooltip';

const BarChartAggregated = ({ data }: MyResponsiveBarProps) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
  const { theme } = useTheme();

  const textColor = theme === 'dark' ? '#fff' : '#000';

  // OPTIMIZATION: Memoize theme configuration to prevent re-creation on every render
  const chartTheme = useMemo(() => ({
    labels: {
      text: {
        fontSize: isMobile ? 8 : isTablet ? 10 : 10,
        fill: textColor
      },
    },
    axis: {
      ticks: {
        text: {
          fontSize: isMobile ? 8 : isTablet ? 10 : 10,
          fill: textColor
        },
      },
      legend: {
        text: {
          fill: textColor
        }
      }
    },
    legends: {
      text: {
        fill: textColor
      }
    }
  }), [isMobile, isTablet, textColor]);

  // OPTIMIZATION: Memoize legends configuration
  const legends = useMemo(() => {
    const itemDirection: 'top-to-bottom' | 'left-to-right' = isMobile ? 'top-to-bottom' : 'left-to-right';
    return [{
      dataFrom: 'keys' as const,
      anchor: 'top' as const,
      direction: 'row' as const,
      justify: false,
      translateX: 0,
      translateY: isMobile ? -50 : -30,
      itemsSpacing: 2,
      itemWidth: isMobile ? 60 : 100,
      itemHeight: 20,
      itemDirection,
      itemOpacity: 0.85,
      symbolSize: isMobile ? 10 : 20,
      effects: [
        {
          on: 'hover' as const,
          style: {
            itemOpacity: 1
          }
        }
      ]
    }];
  }, [isMobile]);

  return (
    <div style={{ height: isMobile ? '300px' : '500px', width: '100%' }}>
        <ResponsiveBar
            data={data}
            keys={['bgb', 'co2', 'agb', 'soc']}
            indexBy="ecosystem"
            margin={{ top: 50, right: 30, bottom: isMobile ? 100 : 50, left: 60 }}
            padding={0.3}
            groupMode="grouped"
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            borderColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
            }}
            axisTop={null}
            axisRight={null}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Tonnes',
                legendPosition: 'middle',
                legendOffset: -50,
                format: (value) => formatNumber(value as number)
            }}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: isMobile ? 45 : 0,
                legend: 'Ecosystem',
                legendPosition: 'middle',
                legendOffset: 32,
                truncateTickAt: 0
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
            }}
            tooltip={({ value }) => <CustomTooltip value={value as number} />}
            label={(d) => formatNumber(d.value as number)}
            legends={legends}
            theme={chartTheme}
        />
    </div>
  );
};

// OPTIMIZATION: Wrap component with React.memo for prop-based memoization
export default memo(BarChartAggregated);