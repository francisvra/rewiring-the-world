// A waffle "fleet" of ~100 machine icons, laid out proportional to each
// machine's weight. Within each machine's icons, a number equal to its stock
// share are "lit" (electric); the rest are muted = still to replace.
export default function MachineFleet({ machines, mode }) {
  if (!machines) return null

  // Build ~100 cells, proportioned by machine weight, ordered by roster.
  const TOTAL = 100
  const cells = []
  machines.forEach((m) => {
    const count = Math.round(m.weight * TOTAL)
    const lit = Math.round((m.stockShare ?? 0) / 100 * count)
    for (let i = 0; i < count; i++) {
      cells.push({ icon: m.icon, lit: i < lit, key: `${m.key}-${i}` })
    }
  })

  return (
    <div
      className="grid gap-[3px] p-3 rounded-lg"
      style={{
        gridTemplateColumns: 'repeat(10, 1fr)',
        background: mode === 'circuit' ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.04)',
        border: '1px solid var(--border)',
      }}
    >
      {cells.map((c) => (
        <span
          key={c.key}
          className={c.lit && mode === 'circuit' ? 'led-glow' : undefined}
          style={{
            fontSize: 13,
            lineHeight: 1,
            textAlign: 'center',
            // Lit = full colour; unlit = greyed/faded "to replace".
            filter: c.lit
              ? mode === 'circuit'
                ? 'none'
                : 'saturate(1.3)'
              : 'grayscale(1) opacity(0.3)',
          }}
          title={c.lit ? 'Electric' : 'To replace'}
        >
          {c.icon}
        </span>
      ))}
    </div>
  )
}
