import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { formatValuesEcosystem } from "@/app/lib/helper";

export const config = {
  api: { bodyParser: false },
};

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// ✅ Define validation schema for keywords
const keywordSchema = z.object({
  name: z.string(),
});

// ✅ Define validation schema for ecosystems
const ecosystemSchema = z.object({
  type: z.string(),
  description: z.string().optional(),
  values: z.record(z.any()), // Ensures JSON storage in Prisma
});

// Helper function to save the file
async function saveFile(file: File) {
  const data = Buffer.from(await file.arrayBuffer());
  const filePath = path.join("/tmp", file.name);
  await fs.promises.writeFile(filePath, data);
  return filePath;
}

// ✅ Named export for POST method (Next.js App Router)
export async function POST(req: Request) {
  try {
    // Extract file from formData
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    // Save the file to /tmp
    const filePath = await saveFile(file);

    // Read the Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    for (const worksheet of workbook.worksheets) {
      const sheetName = worksheet.name;

      if (sheetName === "Keywords") {
        const keywords: { name: string }[] = [];

        // ✅ Extract keywords from Column A
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return; // Skip header row
          const keyword = row.getCell(1).value; // Column A

          if (keyword && typeof keyword === "string") {
            keywords.push({ name: keyword });
          }
        });

        // ✅ Validate and insert keywords
        const validatedKeywords = keywords.map((row) => keywordSchema.parse(row));

        await prisma.keyword.createMany({
          data: validatedKeywords,
          skipDuplicates: true,
        });

        console.log("✅ Keywords inserted successfully:", validatedKeywords);
      }

      if (sheetName === "Ecosystem") {
        const ecosystems: any[] = [];

        // ✅ Extract Ecosystem data
        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return; // Skip header row

          const type = row.getCell(1).value as string; // Column A
          const description = row.getCell(2).value as string; // Column B
          const BD = row.getCell(3).value; // Column C
          const C = row.getCell(4).value; // Column D
          const Profundidad = row.getCell(5).value; // Column E
          const SOC = row.getCell(6).value; // Column F

          const values = formatValuesEcosystem(BD, C, Profundidad, SOC);

          ecosystems.push(
            ecosystemSchema.parse({
              type,
              description,
              values,
            })
          );
        });

        // ✅ Insert ecosystems into Prisma
        await prisma.ecosystem.createMany({
          data: ecosystems,
          skipDuplicates: true,
        });

        console.log("✅ Ecosystems inserted successfully:", ecosystems);
      }
    }

    // ✅ Delete file after processing
    await fs.promises.unlink(filePath);
    console.log(`Deleted file: ${filePath}`);

    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error) {
    console.error("❌ Error processing file:", error);
    return NextResponse.json({ message: "Error processing file" }, { status: 500 });
  }
}
