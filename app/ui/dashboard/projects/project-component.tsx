"use client";
import { useEffect, useState } from "react";
import MyResponsiveBar from "./bar-chart";
import MyResponsiveTreeMap from "./project-tree-map";

import { EcosystemData, TreeNode } from "@/app/lib/definitions";

export default function ProjectComponent({ projectId }: { projectId?: string }) {
  const [parcelsData, setParcelsData] = useState<EcosystemData[]>([]);
  const [treeMapData, setTreeMapData] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getParcels(projectIds: string[]) {
      try {
        setLoading(true);

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
            co2_captured: item.co2_captured,
            agb: item.agb,
            soc_total: item.soc_total,
          }))
        );

        // Fetch Detailed Data (Tree Map)
        const detailsResponse = await fetch("/api/getParcels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectIds, queryType: "details" }),
        });

        if (!detailsResponse.ok) {
          throw new Error("Failed to fetch detailed parcel data");
        }

        const detailsData: TreeNode = await detailsResponse.json();
        setTreeMapData(detailsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching parcels", error);
        setLoading(false);
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
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {parcelsData.length > 0 ? (
              <MyResponsiveBar data={parcelsData} />
            ) : (
              <p>No aggregated data available</p>
            )}
            <div style={{ height: "500px", marginTop: "20px" }}>
              {treeMapData ? (
                <MyResponsiveTreeMap data={treeMapData} />
              ) : (
                <p>No detailed parcel data available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
