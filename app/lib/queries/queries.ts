import { PrismaClient } from '@prisma/client';

import { TotalImpactResult, TotalInvestmentResult, TotalBankableInvestmentResult, TotalIncomeResult } from '../definitions';

const prisma = new PrismaClient();

export async function fetchCardData() {

    // TODO: Add units of measure
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

    return { totalImpact, totalInvestment, totalBankableInvestment, totalIncome };

    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch card data.');
    }
  }

  // export async function fetchGrowthData(spece: string, horizon: number) {
  //   try {
  //     const growthData = await prisma.$queryRaw`
  //       SELECT * FROM growth_data;
  //     `;



  //     return growthData;
  //   } catch (error) {
  //     console.error('Database Error:', error);
  //     throw new Error('Failed to fetch growth data.');
  //   }
  // }