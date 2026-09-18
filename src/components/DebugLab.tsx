import { useState } from 'react'
import type { DebugFault } from '../types'
import { useProgress } from '../lib/progress'
import { SourceBadge } from './Provenance'

const STAGES = ['OBSERVE', 'MEASURE', 'HYPOTHESIS', 'CHECK', 'IDENTIFY', 'FIX', 'EXPLAIN'] as const

/**
 * DebugCircuit — symptom → measurement → hypothesis → check → fault → fix → why.
 * The fault is never revealed before the student commits to a hypothesis.
 */
export function DebugLab({
  fault,
  topicId,
}: {
  fault: DebugFault
  topicId: string
}) {
  const { recordDebug, recordAttempt } = useProgress()
  const [stage, setStage] = useState(0)
  const [hyp, setHyp] = useState<string | null>(null)
  const [fix, setFix] = useState<string | null>(null)
  const [hintLevel, setHintLevel] = useState(0)
  const [measured, setMeasured] = useState(false)

  const hypWrong = hyp !== null && hyp !== fault.correctHypothesisId
  const fixWrong = fix !== null && fix !== fault.correctFixId
  const solved = hyp === fault.correctHypothesisId && fix === fault.correctFixId

  function commitHypothesis() {
    if (!hyp) return
    recordAttempt({
      questionId: `${fault.id}:hypothesis`,
      topicId,
      skill: 'debugging',
      correct: hyp === fault.correctHypothesisId,
      marks: 1,
      awarded: hyp === fault.correctHypothesisId ? 1 : 0,
    })
    if (hyp === fault.correctHypothesisId) {
      setStage(Math.max(stage, 4))
    } else {
      setHintLevel((h) => Math.min(h + 1, fault.hints.length))
    }
  }

  function commitFix() {
    if (!fix) return
    recordAttempt({
      questionId: `${fault.id}:fix`,
      topicId,
      skill: 'debugging',
      correct: fix === fault.correctFixId,
      marks: 1,
      awarded: fix === fault.correctFixId ? 1 : 0,
    })
    if (fix === fault.correctFixId) {
      setStage(6)
      recordDebug(fault.id)
    }
  }

  return (
    <div>
      <div className="block-head">
        <h3 style={{ margin: 0 }}>{fault.title}</h3>
        <SourceBadge p={fault.provenance} />
      </div>

      <div className="flowline mt1">
        {STAGES.map((s, i) => (
          <span key={s}>
            <span
              className="step"
              style={{
                color: i <= stage ? 'var(--accent)' : undefined,
                borderColor: i <= stage ? 'var(--accent-dim)' : undefined,
              }}
            >
              {s}
            </span>
            {i < STAGES.length - 1 && <span className="arrow"> → </span>}
          </span>
        ))}
      </div>

      {/* 1. OBSERVE */}
      <div className="block problem">
        <div className="block-kind">1 — Observe the symptom</div>
        <p>{fault.symptom}</p>
      </div>

      {/* 2. MEASURE */}
      <div className="block diagram">
        <div className="block-head">
          <div className="block-kind">2 — Measure</div>
          <button className="btn sm" onClick={() => { setMeasured(true); setStage(Math.max(stage, 2)) }}>
            {measured ? 'Measurements taken' : 'Take measurements'}
          </button>
        </div>
        {measured ? (
          <div className="given-grid">
            {fault.measurements.map((m, i) => (
              <div key={i}>
                <span className="k">{m.label}</span>
                <span className="v">{m.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="small faint">Nothing is measured until you ask for it. Decide what you want to see, then measure.</p>
        )}
      </div>

      {/* 3. HYPOTHESIS */}
      {measured && (
        <div className="block why">
          <div className="block-kind">3 — Form a hypothesis</div>
          {fault.hypotheses.map((h) => (
            <div
              key={h.id}
              className={`opt ${hyp === h.id ? (h.id === fault.correctHypothesisId ? 'sel right' : 'sel wrong') : ''}`}
              onClick={() => setHyp(h.id)}
            >
              <span className="key">{h.id.toUpperCase()}</span>
              <span>{h.text}</span>
            </div>
          ))}
          <div className="row tight mt1">
            <button className="btn sm primary" onClick={commitHypothesis} disabled={!hyp}>
              Check hypothesis
            </button>
            <button
              className="btn sm ghost"
              onClick={() => setHintLevel((h) => Math.min(h + 1, fault.hints.length))}
              disabled={hintLevel >= fault.hints.length}
            >
              Hint {Math.min(hintLevel + 1, fault.hints.length)}/{fault.hints.length}
            </button>
          </div>
          {fault.hints.slice(0, hintLevel).map((h, i) => (
            <div className="hintbox" key={i}>
              Hint {i + 1}: {h}
            </div>
          ))}
          {hypWrong && (
            <div className="errbox">
              That hypothesis does not explain the pattern. Ask which measurement changes between the
              working case and the failing case — the fault must correlate with that change.
            </div>
          )}
        </div>
      )}

      {/* 4-5. IDENTIFY + FIX */}
      {hyp === fault.correctHypothesisId && (
        <div className="block how">
          <div className="block-kind">4 — Identify the fault and fix it</div>
          <p className="small muted">
            Hypothesis confirmed. Now choose the fix that removes the cause — not the one that hides
            the symptom.
          </p>
          {fault.fixes.map((f) => (
            <div
              key={f.id}
              className={`opt ${fix === f.id ? (f.id === fault.correctFixId ? 'sel right' : 'sel wrong') : ''}`}
              onClick={() => setFix(f.id)}
            >
              <span className="key">{f.id.toUpperCase()}</span>
              <span>{f.text}</span>
            </div>
          ))}
          <div className="row tight mt1">
            <button className="btn sm primary" onClick={commitFix} disabled={!fix}>
              Apply fix
            </button>
          </div>
          {fixWrong && (
            <div className="errbox">
              That fix does not remove the cause. If the underlying condition is unchanged, the
              symptom will return.
            </div>
          )}
        </div>
      )}

      {/* 6. EXPLAIN */}
      {solved && (
        <div className="card" style={{ borderColor: 'var(--accent-dim)' }}>
          <div className="block-kind mb1">Why the fault occurred</div>
          <p className="small">{fault.rootCause}</p>
          <div className="block-kind mb1 mt2">How to prevent it</div>
          <p className="small">{fault.prevention}</p>
          <div className="callout ok mt1">
            <strong>Diagnosis recorded.</strong> The workflow that solved this was: observe → measure
            → correlate the changing measurement → hypothesise → test the hypothesis → fix the cause.
            Use the same order in the exam.
          </div>
        </div>
      )}
    </div>
  )
}
