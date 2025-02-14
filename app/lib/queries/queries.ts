import { PrismaClient } from '@prisma/client';

import { TotalImpactResult, TotalInvestmentResult, TotalBankableInvestmentResult, TotalIncomeResult } from '../definitions';

const prisma = new PrismaClient();

export async function fetchCardData() {

    try {

      const totalInvestmentPromise = prisma.$queryRaw<TotalInvestmentResult[]>`
      SELECT * FROM total_investment;
      `;
      const TotalImpactPromise = prisma.$queryRaw<TotalImpactResult[]>`
        SELECT * FROM total_impact;
      `;
      const totalBankableInvestmentPromise = prisma.$queryRaw<TotalBankableInvestmentResult[]>`
        SELECT * FROM total_bankable_investment;
      `;
      const totalIncomePromise = prisma.$queryRaw<TotalIncomeResult[]>`
        SELECT * FROM total_income;
      `;

      const data = await Promise.all([
        TotalImpactPromise,
        totalInvestmentPromise,
        totalBankableInvestmentPromise,
        totalIncomePromise,
      ]);

      const totalImpact = Number((data[0] as TotalImpactResult[])[0]?.total_impact);
      const totalInvestment = Number((data[1] as TotalInvestmentResult[])[0]?.total_investment);
      const totalBankableInvestment = Number((data[2] as TotalBankableInvestmentResult[])[0]?.total_bankable_investment);
      const totalIncome = Number((data[3] as TotalIncomeResult[])[0]?.total_income);

    return { totalImpact, totalInvestment, totalBankableInvestment, totalIncome, projectName: 'ALL PROJECTS' };

    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch card data.');
    }
  }

  export async function fetchProjectData() {
    try {
      const projectsData = await prisma.project.findMany();

      return projectsData;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch growth data.');
    }
  }

  export async function fetchProjectById(id: string) {
    try {
      const projectData = await prisma.project.findUnique({
        where: { id },
        select: {
          name: true,
          values: true,
        },
      }) as { name: string, values: { impact?: { value: number }, total_investment?: { value: number }, bankable_investment?: { value: number }, income?: { value: number } } };

      if (!projectData || !projectData.values) {
        throw new Error('Project data not found or values field is empty.');
      }

      const totalImpact = Number(projectData.values.impact?.value || 0);
      const totalInvestment = Number(projectData.values.total_investment?.value || 0);
      const totalBankableInvestment = Number(projectData.values.bankable_investment?.value || 0);
      const totalIncome = Number(projectData.values.income?.value || 0);
    
      return { totalImpact, totalInvestment, totalBankableInvestment, totalIncome, projectName: projectData.name };
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch project data.');
    }
  }