import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma"; // ajusta si tu ruta es distinta

// ---------- Utilidades de tipado ----------
type NumLike = number | Prisma.Decimal | null | undefined;

function toNumber(n: NumLike, fallback = 0): number {
  if (n == null) return fallback;
  return typeof n === "number" ? n : Number(n);
}

// ---------- Helpers seguros (sin any) ----------
async function safeQueryRow<K extends string>(
  q: Prisma.Sql,
  defaults: Record<K, number>
): Promise<Record<K, number>> {
  try {
    const rows = await prisma.$queryRaw<Array<Record<K, NumLike>>>(q);
    const row = rows?.[0];
    if (row) {
      const out: Record<K, number> = { ...defaults };
      (Object.keys(defaults) as K[]).forEach((k) => {
        out[k] = toNumber(row[k], defaults[k]);
      });
      return out;
    }
  } catch {
    /* swallow */
  }
  return { ...defaults };
}

async function safeQueryNumber<K extends string>(
  q: Prisma.Sql,
  field: K
): Promise<number> {
  try {
    const rows = await prisma.$queryRaw<Array<Record<K, NumLike>>>(q);
    const v = rows?.[0]?.[field];
    return toNumber(v, 0);
  } catch {
    return 0;
  }
}

async function safeCountParcels(where?: Prisma.ParcelsWhereInput): Promise<number> {
  try {
    return await prisma.parcels.count({ where });
  } catch {
    return 0;
  }
}

async function safeAggregateParcelsArea(projectId?: string): Promise<number> {
  try {
    const agg = await prisma.parcels.aggregate({
      where: projectId ? { projectId } : undefined,
      _sum: { area: true },
    });
    return Number(agg._sum.area ?? 0);
  } catch {
    return 0;
  }
}

// ---------- Dashboard global ----------
export async function fetchCardData() {
  // Totales de parcelas y área
  const landNumber = await safeCountParcels();
  const area = await safeAggregateParcelsArea();

  // Si no existen funciones/vistas, devolvemos 0 sin romper
  const { sum_co2_total, average_co2_total } = await safeQueryRow(
    Prisma.sql`SELECT * FROM avg_all_parcels_co2eq_totals()`,
    { sum_co2_total: 0, average_co2_total: 0 }
  );

  const totalInvestment = await safeQueryNumber(
    Prisma.sql`SELECT * FROM total_investment`,
    "total_investment"
  );

  const totalBankableInvestment = await safeQueryNumber(
    Prisma.sql`SELECT * FROM total_bankable_investment`,
    "total_bankable_investment"
  );

  const totalIncome = await safeQueryNumber(
    Prisma.sql`SELECT * FROM total_income`,
    "total_income"
  );

  const totalImpact = sum_co2_total; // placeholder si aún no tienes total_impact()
  const totalco2 = sum_co2_total;

  return {
    totalImpact,
    totalInvestment,
    totalBankableInvestment,
    totalIncome,
    landNumber,
    totalco2,
    area,
    averageCo2Total: average_co2_total,
    sumCo2Total: sum_co2_total,
    projectName: "ALL PROJECTS",
  };
}

// ---------- Lista de proyectos ----------
export async function fetchProjectData() {
  try {
    return await prisma.project.findMany();
  } catch (e) {
    console.error("Database Error:", e);
    throw new Error("Failed to fetch growth data.");
  }
}

export async function fetchSpeciesByProjectId(projectId: string): Promise<string[]> {
  const rows = await prisma.species.findMany({
    where: { parcels: { some: { projectId } } },
    select: { common_name: true },
    distinct: ["common_name"], // ← evita repetidos por nombre común
  });
  return rows.map(r => r.common_name);
}

// ---------- Por proyecto ----------
type ValueNum = { value?: number | string | Prisma.Decimal } | null | undefined;
interface ProjectValues {
  impact?: ValueNum;
  total_investment?: ValueNum;
  bankable_investment?: ValueNum;
  income?: ValueNum;
}

function readValueNum(v: ValueNum, fallback = 0): number {
  if (!v || typeof v !== "object" || !("value" in v)) return fallback;
  const raw = (v as { value?: unknown }).value;
  if (raw == null) return fallback;
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") return Number(raw);
  if (raw && typeof raw === "object" && "toString" in raw) {
    return Number(String(raw));
  }
  return fallback;
}

export async function fetchProjectById(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      select: {
        name: true,
        title: true,
        values: true, // Json
      },
    });

    if (!project) {
      return {
        projectName: null,
        totalImpact: 0,
        totalInvestment: 0,
        totalBankableInvestment: 0,
        totalIncome: 0,
        landNumber: 0,
        totalco2: 0,
        area: 0,
        averageCo2Total: 0,
        sumCo2Total: 0,
      };
    }

    const projectName = project.title ?? project.name ?? null;

    const landNumber = await safeCountParcels({ projectId: id });
    const area = await safeAggregateParcelsArea(id);

    // Tablas materializadas/dinámicas (si no existen, devuelve 0)
    const compactId = id.replace(/-/g, "").substring(0, 20);
    const agbsTable = Prisma.raw(`parcels_agbs_project_${compactId}`);
    const co2Table = Prisma.raw(`parcels_co2eq_project_${compactId}`);

    // totalco2 / area (AGBs)
    let totalco2 = 0;
    try {
      const rows = await prisma.$queryRaw<Array<{ totalco2: NumLike; area: NumLike }>>(
        Prisma.sql`SELECT SUM(parcel_co2eq_total) as totalco2, SUM(area) as area FROM ${agbsTable}`
      );
      const row = rows?.[0];
      totalco2 = toNumber(row?.totalco2, 0);
      // si quieres usar el área de esta tabla cuando aggregate devuelve 0:
      // const areaFromTable = toNumber(row?.area, 0);
    } catch {
      // tabla no existe
    }

    // sum/avg CO2 (tabla co2eq)
    let sumCo2Total = 0;
    let averageCo2Total = 0;
    try {
      const res = await prisma.$queryRaw<
        Array<{ sum_co2_total: NumLike; average_co2_total: NumLike }>
      >(
        Prisma.sql`
          SELECT SUM(co2Total) as sum_co2_total, AVG(co2TotalArea) as average_co2_total
          FROM (
            SELECT
              parcel_name,
              SUM(co2eq_ton) as co2Total,
              (SUM(co2eq_ton) / p.area) as co2TotalArea
            FROM ${co2Table} as co2parcel
            LEFT JOIN public."Parcels" as p ON co2parcel.parcel_id = p.id
            GROUP BY parcel_name, area
          ) as sub
        `
      );
      const row = res?.[0];
      sumCo2Total = toNumber(row?.sum_co2_total, 0);
      averageCo2Total = toNumber(row?.average_co2_total, 0);
    } catch {
      // tabla no existe
    }

    // `values` es JSON: hacemos narrowing a nuestro shape sin usar `any`
    const values = (project.values ?? {}) as unknown;
    const pv: ProjectValues = (typeof values === "object" && values !== null
      ? values
      : {}) as ProjectValues;

    const totalImpact = readValueNum(pv.impact, sumCo2Total);
    const totalInvestment = readValueNum(pv.total_investment, 0);
    const totalBankableInvestment = readValueNum(pv.bankable_investment, 0);
    const totalIncome = readValueNum(pv.income, 0);

    return {
      projectName,
      totalImpact,
      totalInvestment,
      totalBankableInvestment,
      totalIncome,
      landNumber,
      totalco2: totalco2 || sumCo2Total, // usa el mejor disponible
      area,
      averageCo2Total,
      sumCo2Total,
    };
  } catch (e) {
    console.error("Database Error:", e);
    throw new Error("Failed to fetch project data.");
  }
}
