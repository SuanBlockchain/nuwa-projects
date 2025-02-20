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

const BarChartCO2 = ({ data }: MyResponsiveBarProps) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Transform data to sum CO2 by year and species across all ecosystems
  const transformedData = data.reduce((acc: { year: string | number, [key: string]: string | number }[], curr) => {
    const existingYear = acc.find(item => item.year === curr.year);
    if (existingYear) {
      existingYear[curr.species as string] = (parseFloat(existingYear[curr.species as string]?.toString() || '0') || 0) + parseFloat(curr.co2total as string);
    } else {
      acc.push({
        year: curr.year,
        [curr.species]: parseFloat(curr.co2total as string),
      });
    }
    return acc;
  }, []);

  return (
    <div style={{ height: '500px' }}> {/* Ensure the parent container has a defined height */}
        <ResponsiveBar
            data={transformedData}
            keys={Array.from(new Set(data.map(d => d.species as string)))}
            indexBy="year"
            margin={{ top: 50, right: 30, bottom: isMobile ? 80 : 50, left: 60 }} // Adjusted right margin
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
                legend: 'Tonnes of CO2eq',
                legendPosition: 'middle',
                legendOffset: -55,
                format: (value) => formatNumber(value as number),
                tickValues: 5,
            }}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: isMobile ? 45 : 0,
                legend: 'Year',
                legendPosition: 'middle',
                legendOffset: 32,
                truncateTickAt: 0
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor="#000" // Set label text color to black
            label={(d) => formatNumber(d.value as number)}
            enableLabel={true} // Ensure labels are always enabled
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: "top",
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: isMobile ? -50 : -30,
                    itemsSpacing: 2,
                    itemWidth: isMobile ? 100 : 100,
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
                        fontSize: isMobile ? 8 : 10,
                    },
                },
                axis: {
                    ticks: {
                        text: {
                            fontSize: isMobile ? 8 : 10,
                        },
                    },
                },
            }}
        />
    </div>
  );
};

export default BarChartCO2;