import { useState } from 'react'

export interface BuildStage {
  id: string
  title: string
  body: string
  detail?: string
}

/**
 * StepBuilder — reveals a circuit / system one stage at a time.
 * Earlier stages stay visible; only the next stage is revealed.
 */
export function StepBuilder({ stages }: { stages: BuildStage[] }) {
  const [n, setN] = useState(1)
  const [showDetail, setShowDetail] = useState<string | null>(null)

  return (
    <div>
      <div className="row tight mb1">
        <button className="btn sm" onClick={() => setN((v) => Math.max(1, v - 1))} disabled={n <= 1}>
          ◂ Back
        </button>
        <button
          className="btn sm primary"
          onClick={() => setN((v) => Math.min(stages.length, v + 1))}
          disabled={n >= stages.length}
        >
          Reveal next stage ▸
        </button>
        <button className="btn sm ghost" onClick={() => setN(stages.length)}>
          Show all
        </button>
        <span className="small faint">
          Stage {n} of {stages.length}
        </span>
      </div>

      <ol className="bullets" style={{ listStyle: 'none', paddingLeft: 0 }}>
        {stages.slice(0, n).map((s, i) => (
          <li
            key={s.id}
            className="card"
            style={{ marginBottom: '0.5rem', borderLeft: '3px solid var(--blue)' }}
          >
            <div className="between">
              <strong>
                <span className="mono faint">{(i + 1).toString().padStart(2, '0')} </span>
                {s.title}
              </strong>
              {s.detail && (
                <button
                  className="btn sm ghost"
                  onClick={() => setShowDetail(showDetail === s.id ? null : s.id)}
                >
                  {showDetail === s.id ? 'Hide' : 'Detail'}
                </button>
              )}
            </div>
            <p className="small muted mt1" style={{ margin: '0.35rem 0 0' }}>
              {s.body}
            </p>
            {s.detail && showDetail === s.id && (
              <div className="reveal small muted">{s.detail}</div>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
