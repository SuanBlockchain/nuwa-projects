import { fetchProjectData } from '@/app/lib/queries/queries';
import ProjectStatus from './project-status';
import { ProjectDetails } from './project-buttons';

export default async function ProjectsTable() {
  const projectData = await fetchProjectData();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile-friendly version */}
          <div className="md:hidden">
            {projectData.map((project, index) => (
              <div
                key={`${project.name}-${index}`}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-sm text-gray-500">{project.name}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Title</p>
                    <p className="text-sm text-gray-500 truncate">{project.title}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Country</p>
                    <p className="text-sm text-gray-500">{project.country}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <p className="text-sm text-gray-500">{project.status}</p>
                  </div>
                </div>
                {/* <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Description</p>
                    <p className="text-sm text-gray-500 truncate">{project.description}</p>
                  </div>
                </div> */}
              </div>
            ))}
          </div>
          {/* Desktop version */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Details
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Title
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Country
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Status
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {projectData.map((project, index) => (
                <tr
                  key={`${project.name}-${index}`}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="flex items-center justify-center gap-2">
                    <ProjectDetails id={project.name} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{project.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 max-w-xs truncate">
                    {project.title}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {project.country}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <ProjectStatus status={project.status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 max-w-xs truncate">
                    {project.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}