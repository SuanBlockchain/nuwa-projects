import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";
import fs from "fs";
import { ecosystemsParser, keywordsParser, mathModelsParser, projectsParser, saveFile, speciesParser, parcelsParser } from "@/app/lib/seed/helper";

export const config = {
  api: { bodyParser: false },
};

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

function handleError(error: unknown): NextResponse {
  console.error("❌ Error processing:", error);
  const message = error instanceof Error ? error.message : "Unknown error";
  return NextResponse.json({ message }, { status: 400 });
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

      try {
        if (sheetName === "MathModels") {
          const validatedMathModels = mathModelsParser(worksheet);

          await prisma.mathModels.createMany({
            data: validatedMathModels,
            skipDuplicates: true,
          });

          console.log("✅ MathModels inserted successfully:", validatedMathModels);
        } else if (sheetName === "Species") {
          const validatedSpecies = speciesParser(worksheet);

          await prisma.species.createMany({
            data: validatedSpecies,
            skipDuplicates: true,
          });

          console.log("✅ Species inserted successfully:", validatedSpecies);
        } else if (sheetName === "Keywords") {
          const validatedKeywords = keywordsParser(worksheet);

          await prisma.keyword.createMany({
            data: validatedKeywords,
            skipDuplicates: true,
          });

          console.log("✅ Keywords inserted successfully:", validatedKeywords);
        } else if (sheetName === "Ecosystem") {
          const ecosystems = ecosystemsParser(worksheet);

          // ✅ Insert ecosystems into Prisma
          await prisma.ecosystem.createMany({
            data: ecosystems,
            skipDuplicates: true,
          });

          console.log("✅ Ecosystems inserted successfully:", ecosystems);
        } else if (sheetName === "Project") {
          const projects = await projectsParser(worksheet);

          await Promise.all(
            projects.map(async (project) => {
              // ✅ Upsert project into Prisma
              await prisma.project.upsert({
                where: { name: project.name }, // Assuming id is unique
                update: {}, // No update if it exists
                create: project,
              });
            })
          );

          console.log("✅ Projects inserted successfully:", projects);
        } else if (sheetName === "Parcels") {
          const parcels = await parcelsParser(worksheet);
              // ✅ Insert parcel into Prisma
              await prisma.parcels.createMany({
                data: parcels,
                skipDuplicates: false,
              });

          console.log("✅ Parcels inserted successfully:", parcels);
        }
      } catch (error) {
        return handleError(error);
      }
    }

    // ✅ Delete file after processing
    await fs.promises.unlink(filePath);
    console.log(`Deleted file: ${filePath}`);

    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error) {
    return handleError(error);
  }
}
