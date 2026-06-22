export default function Controls({ mode, setMode, metric, setMetric }) {
  const btnBase = `
    px-3 py-1.5 text-sm rounded cursor-pointer border transition-all duration-200
    focus:outline-none
  `

  const activeStyle = {
    background: 'var(--accent)',
    color: mode === 'circuit' ? '#0d1f0d' : '#fff',
    borderColor: 'var(--accent)',
  }
  const inactiveStyle = {
    background: 'transparent',
    color: 'var(--text)',
    borderColor: 'var(--border)',
  }

  return (
    <div
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-4 items-center px-5 py-3 rounded-xl"
      style={{
        background: 'var(--panel-bg)',
        border: '1px solid var(--border)',
        boxShadow: mode === 'circuit'
          ? '0 0 20px rgba(200,117,51,0.3)'
          : '2px 3px 8px rgba(0,0,0,0.15)',
      }}
    >
      {/* Metric toggle */}
      <div className="flex gap-1">
        <span className="text-xs opacity-60 mr-1 self-center">Metric:</span>
        <button
          className={btnBase}
          style={metric === 'un35' ? activeStyle : inactiveStyle}
          onClick={() => setMetric('un35')}
        >
          UN 35×35
        </button>
        <button
          className={btnBase}
          style={metric === 'productive' ? activeStyle : inactiveStyle}
          onClick={() => setMetric('productive')}
        >
          Productive Energy
        </button>
      </div>

      <div
        className="w-px h-8 opacity-30"
        style={{ background: 'var(--border)' }}
      />

      {/* Mode toggle */}
      <div className="flex gap-1">
        <span className="text-xs opacity-60 mr-1 self-center">Style:</span>
        <button
          className={btnBase}
          style={mode === 'sketch' ? activeStyle : inactiveStyle}
          onClick={() => setMode('sketch')}
        >
          ✏️ Hand-drawn
        </button>
        <button
          className={btnBase}
          style={mode === 'circuit' ? activeStyle : inactiveStyle}
          onClick={() => setMode('circuit')}
        >
          🔌 Circuit
        </button>
      </div>
    </div>
  )
}
