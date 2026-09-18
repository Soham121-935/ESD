import { useMemo, useState } from 'react'
import { ParameterSlider } from './ParameterSlider'
import { Callout } from './Provenance'

export interface MatrixParam {
  id: string
  label: string
  /** true when a higher score is better; false when a lower score is better (cost, power, size). */
  higherIsBetter: boolean
  defaultWeight: number
  provenance?: 'source' | 'insight'
}

export interface MatrixOption {
  id: string
  label: string
  /** Raw score per parameter id, on a 1–5 scale. */
  scores: Record<string, number>
}

interface Props {
  title: string
  params: MatrixParam[]
  options: MatrixOption[]
  /** Optional note shown under the table. */
  note?: string
}

/**
 * MatrixBuilder — build a weighted performance or design matrix and watch the
 * ranking change as the requirement weighting changes. Parameters can be marked
 * "lower is better" so that the tool never rewards a large cost or a large power figure.
 */
export function MatrixBuilder({ title, params, options, note }: Props) {
  const [weights, setWeights] = useState<Record<string, number>>(() =>
    Object.fromEntries(params.map((p) => [p.id, p.defaultWeight])),
  )

  const rows = useMemo(() => {
    const totalWeight = params.reduce((s, p) => s + (weights[p.id] ?? 0), 0) || 1
    return options.map((o) => {
      let weighted = 0
      for (const p of params) {
        const raw = o.scores[p.id] ?? 3
        // normalise so that 5 is always "good" whatever the parameter direction
        const good = p.higherIsBetter ? raw : 6 - raw
        weighted += good * (weights[p.id] ?? 0)
      }
      return { option: o, weighted, score: weighted / totalWeight }
    })
  }, [params, options, weights])

  const ranked = [...rows].sort((a, b) => b.score - a.score)
  const best = ranked[0]
  const margin = ranked.length > 1 ? best.score - ranked[1].score : 0

  return (
    <div>
      <h3 style={{ margin: 0 }}>{title}</h3>
      {note && <p className="small muted">{note}</p>}

      <div className="block-kind mb1 mt1">Requirement weighting</div>
      {params.map((p) => (
        <ParameterSlider
          key={p.id}
          label={`${p.label}${p.higherIsBetter ? '' : ' (lower is better)'}`}
          value={weights[p.id] ?? p.defaultWeight}
          min={0}
          max={5}
          step={1}
          unit="/ 5"
          onChange={(v) => setWeights((w) => ({ ...w, [p.id]: v }))}
        />
      ))}

      <div className="table-wrap mt1">
        <table className="matrix">
          <thead>
            <tr>
              <th>Option</th>
              {params.map((p) => (
                <th key={p.id}>
                  {p.label}
                  {p.higherIsBetter ? '' : ' ↓'}
                  <span className="cell-note">weight {weights[p.id]}/5</span>
                </th>
              ))}
              <th>Weighted score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.option.id}>
                <td className="param">{r.option.label}</td>
                {params.map((p) => (
                  <td key={p.id}>
                    {r.option.scores[p.id] ?? '—'}
                    <span className="cell-note">
                      {p.higherIsBetter ? '' : `→ ${6 - (r.option.scores[p.id] ?? 3)} good`}
                    </span>
                  </td>
                ))}
                <td>
                  <strong>{r.score.toFixed(2)}</strong>
                  <span className="cell-note">/ 5.00</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone={margin < 0.25 ? 'warn' : 'ok'} title="Ranking">
        {ranked.map((r, i) => (
          <div key={r.option.id} className="small">
            {i + 1}. <strong>{r.option.label}</strong> — {r.score.toFixed(2)} / 5.00
          </div>
        ))}
        <div className="small mt1">
          {margin < 0.25
            ? `The top two options are separated by only ${margin.toFixed(2)} points. That is inside the noise of any subjective scoring — do not treat it as a decision. Change one weight and see whether the ranking is stable; if it flips, the honest answer is that the requirements do not yet discriminate between the options.`
            : `The leading option wins by ${margin.toFixed(2)} points. Check whether that margin survives a change in the weights — a decision that flips when one weight moves is not a decision yet.`}
        </div>
      </Callout>

      <p className="small faint">
        Scores are on a 1–5 scale and every score runs in the “good” direction, so 5 is always the
        best value. A parameter marked ↓ is one whose raw figure runs the other way (cost in rupees,
        power in mW): the tool inverts it before weighting, so a large raw figure never improves a
        score. The weighting is the requirement — move it and the ranking is allowed to change.
      </p>
    </div>
  )
}
