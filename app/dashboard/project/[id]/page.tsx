import CardWrapper from '@/app/ui/dashboard/cards';
import ProjectComponent from '@/app/ui/dashboard/projects/project-component';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;


  return (
    <main>
      <CardWrapper projectId={id} />
      <div className="p-4 border border-gray-300 rounded-b-lg">
      <ProjectComponent projectId={id} />
      </div>
    </main>
  );
}
