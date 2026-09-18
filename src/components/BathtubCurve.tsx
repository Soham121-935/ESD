import { useState } from 'react'
import { Callout, SourceBadge } from './Provenance'

export interface BathtubRegion {
  id: string
  name: string
  /** Short description of the shape of λ(t) in this region. */
  shape: string
  /** Causes taken from the supplied material. */
  causes: string[]
  /** What an engineer does about it. */
  componentFix: string[]
  systemFix: string[]
  provenance: 'source' | 'insight'
  sourceRef?: string
}

const W = 720
const H = 260
const PAD = { l: 54, r: 20, t: 20, b: 44 }

/**
 * BathtubCurve — failure rate λ(t) against time, in three regions.
 * Clicking a region reveals the source's stated causes plus the improvement strategy
 * at component level and at product/system level. A stress-severity control shows the
 * source's two-curve observation (high stress severity reaches wear-out earlier).
 */
export function BathtubCurve({
  regions,
  title = 'Bathtub curve — failure rate versus time',
}: {
  regions: BathtubRegion[]
  title?: string
}) {
  const [sel, setSel] = useState<string | null>(regions[1]?.id ?? null)
  const [highStress, setHighStress] = useState(false)

  const plotW = W - PAD.l - PAD.r
  const plotH = H - PAD.t - PAD.b
  const x0 = PAD.l
  const x1 = x0 + plotW * 0.26
  const x2 = x0 + plotW * (highStress ? 0.52 : 0.68)
  const x3 = x0 + plotW
  const yBase = PAD.t + plotH * 0.72
  const yTop = PAD.t + plotH * 0.1

  const path = (severity: number) => {
    // decreasing infant mortality, flat useful life, rising wear-out
    const pts: string[] = []
    const steps = 220
    for (let i = 0; i <= steps; i++) {
      const f = i / steps
      const tt = x0 + f * plotW
      let y: number
      if (tt <= x1) {
        const u = (tt - x0) / (x1 - x0)
        y = yTop + (yBase - yTop) * (0.15 + 0.85 * Math.pow(1 - u, 1.7))
      } else if (tt <= x2) {
        y = yBase
      } else {
        const u = (tt - x2) / (x3 - x2)
        y = yBase - (yBase - yTop) * Math.pow(u, 2.4) * severity
      }
      pts.push(`${tt.toFixed(2)},${y.toFixed(2)}`)
    }
    return pts.join(' ')
  }

  const regionBoxes = [
    { id: regions[0]?.id, x: x0, w: x1 - x0, label: 'Infant mortality' },
    { id: regions[1]?.id, x: x1, w: (highStress ? x0 + plotW * 0.52 : x2) - x1, label: 'Useful life' },
    { id: regions[2]?.id, x: highStress ? x0 + plotW * 0.52 : x2, w: x3 - (highStress ? x0 + plotW * 0.52 : x2), label: 'Wear-out' },
  ]

  const active = regions.find((r) => r.id === sel)

  return (
    <div>
      <div className="block-head">
        <h3 style={{ margin: 0 }}>{title}</h3>
        <div className="row tight">
          <button className={`btn sm ${highStress ? 'primary' : ''}`} onClick={() => setHighStress((v) => !v)}>
            {highStress ? 'Stress severity: HIGH (Graph A)' : 'Stress severity: LOW (Graph B)'}
          </button>
        </div>
      </div>
      <p className="small muted">
        The supplied material notes that the failure-rate curve can be plotted for two different
        stress severities — Graph A (high stress severity) and Graph B (low stress severity).
        Toggle it and watch where the wear-out knee moves.
      </p>

      <div className="circuit-shell">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Bathtub curve">
          {/* axes */}
          <line x1={PAD.l} x2={W - PAD.r} y1={PAD.t + plotH} y2={PAD.t + plotH} stroke="#cbd5e1" />
          <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={PAD.t + plotH} stroke="#cbd5e1" />
          <text
            x={14}
            y={PAD.t + plotH / 2}
            transform={`rotate(-90 14 ${PAD.t + plotH / 2})`}
            textAnchor="middle"
            style={{ fill: 'var(--text-faint)', fontSize: 10.5, fontFamily: 'var(--mono)' }}
          >
            failure rate λ(t)
          </text>
          <text
            x={(W + PAD.l) / 2}
            y={H - 8}
            textAnchor="middle"
            style={{ fill: 'var(--text-faint)', fontSize: 10.5, fontFamily: 'var(--mono)' }}
          >
            operating time
          </text>

          {/* region bands */}
          {regionBoxes.map((b, i) => (
            <g key={i} onClick={() => b.id && setSel(b.id)} style={{ cursor: 'pointer' }}>
              <rect
                x={b.x}
                y={PAD.t}
                width={b.w}
                height={plotH}
                fill={sel === b.id ? 'rgba(37,99,235,0.07)' : 'transparent'}
              />
              {i > 0 && (
                <line x1={b.x} x2={b.x} y1={PAD.t} y2={PAD.t + plotH} stroke="#e2e8f0" strokeDasharray="3 3" />
              )}
              <text
                x={b.x + b.w / 2}
                y={PAD.t + 14}
                textAnchor="middle"
                style={{
                  fill: sel === b.id ? 'var(--accent)' : 'var(--text-faint)',
                  fontSize: 10.5,
                  fontWeight: 600,
                }}
              >
                {b.label}
              </text>
            </g>
          ))}

          {/* curves */}
          <polyline points={path(1)} fill="none" stroke="var(--accent)" strokeWidth="2.2" />
          {highStress && (
            <polyline
              points={path(1.35)}
              fill="none"
              stroke="var(--red)"
              strokeWidth="2.2"
              strokeDasharray="6 3"
            />
          )}

          {/* constant-failure-rate guide in the useful-life region */}
          <line
            x1={x1}
            x2={highStress ? x0 + plotW * 0.52 : x2}
            y1={yBase}
            y2={yBase}
            stroke="var(--green)"
            strokeWidth="1.6"
            strokeDasharray="2 3"
          />
          <text
            x={(x1 + (highStress ? x0 + plotW * 0.52 : x2)) / 2}
            y={yBase + 16}
            textAnchor="middle"
            style={{ fill: 'var(--green)', fontSize: 10, fontFamily: 'var(--mono)' }}
          >
            constant failure rate
          </text>
        </svg>
      </div>

      {active && (
        <div className="card mt1">
          <div className="block-head">
            <h4 style={{ margin: 0 }}>{active.name}</h4>
            <SourceBadge p={active.provenance} />
          </div>
          <p className="small muted">
            <strong>Shape of λ(t):</strong> {active.shape}
          </p>

          <div className="row" style={{ gap: '1.2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 260px' }}>
              <div className="block-kind mb1">Causes</div>
              <ul className="bullets">
                {active.causes.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            <div style={{ flex: '1 1 260px' }}>
              <div className="block-kind mb1">Improvement — component level</div>
              <ul className="bullets">
                {active.componentFix.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            <div style={{ flex: '1 1 260px' }}>
              <div className="block-kind mb1">Improvement — product / system level</div>
              <ul className="bullets">
                {active.systemFix.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {active.sourceRef && <div className="srcref">{active.sourceRef}</div>}
        </div>
      )}

      <Callout>
        <strong>Why the three regions matter for the exponential law.</strong> R(t) = e^(−λt)
        assumes a constant failure rate — that is exactly the flat middle region of the bathtub
        curve. Applying it during infant mortality or during wear-out is the most common modelling
        error in this topic, and the source itself puts “Random — during arbitrary instance” and
        “constant failure rate” in that middle region.
      </Callout>
    </div>
  )
}
