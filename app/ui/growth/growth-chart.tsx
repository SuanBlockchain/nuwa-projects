'use client';
import { ResponsiveLine } from '@nivo/line';
import { useTheme } from 'next-themes';

import { LineChartProps } from '@/app/lib/definitions';
import { useMediaQuery } from 'react-responsive';

const GrowthChart: React.FC<LineChartProps> = ({ data }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#fff' : '#000';
  const backgroundColor = theme === 'dark' ? '#333' : '#fff';

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">Please choose your options and press submit</p>;
  }

  return (
    <div className="rounded-md p-4 md:p-6" style={{ backgroundColor }}>
      <div style={{ height: '500px', width: '100%' }}>
        <h2 className="text-xl font-bold mb-4 text-center" style={{ color: textColor }}>Growth Curves (CO2eq vs years)</h2>
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false,
          }}
          yFormat={function (y) { return typeof y === 'number' ? y.toPrecision(4) : String(y); }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'year',
            legendOffset: 36,
            legendPosition: 'middle',
            tickValues: 5,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Co2eq (Kg)',
            legendOffset: -55,
            legendPosition: 'middle',
            tickValues: 5,
          }}
          colors={{ scheme: 'category10' }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: 'right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
              itemTextColor: textColor,
            },
          ]}
          theme={{
            background: backgroundColor,
            labels: {
              text: {
                fontSize: isMobile ? 8 : isTablet ? 10 : 10,
                fill: textColor // Set label text color based on mode
              },
            },
            axis: {
              ticks: {
                text: {
                  fontSize: isMobile ? 8 : isTablet ? 10 : 10,
                  fill: textColor // Set axis tick text color based on mode
                },
              },
              legend: {
                text: {
                  fill: textColor // Set axis legend text color based on mode
                }
              }
            },
            legends: {
              text: {
                fill: textColor // Set legend text color based on mode
              }
            },
            tooltip: {
              container: {
                background: backgroundColor,
                color: textColor,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default GrowthChart;
