import CardWrapper from '@/app/ui/dashboard/cards';
import ProjectTable from '@/app/ui/dashboard/projects/page';

export const dynamic = 'force-dynamic';
 
export default async function Page() {
  return (
    <main>
          <CardWrapper />
        <div className="mt-6 p-4 border border-gray-300 rounded-b-lg">
          <ProjectTable />
        </div>
    </main>
  );
}