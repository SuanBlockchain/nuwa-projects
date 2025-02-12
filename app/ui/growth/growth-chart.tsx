'use client';
import { ResponsiveLine } from '@nivo/line';

interface LineChartProps {
  data: {
    id: string;
    data: { x: string | number; y: number }[];
  }[];
}

const GrowthChart: React.FC<LineChartProps> = ({ data }) => {

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">Please choose your options and press submit</p>;
  }

  return (
    <div className="rounded-md bg-gray-50 p-4 md:p-6">

      <div style={{ height: '500px', width: '100%' }}>
        <h2 className="text-xl font-bold mb-4 text-center">Growth Curves (CO2eq vs years)</h2>
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
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'year',
            legendOffset: 36,
            legendPosition: 'middle',
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Co2eq (Kg)',
            legendOffset: -55,
            legendPosition: 'middle',
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
            },
          ]}
        />
      </div>
    </div>
  );
};

export default GrowthChart;
