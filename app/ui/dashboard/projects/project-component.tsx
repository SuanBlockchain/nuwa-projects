"use client";
import { useEffect, useState } from "react";
import BarChartAggregated from "./bar-chart-aggregated";
import BarChartCO2 from "./bar-chart-co2";
// import MyResponsiveTreeMap from "./project-tree-map";

import { EcosystemData } from "@/app/lib/definitions";
import { lusitana } from "../../fonts";

export default function ProjectComponent({ projectId }: { projectId?: string }) {
  const [parcelsData, setParcelsData] = useState<EcosystemData[]>([]);
  const [co2Data, setCo2Data] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    async function getParcels(projectIds: string[]) {
      try {
        setLoading(true); // Set loading to true before fetching data

        // Fetch Aggregated Data
        const aggregatedResponse = await fetch("/api/getParcels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectIds, queryType: "aggregated" }),
        });

        if (!aggregatedResponse.ok) {
          throw new Error("Failed to fetch aggregated data");
        }

        const aggregatedData = await aggregatedResponse.json();
        setParcelsData(
          aggregatedData.map((item: EcosystemData) => ({
            ecosystem: item.ecosystem,
            bgb: item.bgb,
            co2: item.co2,
            agb: item.agb,
            soc: item.soc,
          }))
        );

        // Fetch CO2 Data
        const co2Response = await fetch("/api/getParcels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectIds, queryType: "co2" }),
        });

        if (!co2Response.ok) {
          throw new Error("Failed to fetch CO2 data");
        }

        const co2Data = await co2Response.json();
        setCo2Data(co2Data);
      } catch (error) {
        console.error("Error fetching parcels", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    }

    if (projectId) {
      getParcels([projectId]);
    }
  }, [projectId]);

  return (
    <div>
      <h1
        className={`${lusitana.className} mt-6 mb-6 text-2xl md:text-3xl font-bold text-center text-mint-11 dark:text-mint-9`}
      >
        Growth data for the project
      </h1>
      <div className="container-mx py-10 col">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div>
            {loading ? (
              <p>Loading aggregated data...</p>
            ) : parcelsData.length > 0 ? (
              <div className="grid gap-4 p-4 rounded-md border">
                <h2 className="text-xl font-bold mb-4 text-center">AGB, BGB, SOC and CO2 by Specie</h2>
                <div className="w-full overflow-x-auto">
                  <BarChartAggregated data={parcelsData} />
                </div>
              </div>
            ) : (
              <p>No aggregated data available</p>
            )}
          </div>
          <div>
            {loading ? (
              <p>Loading CO2 data...</p>
            ) : co2Data.length > 0 ? (
              <div className="grid gap-4 p-4 rounded-md border">
                <h2 className="text-xl font-bold mb-4 text-center">CO2eq per year</h2>
                <div className="w-full overflow-x-auto">
                  <BarChartCO2 data={co2Data} />
                </div>
              </div>
            ) : (
              <p>No CO2 data available</p>
            )}
          </div>
        </div>
        {/* <div>
          <div style={{ height: "500px", marginTop: "20px" }}>
            {treeMapData ? (
              <MyResponsiveTreeMap data={treeMapData} />
            ) : (
              <p>No detailed parcel data available</p>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
