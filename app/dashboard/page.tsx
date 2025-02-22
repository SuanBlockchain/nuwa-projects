import CardWrapper from '@/app/ui/dashboard/cards';
import ProjectTable from '@/app/ui/dashboard/projects/page';

export const dynamic = 'force-dynamic';
 
export default async function Page() {
  return (
    <main>
      <div className="flex-grow md:overflow-y-auto md:p-12">
        <CardWrapper />
        <div className="mt-6 p-2">
          <div className="mt-6 rounded-md border bg-gray-50 dark:bg-zinc-900">
              <ProjectTable />
          </div>
        </div>
      </div>
    </main>
  );
}