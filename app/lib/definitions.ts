
export interface SpeciesValues {
  max_height: number | null; 
  wood_density: number | null; 
  growth_rate: string | null; 
  avg_dbh: number | null; 
  allometric_coeff_a: number | null; 
  allometric_coeff_b: number | null; 
  r_coeff: number | null; 
  g_b: number | null; 
  g_c: number | null; 
  g_b_dbh: number | null; 
  g_c_dbh: number | null; 
  k: number | null; 
  inflexion: number | null; 
  k2: string | null; 
  t_inflexion: string | null; 
  }

export interface EcosystemValues {
  BD: number | null;
  C: number | null;
  Profundidad: number | null;
  SOC: number | null;
  }

// ✅ Helper function to structure values with units for Projects
export interface ProjectValues {
  impact: number | null;
  total_investment: number | null;
  bankable_investment: number | null;
  income: number | null;
  areaC1: number | null;
  areaC2: number | null;
  income_other: number | null;
  term: number | null;
  lands: number | null;
  abstract: string | null;
  investment_teaser: string | null;
  geolocation_point: string | null;
  polygone: string | null;
  tree_quantity: number | null;
  token_granularity: number | null;
  }

export const SpeciesUnitsMapping = {
  max_height: "m",
  wood_density: "g/cm³",
  growth_rate: "-",
  avg_dbh: "cm",
  allometric_coeff_a: "-",
  allometric_coeff_b: "-",
  r_coeff: "-",
  g_b: "m",
  g_c: "m",
  g_b_dbh: "kg?",
  g_c_dbh: "kg?",
  k: "years⁻¹",
  inflexion: "?",
  k2: "years⁻¹-range",
  t_inflexion: "year-range",
};

// ✅ Helper function to structure values with units for Ecosystems
// Ecosystem units mapping
export const EcosystemUnitsMapping = {
  BD: "g/cm³",
  C: "%",
  Profundidad: "m",
  SOC: "tC/ha",
};

// Projects units mapping
export const ProjectUnitsMapping = {
  impact: "tCO2e",
  total_investment: "USD",
  bankable_investment: "USD",
  income: "USD",
  areaC1: "Ha",
  areaC2: "Ha",
  income_other: "USD",
  term: "years",
  lands: "-", // No unit
  tree_quantity: "-",
  token_granularity: "-",
};

export type TotalImpactResult = { total_impact: bigint };
export type TotalInvestmentResult = { total_investment: bigint };
export type TotalBankableInvestmentResult = { total_bankable_investment: bigint };
export type TotalIncomeResult = { total_income: bigint };
export type CellValue = string | number | boolean | Date | null;

