'use client';
import { useEffect, useState } from "react";
import MyResponsiveBar from "./bar-chart";
import { BarDatum } from '@nivo/bar';

interface ParcelData extends BarDatum {
  species: string;
  bgb: number;
  co2_captured: number;
  agb: number;
  soc_total: number;
}

export default function ProjectComponent({ projectId }: { projectId?: string }) {
  const [parcelsData, setParcelsData] = useState<ParcelData[]>([]);

  // Fetch species options from the database
  useEffect(() => {
    async function getParcels (projectIds: string[]) {
      try {
        const response = await fetch('/api/getParcels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectIds }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch growth data');
        }

        const data: ParcelData[] = await response.json();
        setParcelsData(data);
      } catch (error) {
        console.error('Error fetching parcels', error);
      }
    }

    if (projectId) {
      getParcels([projectId]);
    }
  }, [projectId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">AGB, BGB, SOC and CO2 by Specie</h2>
      <div className="p-4 border border-gray-300 rounded-b-lg">
        <MyResponsiveBar data={parcelsData} />
      </div>
    </div>
  );
}