import { useState } from 'react'
import type { DesignChallengeSpec } from '../types'
import { useProgress } from '../lib/progress'
import { normalize } from '../lib/utils'
import { SourceBadge } from './Provenance'

/**
 * DesignChallenge — the student receives a specification, not a circuit.
 * Hints are progressive; the full solution is only revealed after an attempt.
 */
export function DesignChallenge({ spec, topicId }: { spec: DesignChallengeSpec; topicId: string }) {
  const { recordDesign } = useProgress()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [hintLevel, setHintLevel] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  const answeredCount = spec.checks.filter((c) => (answers[c.id] ?? '').trim() !== '').length

  function isCorrect(id: string, value: string) {
    const check = spec.checks.find((c) => c.id === id)
    if (!check) return false
    const v = normalize(value)
    return check.accepted.some((a) => {
      const n = normalize(a)
      return v === n || v.includes(n)
    })
  }

  function submit() {
    const score = Math.round(
      (spec.checks.filter((c) => isCorrect(c.id, answers[c.id] ?? '')).length / spec.checks.length) *
        100,
    )
    recordDesign(spec.id, score)
    setSubmitted(true)
  }

  const score = submitted
    ? Math.round(
        (spec.checks.filter((c) => isCorrect(c.id, answers[c.id] ?? '')).length /
          spec.checks.length) *
          100,
      )
    : 0

  return (
    <div>
      <div className="block-head">
        <h3 style={{ margin: 0 }}>{spec.title}</h3>
        <SourceBadge p={spec.provenance} />
      </div>

      {/* REQUIREMENT */}
      <div className="block problem">
        <div className="block-kind">Requirement</div>
        <p>{spec.requirement}</p>
      </div>

      <div className="row" style={{ gap: '0.9rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px' }}>
          <div className="block-kind mb1">Constraints</div>
          <ul className="bullets">
            {spec.constraints.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <div className="block-kind mb1">Assumptions</div>
          <ul className="bullets">
            {spec.assumptions.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flowline mt1">
        <span className="step">Requirement</span>
        <span className="arrow">→</span>
        <span className="step">Identify inputs</span>
        <span className="arrow">→</span>
        <span className="step">Identify outputs</span>
        <span className="arrow">→</span>
        <span className="step">Constraints</span>
        <span className="arrow">→</span>
        <span className="step">Select class</span>
        <span className="arrow">→</span>
        <span className="step">Justify values</span>
        <span className="arrow">→</span>
        <span className="step">Verify</span>
      </div>

      {/* CHECKS */}
      {spec.checks.map((c, i) => {
        const hl = hintLevel[c.id] ?? 0
        const ok = submitted && isCorrect(c.id, answers[c.id] ?? '')
        const bad = submitted && !ok
        return (
          <div className={`step ${ok ? 'solved' : bad ? 'failed' : ''}`} key={c.id}>
            <div className="step-head">
              <span className="step-n">
                Decision {i + 1} — {c.label}
              </span>
              {ok && <span className="badge" style={{ color: 'var(--green)' }}>correct</span>}
              {bad && <span className="badge" style={{ color: 'var(--red)' }}>review</span>}
            </div>
            <p className="step-ask">{c.ask}</p>
            <div className="inline">
              <input
                type="text"
                value={answers[c.id] ?? ''}
                placeholder="your decision"
                onChange={(e) => setAnswers((s) => ({ ...s, [c.id]: e.target.value }))}
              />
              {c.unit && <span className="unit">{c.unit}</span>}
            </div>
            <div className="row tight mt1">
              <button
                className="btn sm ghost"
                onClick={() => setHintLevel((h) => ({ ...h, [c.id]: hl + 1 }))}
                disabled={hl >= c.hints.length}
              >
                Hint {Math.min(hl + 1, c.hints.length)}/{c.hints.length}
              </button>
            </div>
            {c.hints.slice(0, hl).map((h, k) => (
              <div className="hintbox" key={k}>
                Hint {k + 1}: {h}
              </div>
            ))}
            {(submitted || hl >= c.hints.length) && (
              <div className="reveal">
                <dl>
                  <dt>Rationale</dt>
                  <dd>{c.rationale}</dd>
                </dl>
              </div>
            )}
          </div>
        )
      })}

      <div className="row tight mt1">
        <button
          className="btn primary"
          onClick={submit}
          disabled={answeredCount === 0 || submitted}
        >
          Submit design
        </button>
        {submitted && (
          <>
            <span className={`badge ${score >= 70 ? 'level1' : score >= 40 ? 'level3' : 'level5'}`}>
              Score {score}%
            </span>
            <button className="btn sm" onClick={() => setShowSolution((s) => !s)}>
              {showSolution ? 'Hide' : 'Reveal'} full worked design
            </button>
            <button
              className="btn sm ghost"
              onClick={() => {
                setSubmitted(false)
                setAnswers({})
                setHintLevel({})
              }}
            >
              Retry
            </button>
          </>
        )}
      </div>

      {showSolution && (
        <div className="card mt2">
          <div className="block-kind mb1">Full worked design</div>
          <dl>
            {spec.solution.map((s, i) => (
              <div key={i} style={{ marginBottom: '0.6rem' }}>
                <dt className="block-kind">{s.label}</dt>
                <dd style={{ margin: '0.2rem 0 0' }}>{s.content}</dd>
              </div>
            ))}
          </dl>
          <div className="block-kind mb1 mt2">Possible failure modes</div>
          <ul className="bullets">
            {spec.failureModes.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
          <div className="callout ok mt1">{spec.interpretation}</div>
          <div className="srcref">
            Recorded against topic {topicId} in your local progress.
          </div>
        </div>
      )}
    </div>
  )
}
