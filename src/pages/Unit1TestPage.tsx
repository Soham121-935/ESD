import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Question, SkillDimension } from '../types'
import { LEVEL_LABEL } from '../types'
import { useProgress } from '../lib/progress'
import { accuracyTone, pct } from '../lib/utils'
import { SourceBadge } from '../components/Provenance'
import {
  FINAL_TEST_META,
  FINAL_TEST_QUESTIONS,
  FINAL_TEST_TOTAL_MARKS,
  UNIT1_FINAL_TEST,
} from '../data/unit1/finalTest'
import { UNIT1 } from '../data/unit1/unit1'

const SKILL_LABEL: Record<SkillDimension, string> = {
  concept: 'Conceptual',
  numerical: 'Numerical',
  analysis: 'Analysis',
  design: 'Design',
  debugging: 'Debugging',
  viva: 'Viva',
}

const TOPIC_SHORT: Record<string, string> = Object.fromEntries(
  UNIT1.topics.map((t) => [t.id, t.shortTitle]),
)

/* ------------------------------------------------------------------ */
/* Timer                                                               */
/* ------------------------------------------------------------------ */

function ExamTimer() {
  const total = FINAL_TEST_META.durationMinutes * 60
  const [remaining, setRemaining] = useState(total)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setRemaining((r) => (r <= 1 ? 0 : r - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [running])

  const h = Math.floor(remaining / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = remaining % 60
  const clock = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  const tone = remaining === 0 ? 'bad' : remaining < 900 ? 'warn' : ''

  return (
    <div className="row tight" style={{ alignItems: 'center' }}>
      <span className={`badge marks ${tone === 'warn' ? 'level4' : ''}`} style={{ fontFamily: 'var(--mono)' }}>
        {clock}
      </span>
      <button className="btn sm" onClick={() => setRunning((r) => !r)}>
        {running ? 'Pause' : remaining === total ? 'Start timer' : 'Resume'}
      </button>
      <button
        className="btn sm ghost"
        onClick={() => {
          setRunning(false)
          setRemaining(total)
        }}
      >
        Reset
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* One question                                                        */
/* ------------------------------------------------------------------ */

function TestQuestion({
  q,
  index,
  awarded,
  onAward,
}: {
  q: Question
  index: number
  awarded: number | undefined
  onAward: (fraction: number) => void
}) {
  const [text, setText] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showScheme, setShowScheme] = useState(false)
  const [showModel, setShowModel] = useState(false)

  return (
    <div className="qcard" id={`q-${q.id}`}>
      <div className="qcard-head">
        <span className="badge marks">
          {index + 1}. ({q.marks} marks)
        </span>
        <span className="badge">{TOPIC_SHORT[q.topicId] ?? q.topicId}</span>
        <span className={`badge level${q.level}`}>L{q.level}</span>
        <span className="badge">{q.action}</span>
        <SourceBadge
          p={q.provenance}
          label={q.provenance === 'source' ? 'Source-derived' : 'Engineering Practice'}
        />
        {awarded !== undefined && (
          <span className="badge" style={{ color: 'var(--accent)', borderColor: 'var(--accent-dim)' }}>
            awarded {awarded}/{q.marks}
          </span>
        )}
      </div>

      <p className="prompt">{q.prompt}</p>

      <textarea
        className="answer"
        placeholder="Write your answer here. For numericals: given values, equation, substitution with units, answer with units, then a check."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="row tight mt1">
        <button className="btn sm ghost" onClick={() => setShowHint((v) => !v)}>
          {showHint ? 'Hide hint' : 'Hint'}
        </button>
        <button className="btn sm" onClick={() => setShowScheme((v) => !v)}>
          {showScheme ? 'Hide marking scheme' : 'Marking scheme'}
        </button>
        <button className="btn sm primary" onClick={() => setShowModel((v) => !v)}>
          {showModel ? 'Hide model answer' : 'Model answer'}
        </button>
      </div>

      {showHint && <div className="hintbox">Hint: {q.hint}</div>}

      {showScheme && q.marking && (
        <div className="reveal">
          <div className="block-kind mb1">Marking scheme — {q.marks} marks</div>
          <ul className="bullets">
            {q.marking.map((m, k) => (
              <li key={k}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      {showModel && (
        <div className="reveal">
          <div className="block-kind mb1">Model answer</div>
          <dl>
            {q.solution.map((s, k) => (
              <div key={k} style={{ marginBottom: '0.5rem' }}>
                <dt>{s.label}</dt>
                <dd>{s.content}</dd>
              </div>
            ))}
          </dl>
          <div className="callout mt1">
            <strong>Engineering explanation.</strong> {q.engineeringExplanation}
          </div>
          <div className="srcref">{LEVEL_LABEL[q.level]}</div>
        </div>
      )}

      <div className="row tight mt1" style={{ alignItems: 'center' }}>
        <span className="small faint">Mark yourself:</span>
        <button className="btn sm" onClick={() => onAward(1)}>
          Full ({q.marks})
        </button>
        <button className="btn sm" onClick={() => onAward(0.5)}>
          Half ({Math.round(q.marks / 2)})
        </button>
        <button className="btn sm" onClick={() => onAward(0)}>
          Zero (0)
        </button>
        {awarded !== undefined && <span className="small faint">recorded — {awarded} marks</span>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export function Unit1TestPage() {
  const navigate = useNavigate()
  const { state, recordAttempt, recordActivity, clearAttempts } = useProgress()
  const [sectionId, setSectionId] = useState(UNIT1_FINAL_TEST[0].id)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    recordActivity('u1test', sectionId)
  }, [sectionId, recordActivity])

  const awardedById = useMemo(() => {
    const map: Record<string, number> = {}
    for (const a of state.attempts) {
      if (a.questionId.startsWith('u1ft-')) map[a.questionId] = a.awarded
    }
    return map
  }, [state.attempts])

  const section = UNIT1_FINAL_TEST.find((s) => s.id === sectionId) ?? UNIT1_FINAL_TEST[0]

  const totals = useMemo(() => {
    let got = 0
    let attempted = 0
    for (const q of FINAL_TEST_QUESTIONS) {
      const a = awardedById[q.id]
      if (a === undefined) continue
      got += a
      attempted += 1
    }
    return { got, max: FINAL_TEST_TOTAL_MARKS, attempted, pct: pct(got, FINAL_TEST_TOTAL_MARKS) }
  }, [awardedById])

  const bySection = useMemo(
    () =>
      UNIT1_FINAL_TEST.map((s) => {
        const max = s.questions.reduce((n, q) => n + q.marks, 0)
        const got = s.questions.reduce((n, q) => n + (awardedById[q.id] ?? 0), 0)
        const done = s.questions.filter((q) => awardedById[q.id] !== undefined).length
        return { section: s, max, got, done, pct: pct(got, max) }
      }),
    [awardedById],
  )

  const byTopic = useMemo(() => {
    const map: Record<string, { got: number; max: number }> = {}
    for (const q of FINAL_TEST_QUESTIONS) {
      map[q.topicId] ??= { got: 0, max: 0 }
      map[q.topicId].max += q.marks
      map[q.topicId].got += awardedById[q.id] ?? 0
    }
    return Object.entries(map)
      .map(([id, v]) => ({ id, label: TOPIC_SHORT[id] ?? id, ...v, pct: pct(v.got, v.max) }))
      .sort((a, b) => a.id.localeCompare(b.id))
  }, [awardedById])

  const bySkill = useMemo(() => {
    const map: Record<string, { got: number; max: number }> = {}
    for (const q of FINAL_TEST_QUESTIONS) {
      map[q.skill] ??= { got: 0, max: 0 }
      map[q.skill].max += q.marks
      map[q.skill].got += awardedById[q.id] ?? 0
    }
    return Object.entries(map).map(([k, v]) => ({
      skill: k as SkillDimension,
      label: SKILL_LABEL[k as SkillDimension] ?? k,
      ...v,
      pct: pct(v.got, v.max),
    }))
  }, [awardedById])

  const weakTopics = byTopic.filter((t) => totals.attempted > 0 && t.pct < 60)
  const weakSkills = bySkill.filter((s) => totals.attempted > 0 && s.pct < 60)

  function award(q: Question, fraction: number) {
    recordAttempt({
      questionId: q.id,
      topicId: q.topicId,
      skill: q.skill,
      correct: fraction >= 1,
      marks: q.marks,
      awarded: Math.round(q.marks * fraction),
    })
  }

  return (
    <div>
      <div className="section-title">
        <h2>{FINAL_TEST_META.title}</h2>
      </div>
      <p className="section-sub">{FINAL_TEST_META.subtitle}</p>

      <div className="between mb1" style={{ flexWrap: 'wrap', gap: '0.7rem' }}>
        <div className="row tight">
          <span className="badge">{FINAL_TEST_META.code}</span>
          <span className="badge marks">{FINAL_TEST_QUESTIONS.length} questions</span>
          <span className="badge marks">{FINAL_TEST_TOTAL_MARKS} marks</span>
          <span className="badge">{FINAL_TEST_META.durationMinutes} minutes</span>
          <span className="badge">Sections A–H</span>
        </div>
        <ExamTimer />
      </div>

      <div className="callout">
        <strong>How to sit this paper.</strong> {FINAL_TEST_META.note}
      </div>

      <div className="readout-grid">
        <div
          className={`readout ${
            totals.attempted === 0 ? '' : accuracyTone(totals.pct) === 'ok' ? 'ok' : accuracyTone(totals.pct) === 'warn' ? 'warn' : 'bad'
          }`}
        >
          <div className="rl">Marks scored</div>
          <div className="rv">
            {totals.got}
            <span className="ru">/ {totals.max}</span>
          </div>
        </div>
        <div className="readout">
          <div className="rl">Percentage</div>
          <div className="rv">{totals.attempted === 0 ? '—' : `${totals.pct}%`}</div>
        </div>
        <div className="readout">
          <div className="rl">Questions marked</div>
          <div className="rv">
            {totals.attempted}
            <span className="ru">/ {FINAL_TEST_QUESTIONS.length}</span>
          </div>
        </div>
      </div>

      <div className="tabs mt2">
        {bySection.map(({ section: s, done }) => (
          <button
            key={s.id}
            className={sectionId === s.id ? 'on' : ''}
            onClick={() => {
              setSectionId(s.id)
              setShowResult(false)
            }}
          >
            {s.letter} — {s.title}
            <span className="small faint">
              {' '}
              {done}/{s.questions.length}
            </span>
          </button>
        ))}
        <button className={showResult ? 'on' : ''} onClick={() => setShowResult(true)}>
          Result &amp; weak areas
        </button>
      </div>

      {showResult ? (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Result — Unit 1 final test</h3>

          <div className="readout-grid">
            <div className={`readout ${accuracyTone(totals.pct) === 'ok' ? 'ok' : accuracyTone(totals.pct) === 'warn' ? 'warn' : 'bad'}`}>
              <div className="rl">Score</div>
              <div className="rv">
                {totals.got}
                <span className="ru">/ {totals.max}</span>
              </div>
            </div>
            <div className="readout">
              <div className="rl">Accuracy</div>
              <div className="rv">{totals.pct}%</div>
            </div>
            <div className="readout">
              <div className="rl">Marked</div>
              <div className="rv">
                {totals.attempted}/{FINAL_TEST_QUESTIONS.length}
              </div>
            </div>
          </div>

          <div className="block-kind mb1 mt2">By section</div>
          {bySection.map(({ section: s, got, max, pct: p }) => (
            <div className="meter-row" key={s.id}>
              <span className="ml">
                {s.letter} — {s.title}
              </span>
              <span className={`meter ${p < 60 ? 'weak' : ''}`}>
                <i style={{ width: `${p}%` }} />
              </span>
              <span className="mv">{p}%</span>
              <span className="small faint" style={{ width: '5.5rem' }}>
                {got}/{max}
              </span>
            </div>
          ))}

          <div className="block-kind mb1 mt2">By topic</div>
          {byTopic.map((t) => (
            <div className="meter-row" key={t.id}>
              <span className="ml">{t.label}</span>
              <span className={`meter ${t.pct < 60 ? 'weak' : ''}`}>
                <i style={{ width: `${t.pct}%` }} />
              </span>
              <span className="mv">{t.pct}%</span>
              <button
                className="btn sm ghost"
                onClick={() => navigate(`/u1/${t.id}`)}
                title={`Open ${t.label}`}
              >
                revise
              </button>
            </div>
          ))}

          <div className="block-kind mb1 mt2">By skill</div>
          {bySkill.map((s) => (
            <div className="meter-row" key={s.skill}>
              <span className="ml">{s.label}</span>
              <span className={`meter ${s.pct < 60 ? 'weak' : ''}`}>
                <i style={{ width: `${s.pct}%` }} />
              </span>
              <span className="mv">{s.pct}%</span>
              <span className="small faint" style={{ width: '5.5rem' }}>
                {s.got}/{s.max}
              </span>
            </div>
          ))}

          {totals.attempted === 0 ? (
            <p className="small faint mt1">
              Nothing marked yet. Work through the sections, then come back here.
            </p>
          ) : (
            <>
              {(weakTopics.length > 0 || weakSkills.length > 0) && (
                <div className="callout warn mt2">
                  <strong>Weak areas.</strong>{' '}
                  {weakTopics.map((t) => `${t.label} ${t.pct}%`).join(', ')}
                  {weakTopics.length > 0 && weakSkills.length > 0 ? ' · ' : ''}
                  {weakSkills.map((s) => `${s.label} ${s.pct}%`).join(', ')}.
                  <ul className="bullets" style={{ marginTop: '0.35rem' }}>
                    {weakTopics.map((t) => (
                      <li key={t.id}>
                        Re-open <strong>{t.label}</strong> and work its Numericals and Design tabs
                        before re-attempting this paper.
                      </li>
                    ))}
                    {weakSkills.map((s) => (
                      <li key={s.skill}>
                        Filter the Unit 1 Question Bank by <strong>{s.label}</strong> and attempt ten
                        questions of that type.
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="callout mt2">
                <strong>How to use this.</strong> Re-attempt every question you scored below full
                marks, without looking at the model answer, then re-mark it. Marks improve by redoing
                the same reasoning, not by reading more questions.
              </div>
            </>
          )}

          <button
            className="btn primary mt1"
            onClick={() => clearAttempts(FINAL_TEST_QUESTIONS.map((q) => q.id))}
          >
            Clear this paper’s marks
          </button>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="block-head">
              <h3 style={{ margin: 0 }}>
                Section {section.letter} — {section.title}
              </h3>
              <span className="badge marks">
                {section.marksEach} marks each · {section.questions.length} questions
              </span>
            </div>
            <p className="small muted">{section.instruction}</p>
            <p className="small faint">{section.focus}</p>
          </div>

          {section.questions.map((q, i) => (
            <TestQuestion
              key={q.id}
              q={q}
              index={i}
              awarded={awardedById[q.id]}
              onAward={(fraction) => award(q, fraction)}
            />
          ))}

          <div className="row tight mt1">
            {(() => {
              const idx = UNIT1_FINAL_TEST.findIndex((s) => s.id === sectionId)
              const prev = UNIT1_FINAL_TEST[idx - 1]
              const next = UNIT1_FINAL_TEST[idx + 1]
              return (
                <>
                  <button
                    className="btn sm"
                    disabled={!prev}
                    onClick={() => prev && setSectionId(prev.id)}
                  >
                    ◂ Section {prev ? prev.letter : '—'}
                  </button>
                  {next ? (
                    <button className="btn primary" onClick={() => setSectionId(next.id)}>
                      Section {next.letter} ▸
                    </button>
                  ) : (
                    <button className="btn primary" onClick={() => setShowResult(true)}>
                      Finish and see result ▸
                    </button>
                  )}
                </>
              )
            })()}
          </div>
        </>
      )}
    </div>
  )
}
