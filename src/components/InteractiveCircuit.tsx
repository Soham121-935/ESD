import { useState } from 'react'

export interface CircuitNode {
  id: string
  label: string
  sub?: string
  x: number
  y: number
  w: number
  h: number
  role?: string
  why?: string
  parameters?: string[]
  /** Optional live value shown under the label. */
  readout?: string
}

export interface CircuitEdge {
  from: string
  to: string
  label?: string
}

interface Props {
  nodes: CircuitNode[]
  edges: CircuitEdge[]
  /** Rendered height of the SVG viewBox. */
  height?: number
  width?: number
  caption?: string
}

function anchor(n: CircuitNode, side: 'l' | 'r' | 't' | 'b' | 'c') {
  switch (side) {
    case 'l':
      return { x: n.x, y: n.y + n.h / 2 }
    case 'r':
      return { x: n.x + n.w, y: n.y + n.h / 2 }
    case 't':
      return { x: n.x + n.w / 2, y: n.y }
    case 'b':
      return { x: n.x + n.w / 2, y: n.y + n.h }
    default:
      return { x: n.x + n.w / 2, y: n.y + n.h / 2 }
  }
}

function edgePath(a: CircuitNode, b: CircuitNode) {
  const ac = anchor(a, 'c')
  const bc = anchor(b, 'c')
  const horizontal = Math.abs(bc.x - ac.x) > Math.abs(bc.y - ac.y)
  if (horizontal) {
    const from = bc.x > ac.x ? anchor(a, 'r') : anchor(a, 'l')
    const to = bc.x > ac.x ? anchor(b, 'l') : anchor(b, 'r')
    const mx = (from.x + to.x) / 2
    return { d: `M ${from.x} ${from.y} H ${mx} V ${to.y} H ${to.x}`, mx, my: (from.y + to.y) / 2 }
  }
  const from = bc.y > ac.y ? anchor(a, 'b') : anchor(a, 't')
  const to = bc.y > ac.y ? anchor(b, 't') : anchor(b, 'b')
  const my = (from.y + to.y) / 2
  return { d: `M ${from.x} ${from.y} V ${my} H ${to.x} V ${to.y}`, mx: (from.x + to.x) / 2, my }
}

/**
 * InteractiveCircuit — functional block/system diagram.
 * Clicking a block reveals its role, why it matters and which parameters it drives.
 * Values shown on the diagram are supplied by the caller, so the diagram updates
 * whenever a slider upstream changes.
 */
export function InteractiveCircuit({ nodes, edges, height = 360, width = 760, caption }: Props) {
  const [sel, setSel] = useState<string | null>(null)
  const node = nodes.find((n) => n.id === sel) ?? null

  return (
    <div>
      <div className="circuit-shell">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={caption ?? 'System diagram'}>
          <defs>
            <marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#cbd5e1" />
            </marker>
            <marker id="arrow-on" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="var(--accent)" />
            </marker>
          </defs>

          {edges.map((e) => {
            const a = nodes.find((n) => n.id === e.from)
            const b = nodes.find((n) => n.id === e.to)
            if (!a || !b) return null
            const p = edgePath(a, b)
            const active = sel === e.from || sel === e.to
            return (
              <g key={`${e.from}-${e.to}`}>
                <path
                  className={`circuit-edge ${active ? 'active' : ''}`}
                  d={p.d}
                  markerEnd={active ? 'url(#arrow-on)' : 'url(#arrow)'}
                />
                {e.label && (
                  <g>
                    <rect
                      x={p.mx - (e.label.length * 5.3 + 10) / 2}
                      y={p.my - 15}
                      width={e.label.length * 5.3 + 10}
                      height={13}
                      rx={3}
                      fill="var(--bg-2)"
                      stroke="var(--line-soft)"
                    />
                    <text
                      className="circuit-elabel"
                      x={p.mx}
                      y={p.my - 5}
                      textAnchor="middle"
                    >
                      {e.label}
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {nodes.map((n) => (
            <g
              key={n.id}
              className={`circuit-node ${sel === n.id ? 'selected' : ''}`}
              onClick={() => setSel(sel === n.id ? null : n.id)}
            >
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="8" />
              <text className="nlabel" x={n.x + n.w / 2} y={n.y + 24} textAnchor="middle">
                {n.label}
              </text>
              {n.sub && (
                  <text className="nsub" x={n.x + n.w / 2} y={n.y + 41} textAnchor="middle">
                    {n.sub.length > 24 ? `${n.sub.slice(0, 23)}…` : n.sub}
                  </text>
              )}
              {n.readout && (
                <text className="nsub" x={n.x + n.w / 2} y={n.y + n.h - 10} textAnchor="middle">
                  {n.readout}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {node ? (
        <div className="node-detail">
          <h4>{node.label}</h4>
          <dl className="kv">
            {node.role && (
              <>
                <dt>Role</dt>
                <dd>{node.role}</dd>
              </>
            )}
            {node.why && (
              <>
                <dt>Why here</dt>
                <dd>{node.why}</dd>
              </>
            )}
            {node.parameters && node.parameters.length > 0 && (
              <>
                <dt>Drives</dt>
                <dd>{node.parameters.join(' · ')}</dd>
              </>
            )}
            {node.readout && (
              <>
                <dt>Now</dt>
                <dd className="mono">{node.readout}</dd>
              </>
            )}
          </dl>
        </div>
      ) : (
        <p className="small faint mt1">
          Click any block to see what it does, why it matters for classification and which of the
          seven parameters it drives.
        </p>
      )}
    </div>
  )
}
