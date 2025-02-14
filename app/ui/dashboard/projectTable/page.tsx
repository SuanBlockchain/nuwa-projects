import { columns } from "./columns"
import { DataTable } from "./data-table"
import { fetchProjectData } from '@/app/lib/queries/queries';

export default async function ProjectTable() {
  const projectData = await fetchProjectData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={projectData} />
    </div>
  )
}
