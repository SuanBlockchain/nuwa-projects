import { fetchSpeciesByProjectId } from "@/app/lib/queries/queries";
import SimulateParamsForm from "./simulate-params-form";
import { lusitana } from "@/app/ui/fonts";


export default async function SimulateComponent({ projectId }: { projectId?: string }) {
    let speciesList;
    if (projectId) {
        speciesList = await fetchSpeciesByProjectId(projectId);
    } else {
        return null;
    }

    return (
        <main>
            <h1
                className={`${lusitana.className} mt-6 mb-6 text-2xl md:text-3xl font-bold text-center text-mint-11 dark:text-mint-9`}
                >
                Forecast growth for the project
            </h1>
                <SimulateParamsForm projectId={projectId} speciesList={speciesList} initialPopulationTable={[]} />
        </main>
    )


}