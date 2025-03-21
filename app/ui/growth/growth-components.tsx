'use client';
import { useState } from 'react';
import GrowthChart from './growth-chart';
import GrowthParamsForm from './growth-params-form';
import GrowthTable from './growth-table';
import Pagination from './pagination';
import { GrowthData } from '@/app/lib/definitions';
import { lusitana } from '@/app/ui/fonts';

const convertToPlainObject = (value: { toNumber?: () => number } | number): number => {
  if (value && typeof value === 'object' && 'toNumber' in value) {
    return value.toNumber ? value.toNumber() : Number(value); // Convert Prisma Decimal to number
  }
  return typeof value === 'number' ? value : Number(value);
};

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
  const [activeTab, setActiveTab] = useState<'table' | 'chart'>('chart');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

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
      setTotalPages(Math.ceil((selectedSpecies.length * selectedYear) / 10));
    } catch (error) {
      console.error('Error fetching growth data:', error);
    }
  };

  const formattedData = formatGrowthData(growthData);

  return (
    <div className="container-mx py-10 col">
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl p-4`}>GROWTH MODELS</h1>
      <GrowthParamsForm
        onSubmit={handleSubmit}
      />
      {formattedData.length > 0 && (
        <div className="grid gap-6 p-4 w-full md:w-auto overflow-x-hidden bg-gray-50 dark:bg-zinc-900">
          <div className="flex border-b border-gray-300">
            <button
              onClick={() => setActiveTab('chart')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'chart' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
              }`}
            >
              Graph
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'table' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
              }`}
            >
              Table
            </button>
          </div>

            {activeTab === 'chart' && (
              <div className="grid gap-4 p-4 rounded-md border">
                <h2 className="text-xl font-bold mb-4 text-center">Growth Curves (CO2eq vs years)</h2>
              <div className="w-full overflow-x-auto">
              <GrowthChart data={formattedData} />
              </div>
              </div>
            )}
            {activeTab === 'table' && (
              <>
                <div className="w-full md:w-auto overflow-x-hidden">
                  <div className="w-full h-64 md:h-full">
                    <GrowthTable data={formattedData} currentPage={currentPage} />
                  </div>
                </div>
                <div className="mt-5 flex w-full justify-center md:w-auto overflow-x-hidden">
                  <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
                </div>
              </>
            )}
        </div>
      )}
    </div>
  );
}
