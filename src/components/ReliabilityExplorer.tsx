import { useState } from 'react'
import { ParameterSlider } from './ParameterSlider'
import { Callout, SourceBadge } from './Provenance'

const W = 720
const H = 250
const PAD = { l: 52, r: 18, t: 18, b: 40 }

/**
 * ReliabilityExplorer — R(t) = e^(−λt) with the source's own anchor point.
 * The supplied material defines m = 1/λ and notes that at t = m, R = e^(−1) = 0.37.
 */
export function ReliabilityExplorer() {
  const [lambda, setLambda] = useState(0.02)
  const [t, setT] = useState(50)
  const [n, setN] = useState(1000)

  const R = Math.exp(-lambda * t)
  const m = lambda > 0 ? 1 / lambda : Infinity
  const tOverM = m === Infinity ? 0 : t / m

  const tMax = Math.max(120, Math.ceil(m * 3) > 0 ? Math.ceil(m * 3) : 120)
  const plotW = W - PAD.l - PAD.r
  const plotH = H - PAD.t - PAD.b

  const sx = (v: number) => PAD.l + (v / tMax) * plotW
  const sy = (v: number) => PAD.t + (1 - v) * plotH

  const pts: string[] = []
  for (let i = 0; i <= 200; i++) {
    const tt = (i / 200) * tMax
    pts.push(`${sx(tt).toFixed(2)},${sy(Math.exp(-lambda * tt)).toFixed(2)}`)
  }

  const survivors = Math.round(n * R)
  const failed = n - survivors

  return (
    <div>
      <div className="block-head">
        <h3 style={{ margin: 0 }}>What-if — R(t) = e^(−λt)</h3>
        <SourceBadge p="source" label="Law from source" />
      </div>
      <p className="small muted">
        Move the failure rate and the operating time. The curve, the MTBF marker and the population
        read-out all update together.
      </p>

      <div className="row" style={{ gap: '1.4rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 290px', minWidth: 260 }}>
          <ParameterSlider
            label="Failure rate λ"
            value={lambda}
            min={0.001}
            max={0.2}
            step={0.001}
            unit="per month"
            onChange={setLambda}
            format={(v) => v.toFixed(3)}
            note="Source states λ as system failure rate (failure per month); m = 1/λ."
          />
          <ParameterSlider
            label="Operating time t"
            value={t}
            min={0}
            max={Math.min(tMax, 600)}
            step={1}
            unit="months"
            onChange={setT}
          />
          <ParameterSlider
            label="Population N"
            value={n}
            min={10}
            max={5000}
            step={10}
            unit="units"
            onChange={setN}
            note="Engineering Insight: converts probability into a number a maintenance engineer can plan with."
          />
        </div>

        <div style={{ flex: '1 1 300px', minWidth: 260 }}>
          <div className="readout-grid">
            <div className="readout">
              <div className="rl">R(t)</div>
              <div className="rv">{(R * 100).toFixed(2)}<span className="ru">%</span></div>
            </div>
            <div className="readout">
              <div className="rl">MTBF m = 1/λ</div>
              <div className="rv">{m.toFixed(1)}<span className="ru">months</span></div>
            </div>
            <div className="readout">
              <div className="rl">t / m</div>
              <div className="rv">{tOverM.toFixed(2)}</div>
            </div>
            <div className={R >= 0.9 ? 'readout ok' : R >= 0.5 ? 'readout warn' : 'readout bad'}>
              <div className="rl">Expected survivors</div>
              <div className="rv">
                {survivors}
                <span className="ru">/ {n}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="circuit-shell mt1">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Reliability versus time">
          {/* grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <g key={v}>
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={sy(v)}
                y2={sy(v)}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={PAD.l - 8}
                y={sy(v) + 3}
                textAnchor="end"
                style={{ fill: 'var(--text-faint)', fontSize: 9.5, fontFamily: 'var(--mono)' }}
              >
                {(v * 100).toFixed(0)}%
              </text>
            </g>
          ))}

          {/* axes */}
          <line x1={PAD.l} x2={W - PAD.r} y1={sy(0)} y2={sy(0)} stroke="#cbd5e1" />
          <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={sy(0)} stroke="#cbd5e1" />

          {/* MTBF marker */}
          {m <= tMax && (
            <g>
              <line
                x1={sx(m)}
                x2={sx(m)}
                y1={PAD.t}
                y2={sy(0)}
                stroke="var(--amber)"
                strokeDasharray="4 3"
              />
              <text
                x={sx(m) + 5}
                y={PAD.t + 12}
                style={{ fill: 'var(--amber)', fontSize: 10, fontFamily: 'var(--mono)' }}
              >
                t = m → R = 37%
              </text>
              <circle cx={sx(m)} cy={sy(Math.exp(-1))} r="3.5" fill="var(--amber)" />
            </g>
          )}

          {/* curve */}
          <polyline points={pts.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="2.2" />

          {/* current point */}
          <line
            x1={sx(t)}
            x2={sx(t)}
            y1={PAD.t}
            y2={sy(0)}
            stroke="var(--text-faint)"
            strokeDasharray="3 3"
          />
          <circle cx={sx(t)} cy={sy(R)} r="4.5" fill="var(--accent)" stroke="#fff" strokeWidth="1.5" />
          <text
            x={sx(t) + 8}
            y={sy(R) - 6}
            style={{ fill: 'var(--text)', fontSize: 11, fontWeight: 600 }}
          >
            t = {t} months, R = {(R * 100).toFixed(1)}%
          </text>

          <text
            x={(W + PAD.l) / 2}
            y={H - 8}
            textAnchor="middle"
            style={{ fill: 'var(--text-faint)', fontSize: 10.5, fontFamily: 'var(--mono)' }}
          >
            operating time t (months) — λ = {lambda.toFixed(3)} /month, m = {m.toFixed(1)} months
          </text>
        </svg>
      </div>

      <Callout tone={tOverM > 1 ? 'warn' : 'info'}>
        <strong>Read it like an engineer.</strong> At t = {t} months the exponent is
        −λt = −{lambda.toFixed(3)} × {t} = −{(lambda * t).toFixed(3)}, so R = e
        <sup>−{(lambda * t).toFixed(3)}</sup> = {(R * 100).toFixed(2)}%. Out of {n} units, about{' '}
        {survivors} are expected to still be running and about {failed} are expected to have failed.
        {tOverM >= 0.98 && tOverM <= 1.02
          ? ' You are sitting exactly on t = m, which is the source’s anchor point: R = e⁻¹ = 0.37, i.e. 37%.'
          : ''}
      </Callout>

      <p className="small faint">
        Units are carried through every step: λ is in failures per month, t is in months, so λt is
        dimensionless, and R is a probability between 0 and 1 (shown also as a percentage).
      </p>
    </div>
  )
}
