'use client';
import { useState } from 'react';
import GrowthChart from './growth-chart';
import GrowthParamsForm from './growth-params-form';

// Helper function to safely convert values to plain JavaScript numbers
const convertToPlainObject = (value: { toNumber?: () => number } | number): number => {
  if (value && typeof value === 'object' && 'toNumber' in value) {
    return value.toNumber ? value.toNumber() : Number(value); // Convert Prisma Decimal to number
  }
  return typeof value === 'number' ? value : Number(value);
};

// Helper function to format the data
interface GrowthData {
  species: string;
  year: number;
  co2eq: { toNumber: () => number } | number;
}

const formatGrowthData = (growthData: GrowthData[]) => {
  // Group data by species
  const groupedData = growthData.reduce((acc: { [key: string]: { x: number; y: number }[] }, curr) => {
    if (!acc[curr.species]) {
      acc[curr.species] = [];
    }
    acc[curr.species].push({
      x: curr.year,
      y: convertToPlainObject(curr.co2eq), // Convert `altura` to plain number
    });
    return acc;
  }, {});


  // Convert grouped data into Nivo-compatible format
  return Object.keys(groupedData).map((species) => ({
    id: species,
    data: groupedData[species],
  }));
};

export default function GrowthComponent() {
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);

  const handleSubmit = async (selectedSpecies: string[], selectedYear: number) => {
    try {
      const response = await fetch('/api/getGrowCurves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedSpecies, selectedYear }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch growth data');
      }

      const data = await response.json();
      setGrowthData(data);
    } catch (error) {
      console.error('Error fetching growth data:', error);
    }
  };

  const formattedData = formatGrowthData(growthData);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Growth Models</h2>
      <GrowthParamsForm
        onSubmit={handleSubmit}
      />
      {formattedData.length > 0 && <GrowthChart data={formattedData} />}
    </div>
  );
}
