import { useState } from 'react'
import type { MatrixSpec } from '../types'
import { SourceBadge } from './Provenance'

function columnClass(col: string): string {
  const c = col.toLowerCase()
  if (c.includes('consumer')) return 'consumer'
  if (c.includes('industry') || c.includes('industrial')) return 'industry'
  if (c.includes('military')) return 'military'
  return ''
}

/**
 * PerformanceMatrix — the comparison table used for system-performance and
 * design-matrix work. Row click isolates one parameter for discussion.
 */
export function PerformanceMatrix({ spec }: { spec: MatrixSpec }) {
  const [sel, setSel] = useState<string | null>(null)
  const cols = spec.columns

  return (
    <div>
      <div className="block-head">
        <h3 style={{ margin: 0 }}>{spec.title}</h3>
        <SourceBadge p={spec.provenance} />
      </div>

      <div className="table-wrap">
        <table className="matrix">
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {spec.rows.map((r) => (
              <tr
                key={r.id}
                className={sel === r.id ? 'hl' : ''}
                onClick={() => setSel(sel === r.id ? null : r.id)}
                style={{ cursor: 'pointer' }}
              >
                <td className="param">
                  {r.parameter}
                  {r.note && <span className="cell-note">{r.note}</span>}
                </td>
                {cols.slice(1).map((c) => (
                  <td key={c} className={columnClass(c)}>
                    {r.cells[c] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="small muted mt1">{spec.interpretation}</p>
      <p className="small faint">Click a row to isolate one parameter.</p>
    </div>
  )
}
