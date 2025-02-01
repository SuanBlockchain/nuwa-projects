
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

