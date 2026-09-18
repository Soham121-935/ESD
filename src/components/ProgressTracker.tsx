import type { SkillDimension, UnitMeta } from '../types'
import { useProgress } from '../lib/progress'
import { accuracyTone } from '../lib/utils'

const SKILL_LABEL: Record<SkillDimension, string> = {
  concept: 'Conceptual',
  numerical: 'Numerical',
  analysis: 'Circuit / System analysis',
  design: 'Design',
  debugging: 'Debugging',
  viva: 'Viva',
}

/** Per-topic progress: sections visited, skill accuracy, weak areas, recommendations. */
export function ProgressTracker({ unit, topicId }: { unit: UnitMeta; topicId: string }) {
  const { state, skillAccuracy, visited } = useProgress()
  const topic = unit.topics.find((t) => t.id === topicId)
  const acc = skillAccuracy(topicId)

  const sections = [
    'theory',
    'numericals',
    'analysis',
    'design',
    'debugging',
    'viva',
    'quiz',
    'exam',
  ]
  const visitedCount = sections.filter((s) => visited(`${topicId}.${s}`)).length

  const entries = Object.entries(acc) as [SkillDimension, number][]
  const weak = entries.filter(([, p]) => p < 60)

  return (
    <div className="card">
      <div className="block-head">
        <h3 style={{ margin: 0 }}>Progress — {topic?.shortTitle ?? topicId}</h3>
        <span className="badge marks">
          {visitedCount}/{sections.length} sections
        </span>
      </div>

      <div className="row tight mb1">
        {sections.map((s) => (
          <span
            key={s}
            className={`badge ${visited(`${topicId}.${s}`) ? '' : ''}`}
            style={
              visited(`${topicId}.${s}`)
                ? { color: 'var(--accent)', borderColor: 'var(--accent-dim)' }
                : { opacity: 0.5 }
            }
          >
            {s}
          </span>
        ))}
      </div>

      {entries.length === 0 ? (
        <p className="small faint">
          No graded attempts yet. Accuracy by skill appears here once you answer questions in the
          Quiz, Exam or Viva sections.
        </p>
      ) : (
        <>
          <div className="block-kind mb1">Accuracy by skill</div>
          {entries.map(([k, p]) => (
            <div className="meter-row" key={k}>
              <span className="ml">{SKILL_LABEL[k]}</span>
              <span className={`meter ${accuracyTone(p) === 'ok' ? '' : 'weak'}`}>
                <i style={{ width: `${p}%` }} />
              </span>
              <span className="mv">{p}%</span>
            </div>
          ))}

          {weak.length > 0 && (
            <div className="callout warn mt1">
              <strong>Weak areas.</strong>{' '}
              {weak.map(([k, p]) => `${SKILL_LABEL[k]} ${p}%`).join(', ')}.
              <ul className="bullets" style={{ marginTop: '0.35rem' }}>
                {weak.map(([k]) => (
                  <li key={k}>Re-attempt {SKILL_LABEL[k].toLowerCase()} questions in the Question Bank, filtered by that type.</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <div className="srcref">
        Attempts recorded: {state.attempts.filter((a) => a.topicId === topicId).length} · stored
        locally in this browser
      </div>
    </div>
  )
}

/** Compact sidebar indicator used on each topic row. */
export function TopicProgressDot({ topicId, sections }: { topicId: string; sections: readonly string[] }) {
  const { visited } = useProgress()
  const n = sections.filter((s) => visited(`${topicId}.${s}`)).length
  const cls = n === 0 ? '' : n >= sections.length ? 'done' : 'part'
  return <span className={`dot ${cls}`} title={`${n}/${sections.length} sections visited`} />
}
