import { useMemo, useState } from 'react'
import { ParameterSlider } from './ParameterSlider'
import { Callout } from './Provenance'

export interface ClassWindow {
  id: string
  name: string
  min: number
  max: number
  cost: string
  color: string
  provenance: 'source' | 'insight'
}

const SOURCE_WINDOWS: ClassWindow[] = [
  { id: 'consumer', name: 'Consumer', min: 0, max: 70, cost: 'Should be affordable', color: '#0369a1', provenance: 'source' },
  { id: 'industry', name: 'Industry', min: -25, max: 85, cost: 'Development cost higher', color: '#b45309', provenance: 'source' },
  { id: 'military', name: 'Military', min: -55, max: 125, cost: 'Very High', color: '#6d28d9', provenance: 'source' },
]

const SCALE_MIN = -70
const SCALE_MAX = 140

function sx(t: number, w: number) {
  return ((t - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * w
}

/**
 * What-if simulator for the classification decision.
 * The student moves the required window and immediately sees which classes survive.
 */
export function TemperatureWindowSim() {
  const [tMin, setTMin] = useState(-22)
  const [tMax, setTMax] = useState(35)
  const [rise, setRise] = useState(0)

  const effMax = tMax + rise

  const results = useMemo(
    () =>
      SOURCE_WINDOWS.map((c) => {
        const low = tMin - c.min
        const high = c.max - effMax
        return { ...c, low, high, pass: low >= 0 && high >= 0 }
      }),
    [tMin, effMax],
  )

  const feasible = results.filter((r) => r.pass)
  const cheapest = feasible[0]

  const W = 740
  const H = 210
  const bandY = 26
  const bandH = 26

  return (
    <div>
      <h3 style={{ margin: 0 }}>What-if — move the requirement, watch the decision change</h3>
      <p className="small muted">
        The three class windows are the supplied values. The required window and the internal
        temperature rise are yours to move.
      </p>

      <div className="row" style={{ gap: '1.4rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          <ParameterSlider
            label="Required minimum ambient"
            value={tMin}
            min={-60}
            max={40}
            step={1}
            unit="°C"
            onChange={(v) => setTMin(Math.min(v, tMax - 5))}
          />
          <ParameterSlider
            label="Required maximum ambient"
            value={tMax}
            min={0}
            max={120}
            step={1}
            unit="°C"
            onChange={(v) => setTMax(Math.max(v, tMin + 5))}
          />
          <ParameterSlider
            label="Internal temperature rise"
            value={rise}
            min={0}
            max={40}
            step={1}
            unit="°C"
            onChange={setRise}
            note="Engineering Insight: heat generated inside the enclosure raises the component temperature above ambient."
          />
        </div>

        <div style={{ flex: '1 1 320px' }}>
          <div className="readout-grid">
            {results.map((r) => (
              <div className={`readout ${r.pass ? 'ok' : 'bad'}`} key={r.id}>
                <div className="rl">{r.name}</div>
                <div className="rv">
                  {r.low >= 0 ? '+' : ''}
                  {r.low.toFixed(0)}
                  <span className="ru"> / {r.high >= 0 ? '+' : ''}{r.high.toFixed(0)} °C</span>
                </div>
                <div className="small faint">low / high margin</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="circuit-shell mt1">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Operating temperature windows">
          {/* axis */}
          {[-60, -40, -20, 0, 20, 40, 60, 80, 100, 120, 140].map((t) => (
            <g key={t}>
              <line
                x1={sx(t, W)}
                x2={sx(t, W)}
                y1={14}
                y2={H - 16}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={sx(t, W)}
                y={H - 4}
                textAnchor="middle"
                style={{ fill: 'var(--text-faint)', fontSize: 9.5, fontFamily: 'var(--mono)' }}
              >
                {t}
              </text>
            </g>
          ))}

          {/* required window */}
          <rect
            x={sx(tMin, W)}
            y={bandY - 10}
            width={Math.max(2, sx(effMax, W) - sx(tMin, W))}
            height={H - 16 - (bandY - 10)}
            fill="rgba(180,83,9,0.07)"
            stroke="var(--amber)"
            strokeDasharray="4 3"
          />
          <text
            x={sx(tMin, W) + 6}
            y={bandY + 2}
            style={{ fill: 'var(--amber)', fontSize: 10, fontFamily: 'var(--mono)' }}
          >
            required {tMin} to {effMax} °C
            {rise > 0 ? ` (+${rise} °C internal)` : ''}
          </text>

          {/* class windows */}
          {results.map((r, i) => {
            const y = bandY + 24 + i * (bandH + 8)
            return (
              <g key={r.id}>
                <rect
                  x={sx(r.min, W)}
                  y={y}
                  width={sx(r.max, W) - sx(r.min, W)}
                  height={bandH}
                  rx="4"
                  fill={r.pass ? r.color : 'rgba(15,23,42,0.04)'}
                  fillOpacity={r.pass ? 0.12 : 1}
                  stroke={r.pass ? r.color : 'var(--red)'}
                  strokeDasharray={r.pass ? undefined : '4 3'}
                />
                <text
                  x={sx(r.min, W) + 6}
                  y={y + 17}
                  style={{ fill: r.pass ? r.color : 'var(--red)', fontSize: 11, fontWeight: 600 }}
                >
                  {r.name} — {r.min} to {r.max} °C
                </text>
                <text
                  x={sx(r.max, W) - 6}
                  y={y + 17}
                  textAnchor="end"
                  style={{
                    fill: r.pass ? 'var(--green)' : 'var(--red)',
                    fontSize: 10.5,
                    fontFamily: 'var(--mono)',
                  }}
                >
                  {r.pass ? 'PASS' : 'FAIL'} · {r.cost}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <Callout tone={feasible.length ? 'ok' : 'warn'} title="Decision">
        {feasible.length === 0 ? (
          <>
            No supplied class covers {tMin} °C to {effMax} °C. The honest engineering answer is that
            the requirement cannot be met by class selection alone — you must change the environment
            (heated or cooled enclosure, relocation) or renegotiate the specification.
          </>
        ) : (
          <>
            {feasible.length} class{feasible.length === 1 ? '' : 'es'} survive
            {feasible.length === 1 ? 's' : ''} the window test. The cheapest that satisfies every
            requirement is <strong>{cheapest.name}</strong> ({cheapest.cost}). Spending more buys
            margin that no stated requirement asked for.
          </>
        )}
      </Callout>

      <p className="small faint">
        Units are visible at every step: margins are in °C, computed as required limit minus class
        limit (low side) and class limit minus required limit (high side), with a class qualifying
        only when both results are ≥ 0 °C.
      </p>
    </div>
  )
}
