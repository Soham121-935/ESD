import { useMemo, useState } from 'react'
import type { NumericalProblem, StepEntry } from '../types'
import { useProgress } from '../lib/progress'
import { normalize, parseNumber } from '../lib/utils'
import { SourceBadge } from './Provenance'

type StepStatus = 'locked' | 'open' | 'solved'

function entryIsCorrect(entry: StepEntry, raw: string): boolean {
  const v = raw.trim()
  if (v === '') return false
  const accepted = (entry.accepted ?? []).map(normalize)
  if (accepted.includes(normalize(v))) return true
  if (entry.answer === null) return false
  const n = parseNumber(v)
  if (n === null) return false
  return Math.abs(n - entry.answer) <= entry.tolerance
}

/**
 * NumericalSolver
 *
 * Given → Required → Concept → Equation → Substitution → Answer → Verification → Interpretation
 *
 * The student enters every intermediate quantity. A wrong attempt names the failing
 * entry and offers a hint; the full substitution is only revealed once the step is solved.
 */
export function NumericalSolver({
  problem,
  topicId,
}: {
  problem: NumericalProblem
  topicId: string
}) {
  const { recordAttempt } = useProgress()
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Record<string, StepStatus>>({})
  const [results, setResults] = useState<Record<string, { wrong: string[] }>>({})
  const [hintLevel, setHintLevel] = useState<Record<string, number>>({})
  const [showConcept, setShowConcept] = useState<Record<string, boolean>>({})
  const [showEquation, setShowEquation] = useState<Record<string, boolean>>({})
  const [showSolution, setShowSolution] = useState(false)

  const stepStatus = (i: number, id: string): StepStatus => {
    if (status[id]) return status[id]
    if (i === 0) return 'open'
    const prev = problem.steps[i - 1]
    return status[prev.id] === 'solved' ? 'open' : 'locked'
  }

  const solvedCount = problem.steps.filter((s) => status[s.id] === 'solved').length
  const totalEntries = useMemo(
    () => problem.steps.reduce((n, s) => n + s.entries.length, 0),
    [problem.steps],
  )

  function check(stepIndex: number) {
    const step = problem.steps[stepIndex]
    const wrong: string[] = []
    for (const e of step.entries) {
      if (!entryIsCorrect(e, inputs[e.id] ?? '')) wrong.push(e.id)
    }
    if (wrong.length === 0) {
      setStatus((s) => ({ ...s, [step.id]: 'solved' }))
      setResults((r) => ({ ...r, [step.id]: { wrong: [] } }))
      recordAttempt({
        questionId: `${problem.id}:${step.id}`,
        topicId,
        skill: 'numerical',
        correct: true,
        marks: 1,
        awarded: 1,
      })
    } else {
      setResults((r) => ({ ...r, [step.id]: { wrong } }))
      recordAttempt({
        questionId: `${problem.id}:${step.id}`,
        topicId,
        skill: 'numerical',
        correct: false,
        marks: 1,
        awarded: 0,
      })
    }
  }

  return (
    <div>
      <div className="block-head">
        <h3 style={{ margin: 0 }}>{problem.title}</h3>
        <SourceBadge p={problem.provenance} />
      </div>

      <p className="muted small">{problem.situation}</p>

      {/* 1. Given */}
      <div className="card">
        <div className="block-kind mb1">1 — Given</div>
        <div className="given-grid">
          {problem.given.map((g) => (
            <div key={g.symbol}>
              <span className="k">{g.symbol}</span>
              <span className="v">{g.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Required */}
      <div className="card">
        <div className="block-kind mb1">2 — Required</div>
        <ol className="bullets" style={{ margin: 0 }}>
          {problem.required.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ol>
        <div className="mt1">
          <span className="badge marks">
            {solvedCount}/{problem.steps.length} steps solved · {totalEntries} entries
          </span>
        </div>
      </div>

      {/* Assumptions */}
      <div className="callout warn">
        <strong>Assumptions.</strong>
        <ul className="bullets" style={{ marginTop: '0.3rem' }}>
          {problem.assumptions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      {problem.steps.map((step, i) => {
        const st = stepStatus(i, step.id)
        const wrong = results[step.id]?.wrong ?? []
        const hl = hintLevel[step.id] ?? 0

        return (
          <div key={step.id} className={`step ${st === 'solved' ? 'solved' : ''}`}>
            <div className="step-head">
              <span className="step-n">Step {i + 1}</span>
              {st === 'solved' ? (
                <span className="badge" style={{ color: 'var(--green)', borderColor: '#bbf7d0', background: 'var(--green-soft)' }}>
                  solved
                </span>
              ) : st === 'locked' ? (
                <span className="badge">locked</span>
              ) : null}
            </div>

            <p className="step-ask">{step.ask}</p>

            {st === 'locked' ? (
              <p className="small faint">Solve the previous step to unlock this one.</p>
            ) : (
              <>
                <div className="row tight mb1">
                  <button
                    className="btn sm ghost"
                    onClick={() => setShowConcept((s) => ({ ...s, [step.id]: !s[step.id] }))}
                  >
                    {showConcept[step.id] ? 'Hide concept' : 'Relevant concept'}
                  </button>
                  <button
                    className="btn sm ghost"
                    onClick={() => setShowEquation((s) => ({ ...s, [step.id]: !s[step.id] }))}
                  >
                    {showEquation[step.id] ? 'Hide equation' : 'Equation'}
                  </button>
                </div>

                {showConcept[step.id] && <div className="hintbox">{step.concept}</div>}
                {showEquation[step.id] && (
                  <div className="okbox mono">{step.equation}</div>
                )}

                {step.entries.map((e) => (
                  <div key={e.id} className="mt1">
                    <label className="small faint" htmlFor={`in-${e.id}`}>
                      {e.label}
                    </label>
                    <div className="inline">
                      <input
                        id={`in-${e.id}`}
                        type="text"
                        inputMode="decimal"
                        placeholder="your value"
                        value={inputs[e.id] ?? ''}
                        disabled={st === 'solved'}
                        onChange={(ev) =>
                          setInputs((s) => ({ ...s, [e.id]: ev.target.value }))
                        }
                      />
                      <span className="unit">{e.unit}</span>
                    </div>
                  </div>
                ))}

                {st !== 'solved' && (
                  <div className="row tight mt1">
                    <button className="btn sm primary" onClick={() => check(i)}>
                      Check this step
                    </button>
                    <button
                      className="btn sm ghost"
                      onClick={() => setHintLevel((h) => ({ ...h, [step.id]: hl + 1 }))}
                      disabled={hl >= step.hints.length}
                    >
                      Hint {Math.min(hl + 1, step.hints.length)}/{step.hints.length}
                    </button>
                  </div>
                )}

                {hl > 0 &&
                  step.hints.slice(0, hl).map((h, k) => (
                    <div className="hintbox" key={k}>
                      Hint {k + 1}: {h}
                    </div>
                  ))}

                {wrong.length > 0 && (
                  <div className="errbox">
                    Not yet. The following entr{wrong.length === 1 ? 'y is' : 'ies are'} not
                    correct: <strong>{wrong.map((w) => step.entries.find((e) => e.id === w)?.label).join(', ')}</strong>
                    . Re-check the sign convention and the units before trying again.
                  </div>
                )}

                {st === 'solved' && (
                  <div className="reveal">
                    <dl>
                      <dt>Substitution</dt>
                      <dd className="eq">{step.substitution}</dd>
                      <dt>Answer</dt>
                      <dd>
                        {step.entries
                          .map((e) => {
                            const v = inputs[e.id] ?? ''
                            return `${e.label} = ${v.trim()} ${e.unit}`
                          })
                          .join('  |  ')}
                      </dd>
                      <dt>Why</dt>
                      <dd>{step.interpretation}</dd>
                      {step.whatIf && (
                        <>
                          <dt>What if?</dt>
                          <dd>{step.whatIf}</dd>
                        </>
                      )}
                    </dl>
                  </div>
                )}
              </>
            )}
          </div>
        )
      })}

      {/* 7–10. Verification and interpretation */}
      {solvedCount === problem.steps.length ? (
        <div className="card" style={{ borderColor: 'var(--accent-dim)' }}>
          <div className="block-kind mb1">Verification</div>
          <p className="small">{problem.verification}</p>
          <div className="block-kind mb1 mt2">Engineering interpretation</div>
          <p className="small">{problem.interpretation}</p>
          <div className="callout ok mt1">
            <strong>Result makes engineering sense because:</strong> the class chosen is the
            cheapest one whose stated window contains both required limits, and every rejected class
            was rejected by an arithmetic test — not by opinion.
          </div>
        </div>
      ) : (
        <div className="empty small">
          All {problem.steps.length} steps must be solved before the verification and the
          engineering interpretation are unlocked.
        </div>
      )}

      {/* Full model answer — only after the attempt */}
      <div className="mt2">
        {showSolution ? (
          <div className="card">
            <div className="block-head">
              <div className="block-kind">Full model answer</div>
              <button className="btn sm ghost" onClick={() => setShowSolution(false)}>
                Hide
              </button>
            </div>
            <ol className="bullets">
              {problem.steps.map((s) => (
                <li key={s.id}>
                  <strong>{s.ask}</strong>
                  <div className="mono small" style={{ color: 'var(--accent)' }}>
                    {s.equation}
                  </div>
                  <div className="small muted">{s.substitution}</div>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <button
            className="btn sm"
            onClick={() => setShowSolution(true)}
            disabled={solvedCount < problem.steps.length}
            title={
              solvedCount < problem.steps.length
                ? 'Attempt every step first'
                : 'Reveal the complete worked answer'
            }
          >
            {solvedCount < problem.steps.length
              ? `Reveal model answer (after all ${problem.steps.length} steps)`
              : 'Reveal model answer'}
          </button>
        )}
      </div>
    </div>
  )
}
