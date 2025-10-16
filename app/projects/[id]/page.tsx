import { prisma } from "../../lib/prisma";
import MintButton from "./_mint-button";
import BuyForm from "./_buy-form";

export default async function ProjectDetail({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { holdings: true, projectToken: true },
  });

  if (!project) return <div className="p-6">Proyecto no encontrado</div>;

  const total = Number(project.supplyTotal ?? 0);
  const bought = project.holdings.reduce((sum, h) => sum + Number(h.amount), 0);
  const available = Math.max(0, total - bought);

  return (
    <main className="p-6 space-y-6">
      <div className="border rounded-2xl p-4">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <p className="opacity-80 mt-2">{project.description}</p>
        <div className="mt-4 grid gap-2 text-sm">
          <div>Supply total: <b>{total.toLocaleString()}</b></div>
          <div>Vendidas: <b>{bought.toLocaleString()}</b></div>
          <div>Disponibles: <b>{available.toLocaleString()}</b></div>
          <div>
            Token: <b>{project.projectToken?.symbol ?? "—"}</b>
            {project.projectToken?.address ? ` (${project.projectToken.address})` : ""}
          </div>
        </div>
        <div className="mt-4">
          <MintButton projectId={project.id} />
        </div>
      </div>

      <div className="border rounded-2xl p-4">
        <h2 className="text-lg font-semibold">Invertir</h2>
        <BuyForm projectId={project.id} maxAmount={available} />
      </div>
    </main>
  );
}
