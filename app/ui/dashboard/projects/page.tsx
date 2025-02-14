/* eslint-disable @typescript-eslint/no-explicit-any */
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { fetchProjectData } from '@/app/lib/queries/queries';

export default async function ProjectTable() {
  const rawData = await fetchProjectData();
  const projectData = rawData.map((item: any) => ({
    ...item,
    values: item.values || { total_investment: { value: 0 } },
  }));

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={projectData} />
    </div>
  )
}
