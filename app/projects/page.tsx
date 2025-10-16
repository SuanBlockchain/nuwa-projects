import Link from "next/link";
import { prisma } from "../lib/prisma";

export default async function ProjectsIndex() {
  // 👉 Lista (findMany), no unique
  const projects = await prisma.project.findMany({
    include: { holdings: true, projectToken: true },
    orderBy: { createdAt: "desc" },
  });

  if (projects.length === 0) {
    return (
      <main className="p-6">
        <p>No hay proyectos aún.</p>
      </main>
    );
  }

  return (
    <main className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => {
        const total = Number(p.supplyTotal ?? 0);
        const bought = p.holdings.reduce((sum, h) => sum + Number(h.amount), 0);
        const progress = total > 0 ? Math.min(100, Math.round((bought / total) * 100)) : 0;

        return (
          <Link key={p.id} href={`/projects/${p.id}`} className="block border rounded-2xl p-4 hover:shadow">
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p className="opacity-80 mt-1">{p.description}</p>
            <div className="mt-3 text-sm space-y-1">
              <div>Total: <b>{total.toLocaleString()}</b></div>
              <div>Vendidas: <b>{bought.toLocaleString()}</b></div>
              <div>Progreso: <b>{progress}%</b></div>
            </div>
            <div className="mt-2 h-2 rounded bg-gray-200 overflow-hidden">
              <div className="h-full bg-emerald-600" style={{ width: `${progress}%` }} />
            </div>
          </Link>
        );
      })}
    </main>
  );
}
