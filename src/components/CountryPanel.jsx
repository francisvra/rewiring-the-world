import { motion } from 'framer-motion'
import { rewiringOrgs, TARGET_35x35 } from '../data/electrification'

function StatBar({ label, value, domain, mode, estimated }) {
  if (value == null) return null
  const pct = Math.min((value / domain) * 100, 100)
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="opacity-70">{label}{estimated && ' *'}</span>
        <span className="font-semibold" style={{ color: 'var(--accent)' }}>
          {value.toFixed(1)}%
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: mode === 'circuit' ? '#1a3a1a' : '#e8e0d5' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: 'var(--accent)',
            boxShadow: mode === 'circuit' ? '0 0 6px var(--accent)' : undefined,
          }}
        />
      </div>
    </div>
  )
}

export default function CountryPanel({ record, mode, onClose }) {
  const org = rewiringOrgs[record.id]
  const electrification = record.electrification ?? 0
  const combined = record.combined ?? 0
  const clean = record.lowCarbonShareElec
  const headroom = Math.max(100 - combined, 0)

  const progress = Math.min((electrification / TARGET_35x35) * 100, 100)
  const isAboveTarget = electrification >= TARGET_35x35
  const gap = Math.max(TARGET_35x35 - electrification, 0).toFixed(1)

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 260 }}
      className="absolute top-0 right-0 h-full w-80 z-30 panel-scroll overflow-y-auto"
      style={{
        background: 'var(--panel-bg)',
        borderLeft: '1px solid var(--border)',
        boxShadow: mode === 'circuit'
          ? '-4px 0 20px rgba(200,117,51,0.2)'
          : '-4px 0 15px rgba(0,0,0,0.15)',
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 flex items-center justify-between px-5 py-4 z-10"
        style={{ background: 'var(--panel-bg)', borderBottom: '1px solid var(--border)' }}
      >
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
            {record.name}
          </h2>
          {mode === 'circuit' && <span className="text-xs opacity-50">[ISO:{record.id}]</span>}
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full text-lg opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          style={{ border: '1px solid var(--border)' }}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="px-5 py-4 space-y-5">

        {/* Org highlight */}
        {org && (
          <div
            className="rounded-lg p-4"
            style={{
              background: mode === 'circuit' ? 'rgba(200,117,51,0.15)' : 'rgba(193,127,42,0.12)',
              border: '1px solid var(--accent)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚡</span>
              <span className="font-bold" style={{ color: 'var(--accent)' }}>{org.name}</span>
            </div>
            <p className="text-sm opacity-70 mb-3">Rewiring organization active in {record.name}</p>
            <a
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ background: 'var(--accent)', color: mode === 'circuit' ? '#0d1f0d' : '#fff' }}
            >
              Visit {org.name} →
            </a>
          </div>
        )}

        {/* HEADLINE: combined productive-electrification score */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider opacity-60 mb-1">
            Productive Electrification
          </h3>
          <p className="text-xs opacity-50 mb-2">
            Share of final energy that is both electric <em>and</em> low-carbon
          </p>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold" style={{ color: 'var(--accent)' }}>
              {combined.toFixed(1)}
            </span>
            <span className="text-xl mb-2 opacity-70">%</span>
          </div>

          {/* Combined gauge: clean-electric vs headroom */}
          <div className="mt-3">
            <div
              className="h-5 rounded-full overflow-hidden flex"
              style={{ background: mode === 'circuit' ? '#1a3a1a' : '#e8e0d5' }}
            >
              <div
                className="h-full transition-all duration-700"
                style={{
                  width: `${Math.min(combined, 100)}%`,
                  background: mode === 'circuit' ? '#50c850' : '#8aba2e',
                  boxShadow: mode === 'circuit' ? '0 0 8px #50c850' : undefined,
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1 opacity-60">
              <span>⚡ Clean-electric {combined.toFixed(1)}%</span>
              <span>Headroom {headroom.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Demand side: electrification + 35x35 */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider opacity-60">
            Demand · Electrification
          </h3>
          <StatBar label="Electricity share of final energy" value={record.electrification} domain={50} mode={mode} />
          <div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: mode === 'circuit' ? '#1a3a1a' : '#e8e0d5' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progress}%`, background: isAboveTarget ? '#50c850' : 'var(--accent)' }}
                />
              </div>
              <span className="text-xs font-bold w-20 text-right" style={{ color: 'var(--accent)' }}>
                {progress.toFixed(0)}% to 35×35
              </span>
            </div>
            <p className="text-xs opacity-60 mt-1">
              {isAboveTarget
                ? `✅ Met the 35×35 target`
                : `📍 ${gap}% to go to the 35×35 target`}
            </p>
          </div>

          {/* Sector breakdown (estimated) */}
          {record.sectors && (
            <div className="space-y-2 pt-1">
              <StatBar label="Buildings" value={record.sectors.buildings.value} domain={100} mode={mode} estimated />
              <StatBar label="Industry" value={record.sectors.industry.value} domain={100} mode={mode} estimated />
              <StatBar label="Transport" value={record.sectors.transport.value} domain={100} mode={mode} estimated />
            </div>
          )}
        </div>

        {/* Supply side: grid */}
        {clean != null && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider opacity-60">
              Supply · Electricity grid
            </h3>
            <StatBar label="Low-carbon share" value={record.lowCarbonShareElec} domain={100} mode={mode} />
            <StatBar label="Renewables share" value={record.renewablesShareElec} domain={100} mode={mode} />
            {record.renewablesTwh != null && (
              <div className="flex justify-between text-sm pt-1">
                <span className="opacity-70">Renewables generation</span>
                <span className="font-semibold" style={{ color: 'var(--accent)' }}>
                  {record.renewablesTwh.toLocaleString(undefined, { maximumFractionDigits: 0 })} TWh
                </span>
              </div>
            )}
          </div>
        )}

        {/* CTA for non-org countries */}
        {!org && (
          <div className="rounded-lg p-4 text-center" style={{ border: '1px dashed var(--border)' }}>
            <p className="text-sm opacity-70 mb-3">No Rewiring organization yet in {record.name}</p>
            <button
              className="px-4 py-2 rounded text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity"
              style={{ background: 'var(--accent)', color: mode === 'circuit' ? '#0d1f0d' : '#fff' }}
              onClick={() => window.open(`mailto:hello@rewiringamerica.org?subject=Launch Rewiring ${record.name}`, '_blank')}
            >
              ⚡ Launch Rewiring {record.name}
            </button>
          </div>
        )}

        {/* Footnotes */}
        <div className="text-xs opacity-50 space-y-1 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          <p>* Sector figures are modelled estimates (no free per-country source).</p>
          <p>
            {record.estimated
              ? 'Country shown with approximate offline estimates.'
              : 'Supply-side data: Our World in Data energy dataset.'}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
