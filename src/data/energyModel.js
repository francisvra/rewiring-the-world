// Energy model: combined score, sector electrification estimates, and map layer config.
//
// Supply-side figures (electrification %, electricity mix, renewables) are REAL,
// from Our World in Data. Sector-level electrification is ESTIMATED — no free
// per-country source exists — using the overall electrification rate, the global
// sector mix, and per-capita electricity as a development proxy. Clearly labelled.

export const TARGET_35x35 = 35;

// Global sector electrification baselines (IEA, approximate) — share of each
// sector's final energy that is electric today, and each sector's weight in
// total final energy.
const SECTOR_BASE = {
  buildings: { electric: 33, weight: 0.30, label: "Buildings" },
  industry: { electric: 28, weight: 0.30, label: "Industry" },
  transport: { electric: 3.5, weight: 0.30, label: "Transport" },
};

// Estimate per-sector electrification for a country from its overall rate.
// We scale each sector's global baseline by how the country's overall
// electrification compares to the ~22% global average, while keeping the
// characteristic ordering (buildings > industry >> transport).
export function estimateSectors(overall, perCapitaKwh) {
  if (overall == null) return null;
  const ratio = overall / 22; // 22% ≈ global average electrification
  // richer grids (high per-capita) push transport a bit higher (more EVs)
  const evBoost = perCapitaKwh ? Math.min(perCapitaKwh / 8000, 1.5) : 1;
  return {
    buildings: {
      ...SECTOR_BASE.buildings,
      value: clamp(SECTOR_BASE.buildings.electric * ratio, 0, 95),
    },
    industry: {
      ...SECTOR_BASE.industry,
      value: clamp(SECTOR_BASE.industry.electric * ratio, 0, 90),
    },
    transport: {
      ...SECTOR_BASE.transport,
      value: clamp(SECTOR_BASE.transport.electric * ratio * evBoost, 0, 60),
    },
  };
}

// Combined "productive electrification" score:
// share of final energy that is BOTH electric AND low-carbon.
// e.g. 25% electric × 60% clean grid = 15% clean-electric.
export function combinedScore(electrification, lowCarbonShareElec) {
  if (electrification == null) return null;
  const clean = lowCarbonShareElec == null ? 0 : lowCarbonShareElec;
  return (electrification * clean) / 100;
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// Map layers — each defines how to derive the value coloured on the map.
export const LAYERS = {
  electrification: {
    key: "electrification",
    label: "Electrification",
    short: "Electric %",
    unit: "%",
    domain: 50,
    blurb: "Electricity as a share of final energy. UN 35×35 target: 35% by 2035.",
    get: (d) => d?.electrification,
  },
  transport: {
    key: "transport",
    label: "Transport",
    short: "Transport %",
    unit: "%",
    domain: 30,
    blurb: "Estimated share of transport energy that is electric — the biggest headroom.",
    get: (d) => d?.sectors?.transport?.value,
  },
  grid: {
    key: "grid",
    label: "Grid cleanliness",
    short: "Low-carbon %",
    unit: "%",
    domain: 100,
    blurb: "Low-carbon (renewables + nuclear) share of electricity generation.",
    get: (d) => d?.lowCarbonShareElec,
  },
  renewables: {
    key: "renewables",
    label: "Renewables",
    short: "Renewables %",
    unit: "%",
    domain: 100,
    blurb: "Share of electricity generated from renewables (solar, wind, hydro, etc.).",
    get: (d) => d?.renewablesShareElec,
  },
  combined: {
    key: "combined",
    label: "Combined",
    short: "Clean-electric %",
    unit: "%",
    domain: 50,
    blurb: "Productive electrification: share of final energy that is both electric AND low-carbon.",
    get: (d) => d?.combined,
  },
};

export const LAYER_ORDER = ["electrification", "combined", "transport", "grid", "renewables"];
