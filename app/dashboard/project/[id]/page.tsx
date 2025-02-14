import CardWrapper from '@/app/ui/dashboard/cards';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main>
      <CardWrapper projectId={id} />
    </main>
  );
}
