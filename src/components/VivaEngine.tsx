import { useState } from 'react'
import type { Question } from '../types'
import { useProgress } from '../lib/progress'
import { SourceBadge } from './Provenance'

/**
 * VivaEngine — teacher/student dialogue.
 * The model answer stays hidden until the student has spoken; follow-ups are the
 * part that actually trains the student for oral examination.
 */
export function VivaEngine({ questions }: { questions: Question[] }) {
  const { recordViva, recordAttempt } = useProgress()
  const [i, setI] = useState(0)
  const [spoken, setSpoken] = useState<Record<string, string>>({})
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({})
  const [fuStep, setFuStep] = useState<Record<string, number>>({})

  const q = questions[i]
  if (!q) return <div className="empty">No viva questions available.</div>

  const followUps = q.followUps ?? []
  const fu = fuStep[q.id] ?? 0

  return (
    <div>
      <div className="between mb1">
        <span className="small faint">
          Viva {i + 1} of {questions.length}
        </span>
        <div className="row tight">
          <span className="badge">Viva</span>
          <span className="badge marks">{q.marks} mark{q.marks === 1 ? '' : 's'}</span>
          <SourceBadge p={q.provenance} label={q.provenance === 'source' ? 'Source' : 'Insight'} />
        </div>
      </div>

      <div className="block problem">
        <div className="block-kind">Teacher</div>
        <p style={{ fontSize: '1rem' }}>{q.prompt}</p>
      </div>

      <div className="step">
        <div className="step-head">
          <span className="step-n">You answer</span>
        </div>
        <textarea
          className="answer"
          placeholder="Answer out loud or type it. Say WHY, not just WHAT."
          value={spoken[q.id] ?? ''}
          onChange={(e) => setSpoken((s) => ({ ...s, [q.id]: e.target.value }))}
        />
        <div className="row tight mt1">
          <button
            className="btn sm primary"
            onClick={() => setShowAnswer((s) => ({ ...s, [q.id]: true }))}
            disabled={(spoken[q.id] ?? '').trim().length < 8}
          >
            Compare with the expected answer
          </button>
          <span className="small faint">
            {(spoken[q.id] ?? '').trim().length < 8
              ? 'Say something first — a viva is not a multiple-choice test.'
              : ''}
          </span>
        </div>
      </div>

      {showAnswer[q.id] && (
        <>
          <div className="card" style={{ borderColor: 'var(--accent-dim)' }}>
            <div className="block-kind mb1">Expected answer</div>
            {q.solution.map((s, k) => (
              <p className="small" key={k}>
                {s.content}
              </p>
            ))}
            <div className="callout mt1">
              <strong>Why the examiner asks this.</strong> {q.engineeringExplanation}
            </div>
            <div className="row tight mt1">
              <button
                className="btn sm"
                onClick={() => {
                  recordViva(q.id)
                  recordAttempt({
                    questionId: q.id,
                    topicId: q.topicId,
                    skill: 'viva',
                    correct: true,
                    marks: q.marks,
                    awarded: q.marks,
                  })
                }}
              >
                I could answer this
              </button>
              <button
                className="btn sm ghost"
                onClick={() =>
                  recordAttempt({
                    questionId: q.id,
                    topicId: q.topicId,
                    skill: 'viva',
                    correct: false,
                    marks: q.marks,
                    awarded: 0,
                  })
                }
              >
                I need more practice
              </button>
            </div>
          </div>

          {followUps.length > 0 && (
            <div className="card mt2">
              <div className="block-kind mb1">Follow-up chain</div>
              {followUps.slice(0, fu).map((f, k) => (
                <div key={k} style={{ marginBottom: '0.8rem' }}>
                  <div className="quote" style={{ margin: 0 }}>
                    <strong>Teacher:</strong> {f.teacher}
                  </div>
                  <div className="small muted mt1">
                    <strong>Expected:</strong> {f.expected}
                  </div>
                </div>
              ))}
              {fu < followUps.length && (
                <button className="btn sm" onClick={() => setFuStep((s) => ({ ...s, [q.id]: fu + 1 }))}>
                  Ask the next follow-up ({fu}/{followUps.length})
                </button>
              )}
              {fu >= followUps.length && (
                <div className="callout ok">
                  <strong>Viva pattern.</strong> The teacher keeps asking “why” until the chain ends
                  at a requirement, a number, or a consequence. Practise ending your own answers at
                  one of those three places.
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="row tight">
        <button className="btn sm" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
          ◂ Previous
        </button>
        <button
          className="btn primary"
          onClick={() => setI(Math.min(questions.length - 1, i + 1))}
          disabled={i + 1 >= questions.length}
        >
          Next viva ▸
        </button>
      </div>
    </div>
  )
}
