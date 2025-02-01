import path from "path";
import fs from "fs";
import { EcosystemUnitsMapping, EcosystemValues, ProjectUnitsMapping, ProjectValues } from "./definitions";
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
      
      title: row.getCell(1).value as string, // Column A
      description: row.getCell(2).value as string | null, // Column B
      country: row.getCell(3).value as string | null, // Column C
      status: row.getCell(4).value as Status | undefined, // Column D
      department: row.getCell(5).value as string | null, // Column E
    };
    
    const values = {
      impact: row.getCell(7).value as number | null, // Column G
      total_investment: row.getCell(8).value as number | null, // Column H
      bankable_investment: row.getCell(9).value as number | null, // Column I
      income: row.getCell(10).value as number | null, // Column J
      areaC1: row.getCell(11).value as number | null, // Column K
      areaC2: row.getCell(12).value as number | null, // Column L
      income_other: row.getCell(13).value as number | null, // Column M
      term: row.getCell(14).value as number | null, // Column N
      lands: row.getCell(15).value as number | null, // Column O
      abstract: row.getCell(16).value as string | null, // Column P
      investment_teaser: row.getCell(17).value as string | null, // Column Q
      geolocation_point: row.getCell(18).value as string | null, // Column R
      polygone: row.getCell(19).value as string | null, // Column S
      tree_quantity: row.getCell(20).value as number | null, // Column T
      token_granularity: row.getCell(21).value as number | null // Column U
    }
    const jsonValues: Prisma.InputJsonValue = formatValuesProject(values);
    // const keywords = row.getCell(6).value as string | null, // Column F
    // const keywordIds = keywords ? await getKeywordIds(keywords) : [];


    projects.push({
      ...projectData,
      values: jsonValues,
      creatorId: user?.id ?? "",
    });
  });

  return projects;
}

// ✅ Helper function to save the file
export async function saveFile(file: File) {
    const data = Buffer.from(await file.arrayBuffer());
    const filePath = path.join("/tmp", file.name);
    await fs.promises.writeFile(filePath, data);
    return filePath;
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
export function keywordsParser(worksheet: ExcelJS.Worksheet): Prisma.KeywordCreateManyInput[] {
  const keywords: Prisma.KeywordCreateManyInput[] = [];
  
  // ✅ Extract keywords from Column A
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row
    const keyword = row.getCell(1).value; // Column A

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
  
      const type = row.getCell(1).value as string; // Column A
      const description = row.getCell(2).value as string | null; // Column B

      const values = {
        BD: row.getCell(3).value as number | null, // Column C
        C: row.getCell(4).value as number | null, // Column D
        Profundidad: row.getCell(5).value as number | null, // Column E
        SOC: row.getCell(6).value as number | null, // Column F
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