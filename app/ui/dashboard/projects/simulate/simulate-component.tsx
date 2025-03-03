import { fetchSpeciesByProjectId } from "@/app/lib/queries/queries";
import SimulateParamsForm from "./simulate-params-form";


export default async function SimulateComponent({ projectId }: { projectId?: string }) {
    let speciesList;
    if (projectId) {
        speciesList = await fetchSpeciesByProjectId(projectId);
    } else {
        return null;
    }

    return (
        <main>
            <div className="container-mx py-10 col">
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <div className="w-full overflow-x-auto"> */}
                        {/* <h1 className="text-2xl font-bold mb-4">Simulate Growth for the project</h1> */}
                        <SimulateParamsForm projectId={projectId} speciesList={speciesList} initialPopulationTable={[]} />
                    {/* </div> */}
                    
                {/* </div> */}
            </div>
            {/* <div className="max-w-2xl mx-auto p-4">
            </div> */}
        </main>
    )


}