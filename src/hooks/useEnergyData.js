import { useEffect, useState } from 'react'
import { csvParse } from 'd3'
import { numericToAlpha3 } from '../data/isoNumericToAlpha3'
import { electrificationData } from '../data/electrification'
import {
  estimateSectors,
  combinedScore,
  estimateMachines,
  estimateEvStock,
  machineElectricShare,
} from '../data/energyModel'

// Our World in Data energy dataset (single CSV, all countries, all years).
// jsDelivr serves it gzipped + CDN-cached.
const OWID_URL = 'https://cdn.jsdelivr.net/gh/owid/energy-data@master/owid-energy-data.csv'

// OWID EV sales share (% of new cars sold that are electric) — full history.
const EV_URL = 'https://ourworldindata.org/grapher/electric-car-sales-share.csv?csvType=full&useColumnShortNames=true'

const COLS = [
  'electricity_share_energy',
  'low_carbon_share_elec',
  'renewables_share_elec',
  'fossil_share_elec',
  'nuclear_share_elec',
  'renewables_electricity',
  'per_capita_electricity',
]

const alpha3ToNumeric = Object.fromEntries(
  Object.entries(numericToAlpha3).map(([num, a3]) => [a3, +num])
)

function num(v) {
  if (v == null || v === '') return null
  const n = +v
  return Number.isFinite(n) ? n : null
}

// Attach machine roster + electric-machine index to a record, given optional
// real EV data { salesShare, stockShare }.
function attachMachines(record, ev) {
  const evSales = ev ? ev.salesShare : null
  const evStock = ev ? ev.stockShare : null
  const machines = estimateMachines(record.electrification, evSales, evStock)
  const idx = machineElectricShare(machines)
  return {
    ...record,
    evSalesShare: evSales,
    evStockShare: evStock,
    machines,
    machineElectricShare: idx,
    machinesToReplace: idx == null ? null : Math.max(100 - idx, 0),
  }
}

function buildRecord(numericId, name, fields) {
  const electrification = num(fields.electricity_share_energy)
  const lowCarbonShareElec = num(fields.low_carbon_share_elec)
  const renewablesShareElec = num(fields.renewables_share_elec)
  const fossilShareElec = num(fields.fossil_share_elec)
  const nuclearShareElec = num(fields.nuclear_share_elec)
  const renewablesTwh = num(fields.renewables_electricity)
  const perCapitaKwh = num(fields.per_capita_electricity)
  return {
    id: numericId,
    name,
    electrification,
    lowCarbonShareElec,
    renewablesShareElec,
    fossilShareElec,
    nuclearShareElec,
    renewablesTwh,
    perCapitaKwh,
    sectors: estimateSectors(electrification, perCapitaKwh),
    combined: combinedScore(electrification, lowCarbonShareElec),
    estimated: false,
  }
}

// Parse the EV sales-share CSV into { numericId: { salesShare, stockShare } }.
function parseEvData(text) {
  const rows = csvParse(text)
  const byCode = {} // alpha3 -> [{year, val}]
  for (const row of rows) {
    const a3 = row.code
    if (!a3 || !(a3 in alpha3ToNumeric)) continue
    const val = num(row.ev_sales_share)
    if (val == null) continue
    ;(byCode[a3] ||= []).push({ year: +row.year, val })
  }
  const out = {}
  for (const [a3, series] of Object.entries(byCode)) {
    series.sort((a, b) => a.year - b.year)
    const salesShare = series[series.length - 1].val
    const stockShare = estimateEvStock(series.map((s) => s.val), salesShare)
    out[alpha3ToNumeric[a3]] = { salesShare, stockShare }
  }
  return out
}

// Fallback record from the bundled approximate dataset (used if fetch fails).
function fallbackRecord(numericId) {
  const base = electrificationData[numericId]
  if (!base) return null
  return {
    id: numericId,
    name: base.name,
    electrification: base.value,
    lowCarbonShareElec: null,
    renewablesShareElec: null,
    fossilShareElec: null,
    nuclearShareElec: null,
    renewablesTwh: null,
    perCapitaKwh: null,
    sectors: estimateSectors(base.value, null),
    combined: combinedScore(base.value, 0),
    estimated: true,
  }
}

function buildFallback(evData) {
  const out = {}
  for (const id of Object.keys(electrificationData)) {
    const rec = fallbackRecord(+id)
    if (rec) out[+id] = attachMachines(rec, evData && evData[+id])
  }
  return out
}

export function useEnergyData() {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading') // loading | live | fallback

  useEffect(() => {
    let cancelled = false

    const fetchText = (url) =>
      fetch(url).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })

    // EV data is a bonus layer — if it fails, we still build with modelled vehicles.
    Promise.all([
      fetchText(OWID_URL),
      fetchText(EV_URL).catch(() => null),
    ])
      .then(([energyText, evText]) => {
        if (cancelled) return
        const evData = evText ? parseEvData(evText) : {}
        const rows = csvParse(energyText)
        // Keep the latest year that has an electrification value, per alpha-3.
        const latest = {} // alpha3 -> row
        for (const row of rows) {
          const a3 = row.iso_code
          if (!a3 || !(a3 in alpha3ToNumeric)) continue
          if (row.electricity_share_energy === '' || row.electricity_share_energy == null) continue
          const year = +row.year
          if (!latest[a3] || year > latest[a3].__year) {
            const picked = { __year: year }
            for (const c of COLS) picked[c] = row[c]
            picked.country = row.country
            latest[a3] = picked
          }
        }
        const out = {}
        for (const [a3, fields] of Object.entries(latest)) {
          const numericId = alpha3ToNumeric[a3]
          out[numericId] = attachMachines(buildRecord(numericId, fields.country, fields), evData[numericId])
        }
        // Fill any countries missing from OWID with fallback estimates.
        for (const id of Object.keys(electrificationData)) {
          if (!out[+id]) {
            const fb = fallbackRecord(+id)
            if (fb) out[+id] = attachMachines(fb, evData[+id])
          }
        }
        setData(out)
        setStatus('live')
      })
      .catch(() => {
        if (cancelled) return
        setData(buildFallback())
        setStatus('fallback')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { data, status }
}
