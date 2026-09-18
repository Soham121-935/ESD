import { useState } from 'react'

export interface WhyEntry {
  requirement: string
  parameter: string
  value: string
  whatIf: string
}

/**
 * WhyButton — the "why did you choose this value?" control.
 * Reveals: requirement → parameter → selected value → what happens if it changes.
 */
export function WhyButton({ entries, label }: { entries: WhyEntry[]; label?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt1">
      <button className="btn sm" onClick={() => setOpen((o) => !o)}>
        {open ? '▾' : '▸'} {label ?? 'Why this value?'}
      </button>
      {open && (
        <div className="table-wrap mt1">
          <table className="matrix">
            <thead>
              <tr>
                <th>Requirement</th>
                <th>Parameter</th>
                <th>Chosen value</th>
                <th>If it changes</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={i}>
                  <td>{e.requirement}</td>
                  <td className="param">{e.parameter}</td>
                  <td className="mono">{e.value}</td>
                  <td className="muted">{e.whatIf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
