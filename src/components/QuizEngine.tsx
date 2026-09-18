import { useMemo, useState } from 'react'
import type { Question, SkillDimension } from '../types'
import { QUESTION_TYPE_LABEL, LEVEL_LABEL } from '../types'
import { useProgress } from '../lib/progress'
import { SourceBadge } from './Provenance'

interface Props {
  questions: Question[]
  title: string
  /** Called with the questions the student got wrong or was unsure about. */
  weak?: (q: Question[]) => void
}

type Rating = 'got' | 'unsure' | 'missed'

/**
 * QuizEngine — runs a mixed question set.
 * MCQs are auto-graded. Constructed-response questions are self-rated against the
 * model solution, which is the honest way to grade reasoning in a self-study tool.
 */
export function QuizEngine({ questions, title }: Props) {
  const { recordAttempt } = useProgress()
  const [i, setI] = useState(0)
  const [choice, setChoice] = useState<Record<string, string>>({})
  const [text, setText] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [rating, setRating] = useState<Record<string, Rating>>({})
  const [done, setDone] = useState(false)

  const q = questions[i]

  const score = useMemo(() => {
    let got = 0
    let max = 0
    for (const qq of questions) {
      max += qq.marks
      const r = rating[qq.id]
      if (qq.type === 'mcq') {
        if (choice[qq.id] === qq.answerId) got += qq.marks
        else if (r === 'got') got += Math.round(qq.marks * 0.5)
      } else if (r === 'got') got += qq.marks
      else if (r === 'unsure') got += Math.round(qq.marks * 0.5)
    }
    return { got, max, pct: max ? Math.round((got / max) * 100) : 0 }
  }, [questions, rating, choice])

  const bySkill = useMemo(() => {
    const map: Record<string, { got: number; max: number }> = {}
    for (const qq of questions) {
      map[qq.skill] ??= { got: 0, max: 0 }
      map[qq.skill].max += qq.marks
      const r = rating[qq.id]
      if (qq.type === 'mcq' && choice[qq.id] === qq.answerId) map[qq.skill].got += qq.marks
      else if (r === 'got') map[qq.skill].got += qq.marks
      else if (r === 'unsure') map[qq.skill].got += Math.round(qq.marks * 0.5)
    }
    return map
  }, [questions, rating, choice])

  if (!q) return <div className="empty">No questions match the current filter.</div>

  function reveal() {
    setRevealed((r) => ({ ...r, [q.id]: true }))
    const correct = q.type === 'mcq' ? choice[q.id] === q.answerId : undefined
    recordAttempt({
      questionId: q.id,
      topicId: q.topicId,
      skill: q.skill,
      correct: correct ?? false,
      marks: q.marks,
      awarded: correct ? q.marks : 0,
    })
  }

  function rate(r: Rating) {
    setRating((s) => ({ ...s, [q.id]: r }))
    recordAttempt({
      questionId: q.id,
      topicId: q.topicId,
      skill: q.skill,
      correct: r === 'got',
      marks: q.marks,
      awarded: r === 'got' ? q.marks : r === 'unsure' ? Math.round(q.marks * 0.5) : 0,
    })
  }

  function next() {
    if (i + 1 >= questions.length) setDone(true)
    else setI(i + 1)
  }

  if (done) {
    const weakSkills = Object.entries(bySkill)
      .filter(([, v]) => v.max > 0 && v.got / v.max < 0.7)
      .map(([k]) => k as SkillDimension)
    const recommended = questions.filter((qq) => weakSkills.includes(qq.skill)).slice(0, 6)

    return (
      <div>
        <div className="card">
          <h3>{title} — result</h3>
          <div className="readout-grid">
            <div className={`readout ${score.pct >= 70 ? 'ok' : score.pct >= 40 ? 'warn' : 'bad'}`}>
              <div className="rl">Score</div>
              <div className="rv">
                {score.got}
                <span className="ru">/ {score.max}</span>
              </div>
            </div>
            <div className="readout">
              <div className="rl">Accuracy</div>
              <div className="rv">{score.pct}%</div>
            </div>
            <div className="readout">
              <div className="rl">Questions</div>
              <div className="rv">{questions.length}</div>
            </div>
          </div>

          <div className="block-kind mb1 mt2">Accuracy by skill</div>
          {Object.entries(bySkill).map(([k, v]) => {
            const p = v.max ? Math.round((v.got / v.max) * 100) : 0
            return (
              <div className="meter-row" key={k}>
                <span className="ml">{k}</span>
                <span className={`meter ${p < 45 ? 'weak' : ''}`}>
                  <i style={{ width: `${p}%` }} />
                </span>
                <span className="mv">{p}%</span>
              </div>
            )
          })}

          {recommended.length > 0 && (
            <>
              <div className="block-kind mb1 mt2">Recommended practice</div>
              <ul className="bullets">
                {recommended.map((r) => (
                  <li key={r.id}>
                    <strong>{r.action}:</strong> {r.prompt.slice(0, 120)}
                    {r.prompt.length > 120 ? '…' : ''}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="callout warn mt2">
            <strong>How to use this.</strong> Re-attempt every question you rated “unsure” or
            “missed” without looking at the solution, then re-check. Accuracy improves by redoing the
            same reasoning, not by reading more questions.
          </div>

          <button
            className="btn primary mt1"
            onClick={() => {
              setI(0)
              setDone(false)
              setChoice({})
              setText({})
              setRevealed({})
              setRating({})
            }}
          >
            Run again
          </button>
        </div>
      </div>
    )
  }

  const isMcq = q.type === 'mcq'
  const answered = isMcq ? Boolean(choice[q.id]) : (text[q.id] ?? '').trim().length > 3
  const isRevealed = Boolean(revealed[q.id])
  const chosen = choice[q.id]

  return (
    <div>
      <div className="between mb1">
        <span className="small faint">
          Question {i + 1} of {questions.length}
        </span>
        <div className="row tight">
          <span className="badge">{QUESTION_TYPE_LABEL[q.type]}</span>
          <span className={`badge level${q.level}`}>L{q.level}</span>
          <span className="badge marks">{q.marks} mark{q.marks === 1 ? '' : 's'}</span>
          <SourceBadge
            p={q.provenance}
            label={q.provenance === 'source' ? 'Source' : 'Insight'}
          />
        </div>
      </div>

      <div className="qcard">
        <div className="qcard-head">
          <span className="badge">{q.action}</span>
          <span className="badge">{q.skill}</span>
        </div>
        <p className="prompt">{q.prompt}</p>

        {isMcq ? (
          <>
            {q.options?.map((o) => {
              const cls =
                !isRevealed
                  ? chosen === o.id
                    ? 'sel'
                    : ''
                  : o.id === q.answerId
                    ? 'right'
                    : chosen === o.id
                      ? 'wrong'
                      : ''
              return (
                <div
                  key={o.id}
                  className={`opt ${cls}`}
                  onClick={() => !isRevealed && setChoice((c) => ({ ...c, [q.id]: o.id }))}
                >
                  <span className="key">({o.id})</span>
                  <span>{o.text}</span>
                </div>
              )
            })}
          </>
        ) : (
          <textarea
            className="answer"
            placeholder="Write your answer here. State the principle, then the calculation, then the conclusion with units."
            value={text[q.id] ?? ''}
            onChange={(e) => setText((s) => ({ ...s, [q.id]: e.target.value }))}
          />
        )}

        <div className="row tight mt1">
          {!isRevealed && (
            <button className="btn sm primary" onClick={reveal} disabled={!answered}>
              {isMcq ? 'Submit answer' : 'Reveal model solution'}
            </button>
          )}
          <button
            className="btn sm ghost"
            onClick={() => setRevealed((r) => ({ ...r, [q.id]: true }))}
          >
            Show hint
          </button>
        </div>

        {isRevealed && !isMcq && (
          <div className="hintbox">Hint: {q.hint}</div>
        )}

        {isRevealed && (
          <div className="reveal">
            <div className="block-kind mb1">Full solution</div>
            <dl>
              {q.solution.map((s, k) => (
                <div key={k} style={{ marginBottom: '0.5rem' }}>
                  <dt>{s.label}</dt>
                  <dd>{s.content}</dd>
                </div>
              ))}
            </dl>
            {q.marking && (
              <>
                <div className="block-kind mb1 mt2">Marking scheme</div>
                <ul className="bullets">
                  {q.marking.map((m, k) => (
                    <li key={k}>{m}</li>
                  ))}
                </ul>
              </>
            )}
            <div className="callout mt1">
              <strong>Engineering explanation.</strong> {q.engineeringExplanation}
            </div>
            <div className="srcref">{LEVEL_LABEL[q.level]}</div>
          </div>
        )}

        {isRevealed && (
          <div className="row tight mt1">
            <span className="small faint">Self-rate:</span>
            <button className="btn sm" onClick={() => rate('got')}>
              Got it
            </button>
            <button className="btn sm" onClick={() => rate('unsure')}>
              Partly
            </button>
            <button className="btn sm" onClick={() => rate('missed')}>
              Missed it
            </button>
            {rating[q.id] && (
              <span className="badge" style={{ color: 'var(--green)' }}>
                recorded: {rating[q.id]}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="row tight">
        <button className="btn sm" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
          ◂ Previous
        </button>
        <button className="btn primary" onClick={next}>
          {i + 1 >= questions.length ? 'Finish' : 'Next ▸'}
        </button>
        <button className="btn sm ghost" onClick={() => setDone(true)}>
          End and see result
        </button>
      </div>
    </div>
  )
}
