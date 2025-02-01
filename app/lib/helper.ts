
import { EcosystemUnitsMapping } from "./definitions";

// ✅ Helper function to structure values with units for Ecosystem
export function formatValuesEcosystem(BD: any, C: any, Profundidad: any, SOC: any) {
    return {
      BD: { value: BD, unit: EcosystemUnitsMapping.BD },
      C: { value: C, unit: EcosystemUnitsMapping.C },
      Profundidad: { value: Profundidad, unit: EcosystemUnitsMapping.Profundidad },
      SOC: { value: SOC, unit: EcosystemUnitsMapping.SOC },
    };
  }