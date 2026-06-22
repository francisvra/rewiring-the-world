import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import WorldMap from './components/WorldMap'
import CountryPanel from './components/CountryPanel'
import Controls from './components/Controls'

export default function App() {
  const [mode, setMode] = useState('sketch') // 'sketch' | 'circuit'
  const [metric, setMetric] = useState('un35') // 'un35' | 'productive'
  const [selectedCountry, setSelectedCountry] = useState(null)

  const handleCountryClick = useCallback((country) => {
    setSelectedCountry(country)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedCountry(null)
  }, [])

  return (
    <div
      className={`mode-${mode} w-screen h-screen relative overflow-hidden`}
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* Background texture for sketch mode */}
      {mode === 'sketch' && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* PCB grid for circuit mode */}
      {mode === 'circuit' && (
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `linear-gradient(var(--accent) 1px, transparent 1px), linear-gradient(90deg, var(--accent) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      )}

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <h1
          className="text-3xl font-bold tracking-wide"
          style={{ color: 'var(--accent)' }}
        >
          ⚡ Rewiring the World
        </h1>
        <p className="text-sm mt-1 opacity-70">
          {metric === 'un35'
            ? 'UN 35×35: Electricity as % of final energy (target 35% by 2035)'
            : 'Productive Energy: % of useful work delivered electrically'}
        </p>
      </div>

      {/* Controls */}
      <Controls mode={mode} setMode={setMode} metric={metric} setMetric={setMetric} />

      {/* Map */}
      <WorldMap
        mode={mode}
        metric={metric}
        onCountryClick={handleCountryClick}
        selectedCountryId={selectedCountry?.id}
      />

      {/* Country panel */}
      <AnimatePresence>
        {selectedCountry && (
          <CountryPanel
            key={selectedCountry.id}
            country={selectedCountry}
            mode={mode}
            metric={metric}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
