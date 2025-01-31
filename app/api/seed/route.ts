import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { z } from "zod";

export const config = {
  api: { bodyParser: false },
};

// const prisma = new PrismaClient(
//   {log: ['query', 'info', 'warn', 'error'],}
// );

// ✅ Ensure Prisma is initialized properly
const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ✅ Define validation schema for keywords
const keywordSchema = z.object({
  name: z.string(),
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
      const rows: { name: string }[] = [];

      // ✅ Extract only the first column values
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
        const keyword = row.getCell(1).value; // Get only first column (A)

        if (keyword && typeof keyword === "string") {
          rows.push({ name: keyword });
        }
      });

      // ✅ Seed Keywords (Fix applied here)
      if (sheetName === "Keywords") {
        const validatedKeywords = rows.map((row) => keywordSchema.parse(row));
        console.log(validatedKeywords);

        await prisma.keyword.createMany({
          data: validatedKeywords,
          skipDuplicates: true,
        });

        console.log("✅ Keywords inserted successfully:", validatedKeywords);
      }
    }

    // ✅ Delete file after processing
    await fs.promises.unlink(filePath);
    console.log(`Deleted file: ${filePath}`);

    return NextResponse.json({ message: "Database seeded successfully!" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error processing file" }, { status: 500 });
  }
}
