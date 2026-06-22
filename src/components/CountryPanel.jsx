import { motion } from 'framer-motion'
import { rewiringOrgs, TARGET_35x35, getMetricValue } from '../data/electrification'

export default function CountryPanel({ country, mode, metric, onClose }) {
  const org = rewiringOrgs[country.id]
  const value = getMetricValue(country.id, metric) ?? 0
  const progress = Math.min((value / TARGET_35x35) * 100, 100)
  const isAboveTarget = value >= TARGET_35x35
  const gap = Math.max(TARGET_35x35 - value, 0).toFixed(1)

  const metricLabel = metric === 'un35'
    ? 'Electricity Share of Final Energy'
    : 'Productive Energy (electricity equiv.)'

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
        className="sticky top-0 flex items-center justify-between px-5 py-4"
        style={{
          background: 'var(--panel-bg)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--accent)' }}>
            {country.name}
          </h2>
          {mode === 'circuit' && (
            <span className="text-xs opacity-50">[ISO:{country.id}]</span>
          )}
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

      {/* Content */}
      <div className="px-5 py-4 space-y-5">

        {/* Org highlight */}
        {org && (
          <div
            className="rounded-lg p-4"
            style={{
              background: mode === 'circuit'
                ? 'rgba(200,117,51,0.15)'
                : 'rgba(193,127,42,0.12)',
              border: '1px solid var(--accent)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚡</span>
              <span className="font-bold" style={{ color: 'var(--accent)' }}>
                {org.name}
              </span>
            </div>
            <p className="text-sm opacity-70 mb-3">
              Rewiring organization active in {country.name}
            </p>
            <a
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-80"
              style={{
                background: 'var(--accent)',
                color: mode === 'circuit' ? '#0d1f0d' : '#fff',
              }}
            >
              Visit {org.name} →
            </a>
          </div>
        )}

        {/* Stats */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider opacity-60">
            {metricLabel}
          </h3>

          {/* Big number */}
          <div className="flex items-end gap-2">
            <span
              className="text-5xl font-bold"
              style={{ color: 'var(--accent)' }}
            >
              {value.toFixed(1)}
            </span>
            <span className="text-xl mb-2 opacity-70">%</span>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs opacity-60 mb-1">
              <span>0%</span>
              <span className="font-semibold" style={{ color: isAboveTarget ? 'var(--accent)' : undefined }}>
                Target: {TARGET_35x35}%
              </span>
              <span>50%+</span>
            </div>
            <div
              className="h-4 rounded-full overflow-hidden"
              style={{ background: mode === 'circuit' ? '#1a3a1a' : '#e8e0d5' }}
            >
              {/* Target marker */}
              <div
                className="relative h-full"
                style={{ width: '100%' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(value / 50 * 100, 100)}%`,
                    background: isAboveTarget
                      ? mode === 'circuit' ? '#50c850' : '#8aba2e'
                      : 'var(--accent)',
                    boxShadow: mode === 'circuit' ? '0 0 8px var(--accent)' : undefined,
                  }}
                />
                {/* 35% marker line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5"
                  style={{
                    left: `${TARGET_35x35 / 50 * 100}%`,
                    background: '#fff',
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div
            className="rounded-lg p-3 text-sm"
            style={{
              background: isAboveTarget
                ? mode === 'circuit' ? 'rgba(80,200,80,0.1)' : 'rgba(138,186,46,0.1)'
                : 'rgba(200,117,51,0.1)',
              border: `1px solid ${isAboveTarget ? (mode === 'circuit' ? '#50c850' : '#8aba2e') : 'var(--accent)'}`,
            }}
          >
            {isAboveTarget ? (
              <span>
                ✅ <strong>{country.name}</strong> has met the 35×35 target!
              </span>
            ) : (
              <span>
                📍 <strong>{gap}%</strong> to go to reach the 35×35 target
              </span>
            )}
          </div>
        </div>

        {/* Progress toward target */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider opacity-60 mb-2">
            Progress toward 35×35
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: mode === 'circuit' ? '#1a3a1a' : '#e8e0d5' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background: isAboveTarget ? '#50c850' : 'var(--accent)',
                }}
              />
            </div>
            <span className="text-sm font-bold w-12 text-right" style={{ color: 'var(--accent)' }}>
              {progress.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* CTA for non-org countries */}
        {!org && (
          <div
            className="rounded-lg p-4 text-center"
            style={{
              border: '1px dashed var(--border)',
            }}
          >
            <p className="text-sm opacity-70 mb-3">
              No Rewiring organization yet in {country.name}
            </p>
            <button
              className="px-4 py-2 rounded text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                background: 'var(--accent)',
                color: mode === 'circuit' ? '#0d1f0d' : '#fff',
              }}
              onClick={() => {
                window.open(`mailto:hello@rewiringamerica.org?subject=Launch Rewiring ${country.name}`, '_blank')
              }}
            >
              ⚡ Launch Rewiring {country.name}
            </button>
          </div>
        )}

        {/* Metric explanation */}
        <div className="text-xs opacity-50 space-y-1 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
          {metric === 'un35' ? (
            <p>UN 35×35: Electricity as a share of total final energy consumption. Target: 35% by 2035.</p>
          ) : (
            <p>Productive Energy: Electricity share adjusted for ~2.5× efficiency advantage of electric vs combustion. Shows % of useful work delivered electrically.</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
