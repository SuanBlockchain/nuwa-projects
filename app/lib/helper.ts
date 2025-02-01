
import { EcosystemUnitsMapping } from "./definitions";

// ✅ Helper function to structure values with units for Ecosystem
export function formatValuesEcosystem(BD: number | null, C: number | null, Profundidad: number | null, SOC: number | null) {
    return {
        BD: BD !== null ? { value: BD, unit: EcosystemUnitsMapping.BD } : null,
        C: C !== null ? { value: C, unit: EcosystemUnitsMapping.C } : null,
        Profundidad: Profundidad !== null ? { value: Profundidad, unit: EcosystemUnitsMapping.Profundidad } : null,
        SOC: SOC !== null ? { value: SOC, unit: EcosystemUnitsMapping.SOC } : null,
    };
  }