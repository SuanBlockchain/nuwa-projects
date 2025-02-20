'use client';
import { ResponsiveBar } from '@nivo/bar';
import { BarDatum } from '@nivo/bar';
import { useMediaQuery } from 'react-responsive';

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

const BarChartAggregated = ({ data }: MyResponsiveBarProps) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div style={{ height: '500px' }}> {/* Ensure the parent container has a defined height */}
        <ResponsiveBar
            data={data}
            keys={[
                'bgb',
                'co2',
                'agb',
                'soc'
            ]}
            indexBy="ecosystem"
            margin={{ top: 50, right: 30, bottom: isMobile ? 80 : 50, left: 60 }}
            padding={0.3}
            groupMode="grouped"
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
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
                modifiers: [
                    [
                        'darker',
                        1.6
                    ]
                ]
            }}
            label={(d) => formatNumber(d.value as number)}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'top',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: isMobile ? -50 : -30,
                    itemsSpacing: 2,
                    itemWidth: isMobile ? 60 : 100,
                    itemHeight: 20,
                    itemDirection: isMobile ? 'top-to-bottom' : 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: isMobile ? 10 : 20,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
            theme={{
                labels: {
                    text: {
                        fontSize: isMobile ? 8 : 14,
                    },
                },
                axis: {
                    ticks: {
                        text: {
                            fontSize: isMobile ? 8 : 12,
                        },
                    },
                },
            }}
        />
    </div>
  );
};

export default BarChartAggregated;