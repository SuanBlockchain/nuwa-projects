import path from "path";
import fs from "fs";
import { CellValue, CoverageUnitsMapping, CoverageValues, EcosystemUnitsMapping, EcosystemValues, ProjectUnitsMapping, ProjectValues, SpeciesUnitsMapping, SpeciesValues } from "../definitions";
import ExcelJS from "exceljs";
import { Index, Prisma, Status } from "@prisma/client";
import { z } from "zod";

import { prisma } from '@/prisma';

// ✅ Define validation schema for keywords
const keywordSchema = z.object({
  name: z.string(),
});


// ✅ Helper function to save the file
export async function saveFile(file: File) {
    const data = Buffer.from(await file.arrayBuffer());
    const filePath = path.join("/tmp", file.name);
    await fs.promises.writeFile(filePath, data);
    return filePath;
  }

function getCellValue(cell: ExcelJS.Cell): CellValue {
  if (cell.type === ExcelJS.ValueType.Formula) {
    return cell.result as CellValue;
  }
  return cell.value as CellValue;
}

export async function projectsParser(worksheet: ExcelJS.Worksheet): Promise<Prisma.ProjectCreateInput[]> {
  // Get the current user, for the time being is always the same
  const email = "user@nuwa.com"
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    throw new Error(`Could not find any user with email '${email}'`);
  }



  const projects: Prisma.ProjectCreateInput[] = [];

  // ✅ Extract Project data

    worksheet.eachRow(async (row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      
      const projectData = {
        
        name: getCellValue(row.getCell(1)) as string, // Column A
        title: getCellValue(row.getCell(2)) as string, // Column B
        description: getCellValue(row.getCell(3)) as string | null, // Column C
        country: getCellValue(row.getCell(4)) as string | null, // Column D
        status: getCellValue(row.getCell(5)) as Status | undefined, // Column E
        department: getCellValue(row.getCell(6)) as string | null, // Column F
      };
      const keywords = getCellValue(row.getCell(7)) as string | null // Column G
      const keywordsArray = keywords ? keywords.split(",").map((k) => k.trim()) : [];
      
      const values = {
        impact: getCellValue(row.getCell(8)) as number | null, // Column H
        total_investment: getCellValue(row.getCell(9)) as number | null, // Column I
        bankable_investment: getCellValue(row.getCell(10)) as number | null, // Column J
        income: getCellValue(row.getCell(11)) as number | null, // Column K
        areaC1: getCellValue(row.getCell(12)) as number | null, // Column L
        areaC2: getCellValue(row.getCell(13)) as number | null, // Column M
        income_other: getCellValue(row.getCell(14)) as number | null, // Column N
        term: getCellValue(row.getCell(15)) as number | null, // Column O
        lands: getCellValue(row.getCell(16)) as number | null, // Column P
        abstract: getCellValue(row.getCell(17)) as string | null, // Column Q
        investment_teaser: getCellValue(row.getCell(18)) as string | null, // Column R
        geolocation_point: getCellValue(row.getCell(19)) as string | null, // Column S
        polygone: getCellValue(row.getCell(20)) as string | null, // Column T
        tree_quantity: getCellValue(row.getCell(21)) as number | null, // Column U
        token_granularity: getCellValue(row.getCell(22)) as number | null // Column B
      }
      const jsonValues: Prisma.InputJsonValue = formatValuesProject(values);
      
      projects.push({
        ...projectData,
        values: jsonValues,
        creator: { connect: { id: user?.id } },
        keywords: {
          create: keywordsArray.map((keyword) => ({ 
            keyword: { connectOrCreate: { where: { name: keyword }, create: { name: keyword } } // associating the keyword with the project
           }})),
        },
      });
  
    });

  return projects;
}

export async function parcelsParser(worksheet: ExcelJS.Worksheet): Promise<Prisma.ParcelsCreateManyInput[]> {
  const parcels: Prisma.ParcelsCreateManyInput[] = [];

  // ✅ Extract all unique project names, ecosystem types, and species common names from the worksheet
  const projectNames = new Set<string>();
  const ecosystemTypes = new Set<string>();
  const speciesNames = new Set<string>();

  for (const row of worksheet.getRows(2, worksheet.rowCount - 1) || []) {
    projectNames.add(getCellValue(row.getCell(2)) as string);
    ecosystemTypes.add(getCellValue(row.getCell(3)) as string);
    speciesNames.add(getCellValue(row.getCell(4)) as string);
  }

  // ✅ Batch fetch all projects, ecosystems, and species in a single query
  const [projects, ecosystems, species] = await Promise.all([
    prisma.project.findMany({
      where: { name: { in: Array.from(projectNames) } },
      select: { id: true, name: true },
    }),
    prisma.ecosystem.findMany({
      where: { type: { in: Array.from(ecosystemTypes) } },
      select: { id: true, type: true },
    }),
    prisma.species.findMany({
      where: { common_name: { in: Array.from(speciesNames) } },
      select: { id: true, common_name: true },
    }),
  ]);

  // ✅ Create lookup maps for efficient ID access
  const projectMap = new Map(projects.map((p) => [p.name, p.id]));
  const ecosystemMap = new Map(ecosystems.map((e) => [e.type, e.id]));
  const speciesMap = new Map(species.map((s) => [s.common_name, s.id]));

  // ✅ Process each row and build the parcels array
  for (const row of worksheet.getRows(2, worksheet.rowCount - 1) || []) {
    const project = getCellValue(row.getCell(2)) as string | null; // Column B
    const ecosystem = getCellValue(row.getCell(3)) as string | null; // Column C
    const specie = getCellValue(row.getCell(4)) as string | null; // Column D

    const projectId = project ? projectMap.get(project) : undefined;
    const ecosystemId = ecosystem ? ecosystemMap.get(ecosystem) : undefined;
    const speciesId = specie ? speciesMap.get(specie) : undefined;

    const parcelData = {
      name: getCellValue(row.getCell(1)) as string, // Column A
      area: (getCellValue(row.getCell(5)) as number) || 0, // Column E
      municipality: getCellValue(row.getCell(6)) as string | null, // Column F
      department: getCellValue(row.getCell(7)) as string | null, // Column G
      cadastral_id: getCellValue(row.getCell(8)) as string | null, // Column H
      geolocation: getCellValue(row.getCell(9))
        ? { value: getCellValue(row.getCell(9)) }
        : Prisma.JsonNull, // Column I
      polygon: getCellValue(row.getCell(10)) ? { value: getCellValue(row.getCell(10)) } : Prisma.JsonNull, // Column J
      area_factor: (getCellValue(row.getCell(11)) as number) || 0, // Column K
    };

    parcels.push({
      ...parcelData,
      projectId,
      ecosystemId: ecosystemId ?? "",
      speciesId,
    });
  }

  return parcels;
}

// ✅ Helper function to parse Coverage data
export async function coverageParser(worksheet: ExcelJS.Worksheet): Promise<Prisma.CoverageCreateManyInput[]> {
  const coverage: Prisma.CoverageCreateManyInput[] = [];

  const ecosystem = new Set<string>();

  for (const row of worksheet.getRows(2, worksheet.rowCount - 1) || []) {
    ecosystem.add(getCellValue(row.getCell(1)) as string);
  }

  const ecosystems = await prisma.ecosystem.findMany({
    where: { type: { in: Array.from(ecosystem) } },
    select: { id: true },
  });

  const ecosystemMap = new Map(ecosystems.map((e) => [e.id, e.id]));

  // ✅ Extract Coverage data
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row

    const ecosystem = getCellValue(row.getCell(1)) as string | null; // Column A
    const description = getCellValue(row.getCell(2)) as string | null; // Column B
    const type = getCellValue(row.getCell(3)) as string | null; // Column C
    const index = getCellValue(row.getCell(4)) as Index | undefined; // Column D

    const ecosystemId = ecosystem ? ecosystemMap.get(ecosystem) : undefined;

    const values = {
      range: getCellValue(row.getCell(5)) as string | null, // Column E
      biomass_type: getCellValue(row.getCell(6)) as number | null, // Column F
      agb_equation: getCellValue(row.getCell(7)) as string | null, // Column G
    }


    const jsonValues: Prisma.InputJsonValue = formatValuesCoverage(values);

    coverage.push({
      ecosystemId,
      description: description ?? null,
      type,
      index,
      values: jsonValues,
    });
  });

  return coverage;
}

// ✅ Helper function to structure values with units for Ecosystem
export function formatValuesSpecies(values: SpeciesValues): Prisma.InputJsonValue {
  //TODO: make of this a more generic function
  return {
    max_height: values.max_height !== null ? {value: values.max_height, unit: SpeciesUnitsMapping.max_height} : null,
    wood_density: values.wood_density !== null ? {value: values.wood_density, unit: SpeciesUnitsMapping.wood_density} : null,
    growth_rate: values.growth_rate !== null ? {value: values.growth_rate, unit: SpeciesUnitsMapping.growth_rate} : null,
    avg_dbh: values.avg_dbh !== null ? {value: values.avg_dbh, unit: SpeciesUnitsMapping.avg_dbh} : null,
    allometric_coeff_a: values.allometric_coeff_a !== null ? {value: values.allometric_coeff_a, unit: SpeciesUnitsMapping.allometric_coeff_a} : null,
    allometric_coeff_b: values.allometric_coeff_b !== null ? {value: values.allometric_coeff_b, unit: SpeciesUnitsMapping.allometric_coeff_b} : null,
    r_coeff: values.r_coeff !== null ? {value: values.r_coeff, unit: SpeciesUnitsMapping.r_coeff} : null,
    g_b: values.g_b !== null ? {value: values.g_b, unit: SpeciesUnitsMapping.g_b} : null,
    g_c: values.g_c !== null ? {value: values.g_c, unit: SpeciesUnitsMapping.g_c} : null,
    g_b_dbh: values.g_b_dbh !== null ? {value: values.g_b_dbh, unit: SpeciesUnitsMapping.g_b_dbh} : null,
    g_c_dbh: values.g_c_dbh !== null ? {value: values.g_c_dbh, unit: SpeciesUnitsMapping.g_c_dbh} : null,
    k: values.k !== null ? {value: values.k, unit: SpeciesUnitsMapping.k} : null,
    inflexion: values.inflexion !== null ? {value: values.inflexion, unit: SpeciesUnitsMapping.inflexion} : null,
    k2: values.k2 !== null ? {value: values.k2, unit: SpeciesUnitsMapping.k2} : null,
    t_inflexion: values.t_inflexion !== null ? {value: values.t_inflexion, unit: SpeciesUnitsMapping.t_inflexion} : null,
  }
  }

  // ✅ Helper function to structure values with units for Ecosystem
  export function formatValuesEcosystem(values: EcosystemValues): Prisma.InputJsonValue {
    return {
      BD: values.BD !== null ? { value: values.BD, unit: EcosystemUnitsMapping.BD } : null,
      C: values.C !== null ? { value: values.C, unit: EcosystemUnitsMapping.C } : null,
      Profundidad: values.Profundidad !== null ? { value: values.Profundidad, unit: EcosystemUnitsMapping.Profundidad } : null,
      SOC: values.SOC !== null ? { value: values.SOC, unit: EcosystemUnitsMapping.SOC } : null,
    }
    }

// ✅ Helper function to structure values with units for Coverage
export function formatValuesCoverage(values: CoverageValues): Prisma.InputJsonValue {
  return {
    range: values.range !== null ? { value: values.range, unit: CoverageUnitsMapping.range } : null,
    biomass_type: values.biomass_type !== null ? { value: values.biomass_type, unit: CoverageUnitsMapping.biomass_type } : null,
    agb_equation: values.agb_equation !== null ? { value: values.agb_equation, unit: CoverageUnitsMapping.agb_equation } : null,
  }
  }


export function formatValuesProject(values: ProjectValues): Prisma.InputJsonValue {
  const geolocation = values.geolocation_point ? values.geolocation_point.split(",").map((k) => k.trim()) : []
  const formattedGeolocation =
    geolocation.length === 2
      ? { lat: parseFloat(geolocation[0]), lng: parseFloat(geolocation[1]) }
      : null;
    return {
        impact: values.impact !== null ? { value: values.impact, unit: ProjectUnitsMapping.impact } : null,
        total_investment: values.total_investment !== null ? { value: values.total_investment, unit: ProjectUnitsMapping.total_investment } : null,
        bankable_investment: values.bankable_investment !== null ? { value: values.bankable_investment, unit: ProjectUnitsMapping.bankable_investment } : null,
        income: values.income !== null ? { value: values.income, unit: ProjectUnitsMapping.income } : null,
        areaC1: values.areaC1 !== null ? { value: values.areaC1, unit: ProjectUnitsMapping.areaC1 } : null,
        areaC2: values.areaC2 !== null ? { value: values.areaC2, unit: ProjectUnitsMapping.areaC2 } : null,
        income_other: values.income_other !== null ? { value: values.income_other, unit: ProjectUnitsMapping.income_other } : null,
        term: values.term !== null ? { value: values.term, unit: ProjectUnitsMapping.term } : null,
        lands: values.lands !== null ? { value: values.lands, unit: ProjectUnitsMapping.lands } : null,
        abstract: values.abstract !== null ? { value: values.abstract } : null,
        investment_teaser: values.investment_teaser !== null ? { value: values.investment_teaser } : null,
        geolocation_point: formattedGeolocation,
        polygone: values.polygone !== null ? { value: values.polygone } : null,
        tree_quantity: values.tree_quantity !== null ? { value: values.tree_quantity, unit: ProjectUnitsMapping.tree_quantity } : null,
        token_granularity: values.token_granularity !== null ? { value: values.token_granularity, unit: ProjectUnitsMapping.token_granularity } : null,
    };
  }

  // ✅ Helper function to parse mathmodels (comma-separated)
export function mathModelsParser(worksheet: ExcelJS.Worksheet): Prisma.MathModelsCreateManyInput[] {
  const mathModels: Prisma.MathModelsCreateManyInput[] = [];
  
  // ✅ Extract mathModels from Column A
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row
    const mathmodels = getCellValue(row.getCell(1)) as string; // Column A

    mathModels.push({ name: mathmodels });
  });

  // ✅ Validate and insert mathModels
  return mathModels
  }

// ✅ Helper function to parse Species data
export function speciesParser(worksheet: ExcelJS.Worksheet): Prisma.SpeciesCreateManyInput[] {
  const species: Prisma.SpeciesCreateManyInput[] = [];

  // ✅ Extract Species data
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row

    const common_name = getCellValue(row.getCell(1)) as string; // Column A
    const scientific_name = getCellValue(row.getCell(2)) as string; // Column B
    const family = getCellValue(row.getCell(3)) as string | null; // Column C
    const functional_type = getCellValue(row.getCell(4)) as string | null; // Column D
    
    
    const values = {
      max_height: getCellValue(row.getCell(5)) as number | null, // Column E
      wood_density: getCellValue(row.getCell(6)) as number | null, // Column F
      growth_rate: getCellValue(row.getCell(7)) as string | null, // Column G
      avg_dbh: getCellValue(row.getCell(8)) as number | null, // Column H
      allometric_coeff_a: getCellValue(row.getCell(9)) as number | null, // Column I
      allometric_coeff_b: getCellValue(row.getCell(10)) as number | null, // Column J
      r_coeff: getCellValue(row.getCell(11)) as number | null, // Column K
      g_b: getCellValue(row.getCell(12)) as number | null, // Column L
      g_c: getCellValue(row.getCell(13)) as number | null, // Column M
      g_b_dbh: getCellValue(row.getCell(14)) as number | null, // Column N
      g_c_dbh: getCellValue(row.getCell(15)) as number | null, // Column O
      k: getCellValue(row.getCell(16)) as number | null, // Column P
      inflexion: getCellValue(row.getCell(17)) as number | null, // Column Q
      k2: getCellValue(row.getCell(18)) as string | null, // Column R
      t_inflexion: getCellValue(row.getCell(19)) as string | null, // Column S
    }
    const comments = getCellValue(row.getCell(20)) as string || null; // Column T
    

    const jsonValues: Prisma.InputJsonValue = formatValuesSpecies(values);

    species.push({
      common_name,
      scientific_name,
      family: family ?? null,
      functional_type: functional_type ?? null,
      values: jsonValues,
      comments: comments ?? null,
    });
  });

  return species;
}

  // ✅ Helper function to parse keywords (comma-separated)
export function keywordsParser(worksheet: ExcelJS.Worksheet): Prisma.KeywordCreateManyInput[] {
  const keywords: Prisma.KeywordCreateManyInput[] = [];
  
  // ✅ Extract keywords from Column A
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row
    const keyword = getCellValue(row.getCell(1)); // Column A

    if (keyword && typeof keyword === "string") {
      keywords.push({ name: keyword });
    }
  });

  // ✅ Validate and insert keywords
  return keywords.map((row) => keywordSchema.parse(row));
  }

// ✅ Helper function to parse Ecosystem data
export function ecosystemsParser(worksheet: ExcelJS.Worksheet): Prisma.EcosystemCreateManyInput[] {
    const ecosystems: Prisma.EcosystemCreateManyInput[] = [];
  
    // ✅ Extract Ecosystem data
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
  
      const type = getCellValue(row.getCell(1)) as string; // Column A
      const description = getCellValue(row.getCell(2)) as string | null; // Column B

      const values = {
        BD: getCellValue(row.getCell(3)) as number | null, // Column C
        C: getCellValue(row.getCell(4)) as number | null, // Column D
        Profundidad: getCellValue(row.getCell(5)) as number | null, // Column E
        SOC: getCellValue(row.getCell(6)) as number | null, // Column F
      }


      const jsonValues: Prisma.InputJsonValue = formatValuesEcosystem(values);
  
      ecosystems.push({
        type,
        description: description ?? null,
        values: jsonValues,
      });
    });
  
    return ecosystems;
  }