import { NextResponse } from "next/server";
import {  PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";
import fs from "fs";
import { ecosystemsParser, keywordsParser, projectsParser, saveFile } from "@/app/lib/seed/helper";

export const config = {
  api: { bodyParser: false },
};

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

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
        const validatedKeywords = keywordsParser(worksheet);

        await prisma.keyword.createMany({
          data: validatedKeywords,
          skipDuplicates: true,
        });

        console.log("✅ Keywords inserted successfully:", validatedKeywords);
      }

      if (sheetName === "Ecosystem") {
        const ecosystems = ecosystemsParser(worksheet);

        // ✅ Insert ecosystems into Prisma
        await prisma.ecosystem.createMany({
          data: ecosystems,
          skipDuplicates: true,
        });

        console.log("✅ Ecosystems inserted successfully:", ecosystems);
      }

      if (sheetName === "Project") {
        const projects = await projectsParser(worksheet);

        // ✅ Insert projects into Prisma
        await prisma.project.createMany({
          data: projects,
          skipDuplicates: true,
        });

        console.log("✅ Projects inserted successfully:", projects);
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
