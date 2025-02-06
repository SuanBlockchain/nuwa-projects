import path from "path";
import fs from "fs";
import { CellValue, EcosystemUnitsMapping, EcosystemValues, ProjectUnitsMapping, ProjectValues, SpeciesUnitsMapping, SpeciesValues } from "../definitions";
import ExcelJS from "exceljs";
import { PrismaClient, Prisma, Status } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

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

// ✅ Helper function to parse keywords (comma-separated)
export async function getKeywordIds(keywordString: string): Promise<(string | null)[]> {
    const keywordsArray = keywordString.split(",").map((k) => k.trim());
  
    // Ensure keywords exist in the database
    const keywordRecords = await Promise.all(
      keywordsArray.map(async (keyword) => {
        const existingKeyword = await prisma.keyword.findUnique({
          where: { name: keyword },
        });
  
        return existingKeyword ? existingKeyword.id : null;
      })
    );
  
    return keywordRecords;
  }

export async function projectsParser(worksheet: ExcelJS.Worksheet): Promise<Prisma.ProjectCreateManyInput[]> {
  // Get the current user, for the time being is always the same
  const user = await prisma.user.findUnique({
    where: { email: "user@nuwa.com" },
  });

  const projects: Prisma.ProjectCreateManyInput[] = [];

  // ✅ Extract Project data
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row

    const projectData = {
      
      title: getCellValue(row.getCell(1)) as string, // Column A
      description: getCellValue(row.getCell(2)) as string | null, // Column B
      country: getCellValue(row.getCell(3)) as string | null, // Column C
      status: getCellValue(row.getCell(4)) as Status | undefined, // Column D
      department: getCellValue(row.getCell(5)) as string | null, // Column E
    };
    
    const values = {
      impact: getCellValue(row.getCell(7)) as number | null, // Column G
      total_investment: getCellValue(row.getCell(8)) as number | null, // Column H
      bankable_investment: getCellValue(row.getCell(9)) as number | null, // Column I
      income: getCellValue(row.getCell(10)) as number | null, // Column J
      areaC1: getCellValue(row.getCell(11)) as number | null, // Column K
      areaC2: getCellValue(row.getCell(12)) as number | null, // Column L
      income_other: getCellValue(row.getCell(13)) as number | null, // Column M
      term: getCellValue(row.getCell(14)) as number | null, // Column N
      lands: getCellValue(row.getCell(15)) as number | null, // Column O
      abstract: getCellValue(row.getCell(16)) as string | null, // Column P
      investment_teaser: getCellValue(row.getCell(17)) as string | null, // Column Q
      geolocation_point: getCellValue(row.getCell(18)) as string | null, // Column R
      polygone: getCellValue(row.getCell(19)) as string | null, // Column S
      tree_quantity: getCellValue(row.getCell(20)) as number | null, // Column T
      token_granularity: getCellValue(row.getCell(21)) as number | null // Column U
    }
    const jsonValues: Prisma.InputJsonValue = formatValuesProject(values);
    // const keywords = getCellValue(row.getCell(6)) as string | null, // Column F
    // const keywordIds = keywords ? await getKeywordIds(keywords) : [];


    projects.push({
      ...projectData,
      values: jsonValues,
      creatorId: user?.id ?? "",
    });
  });

  return projects;
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

  // ✅ Helper function to parse keywords (comma-separated)
export function constantsParser(worksheet: ExcelJS.Worksheet): Prisma.ConstantsCreateManyInput[] {
  const constants: Prisma.ConstantsCreateManyInput[] = [];
  
  // ✅ Extract constants from Column A
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row
    const name = getCellValue(row.getCell(1)) as string; // Column A
    const description = getCellValue(row.getCell(2)) as string | null; // Column B
    const value = getCellValue(row.getCell(3)) as number; // Column C

    const unit = getCellValue(row.getCell(4)) as string; // Column D

    constants.push({ name, description: description ?? null, value, unit });

  });

  // ✅ Validate and insert constants
  return constants;
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
    }
    const comments = getCellValue(row.getCell(12)) as string || null; // Column L
    

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