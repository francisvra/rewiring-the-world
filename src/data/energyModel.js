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

// ---- Machines to replace ------------------------------------------------
//
// The Rewiring thesis: the economy runs on a finite stock of machines, and
// progress = replacing each fossil machine with an electric one. We track two
// indicators per machine: SALES share (leading — % of new units that are
// electric) and STOCK share (lagging — % of installed units that are electric).
// The gap is momentum; the fossil stock is "machines to replace".
//
// Only passenger vehicles have real per-country data (OWID ev_sales_share).
// The rest are modelled from the country's overall electrification and labelled.

export const MACHINES = [
  { key: "vehicles", icon: "🚗", label: "Passenger vehicles", replaces: "petrol / diesel car", weight: 0.30, real: true, base: 4 },
  { key: "industry", icon: "🏭", label: "Industrial heat", replaces: "fossil process heat", weight: 0.30, real: false, base: 28 },
  { key: "heating", icon: "🔥", label: "Space heating", replaces: "gas furnace / boiler", weight: 0.22, real: false, base: 12 },
  { key: "water", icon: "🚿", label: "Water heating", replaces: "gas water heater", weight: 0.12, real: false, base: 22 },
  { key: "cooking", icon: "🍳", label: "Cooking", replaces: "gas stove", weight: 0.06, real: false, base: 30 },
];

// Model EV stock share from the full sales-share history: a trailing weighted
// mean of recent years, discounted for fleet turnover, never above latest sales.
// Early adopters (years of high sales) → high stock; recent spikers → big gap.
export function estimateEvStock(history, latestSales) {
  if (!history || history.length === 0) return null;
  const recent = history.slice(-8); // up to last 8 years
  let wsum = 0;
  let w = 0;
  recent.forEach((v, i) => {
    const weight = i + 1; // recent years weighted slightly more
    wsum += v * weight;
    w += weight;
  });
  const trailing = w ? wsum / w : 0;
  const stock = trailing * 0.7; // fleet-turnover discount
  return clamp(stock, 0, latestSales == null ? 100 : latestSales);
}

// New-sales share sits partway between current stock and full saturation —
// the replacement is underway, and the lead narrows as stock approaches 100%.
function salesAhead(stock) {
  return clamp(stock + (100 - stock) * 0.35, 0, 100);
}

// Per-machine sales + stock shares for a country.
export function estimateMachines(electrification, evSalesShare, evStockShare) {
  const ratio = electrification == null ? 1 : electrification / 22; // 22% ≈ global avg
  return MACHINES.map((m) => {
    if (m.real && evSalesShare != null) {
      return { ...m, salesShare: evSalesShare, stockShare: evStockShare, real: true };
    }
    if (m.real) {
      // No EV data for this country — model it like the others, mark estimated.
      const stock = clamp(m.base * ratio, 0, 90);
      return { ...m, salesShare: salesAhead(stock), stockShare: stock, real: false };
    }
    // modelled: scale the machine's global baseline by the country's electrification.
    // Sales run ahead of installed stock, but the lead narrows as stock approaches
    // saturation (you can't sell more than ~100% electric).
    const stock = clamp(m.base * ratio, 0, 90);
    return { ...m, salesShare: salesAhead(stock), stockShare: stock };
  });
}

// Weighted electric-machine index (stock-based) — the map value.
export function machineElectricShare(machines) {
  if (!machines) return null;
  let sum = 0;
  let w = 0;
  for (const m of machines) {
    if (m.stockShare == null) continue;
    sum += m.stockShare * m.weight;
    w += m.weight;
  }
  return w ? sum / w : null;
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
  machines: {
    key: "machines",
    label: "Electric machines",
    short: "Machine %",
    unit: "%",
    domain: 100,
    blurb: "Share of key machines (cars, heating, cooking, industry) that are electric — and how many remain to replace.",
    get: (d) => d?.machineElectricShare,
  },
};

export const LAYER_ORDER = ["electrification", "machines", "combined", "transport", "grid", "renewables"];
