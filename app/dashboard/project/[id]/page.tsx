import CardWrapper from '@/app/ui/dashboard/cards';
import ProjectComponent from '@/app/ui/dashboard/projects/project-component';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main>
      <div className="flex-grow p-4 md:overflow-y-auto md:p-12">
        <CardWrapper projectId={id} />
        <div className="mt-6 p-2">
          <div className="mt-6 rounded-md border bg-gray-50 dark:bg-zinc-900">
            <ProjectComponent projectId={id} />
          </div>
        </div>
      </div>
    </main>
  );
}
