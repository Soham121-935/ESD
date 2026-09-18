import { useEffect, useMemo, useState } from 'react'
import { useProgress } from '../lib/progress'
import { ModeSwitcher } from '../components/ModeSwitcher'
import { LearnFlow, FlowRibbon } from '../components/LearnFlow'
import { NumericalSolver } from '../components/NumericalSolver'
import { LogicInterfaceLab } from '../components/LogicInterfaceLab'
import { DesignChallenge } from '../components/DesignChallenge'
import { DebugLab } from '../components/DebugLab'
import { QuizEngine } from '../components/QuizEngine'
import { VivaEngine } from '../components/VivaEngine'
import { QuestionBank } from '../components/QuestionBank'
import { ProgressTracker } from '../components/ProgressTracker'
import { ProvenanceLegend, Callout } from '../components/Provenance'
import {
  DEBUG_CASES4,
  INPUT_NOTES,
  LOGIC_DESIGN,
  LOGIC_PROBLEMS,
  OUTPUT_NOTES,
  SOURCE_NOTE4,
  TOPIC4,
  TOPIC4_MODES,
  TOPIC4_QUESTIONS,
  TOPIC4_SECTIONS,
  TTL_FAMILY_NOTES,
  UNUSED_INPUT_RULES,
} from '../data/unit1/topic4'
import { UNIT1 } from '../data/unit1/unit1'
import type { StudyMode } from '../types'

type TabId = (typeof TOPIC4_SECTIONS)[number]['id'] | 'bank' | 'progress'

const TABS: { id: TabId; label: string }[] = [
  { id: 'theory', label: 'Theory' },
  { id: 'numericals', label: 'Numericals' },
  { id: 'analysis', label: 'Interface Analysis' },
  { id: 'design', label: 'Design' },
  { id: 'debugging', label: 'Debugging' },
  { id: 'viva', label: 'Viva' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'exam', label: 'Exam' },
  { id: 'bank', label: 'Question Bank' },
  { id: 'progress', label: 'Progress' },
]

export function Topic4Page() {
  const { state, setMode, recordActivity, visited } = useProgress()
  const mode: StudyMode = state.mode
  const [tab, setTab] = useState<TabId>('theory')
  const [problemIndex, setProblemIndex] = useState(0)
  const [debugIndex, setDebugIndex] = useState(0)

  useEffect(() => {
    if (tab !== 'bank' && tab !== 'progress') recordActivity(TOPIC4.id, tab)
  }, [tab, recordActivity])

  const questions = TOPIC4_QUESTIONS
  const mcqs = useMemo(() => questions.filter((q) => q.type === 'mcq'), [questions])
  const written = useMemo(() => questions.filter((q) => q.type !== 'mcq' && q.type !== 'viva'), [questions])
  const vivaQs = useMemo(() => questions.filter((q) => q.type === 'viva'), [questions])
  const content = TOPIC4_MODES[mode]

  return (
    <div>
      <div className="section-title">
        <h2>Topic 4 — {TOPIC4.title}</h2>
      </div>
      <p className="section-sub">{TOPIC4.hook}</p>

      <div className="between mb1" style={{ flexWrap: 'wrap', gap: '0.7rem' }}>
        <ModeSwitcher mode={mode} onChange={setMode} />
        <div className="row tight">
          <span className="badge source">Topic status: live</span>
          <span className="badge">{questions.length} questions in bank</span>
        </div>
      </div>

      <Callout>
        <strong>Source for this topic.</strong> {SOURCE_NOTE4.primary} {SOURCE_NOTE4.coverage}
      </Callout>

      <FlowRibbon />

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            {t.label}
            {t.id !== 'bank' && t.id !== 'progress' && visited(`${TOPIC4.id}.${t.id}`) && (
              <span className="tick">✓</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'theory' && (
        <>
          <ProvenanceLegend />
          <LearnFlow
            content={content}
            diagram={
              <div className="mt1">
                <LogicInterfaceLab />
              </div>
            }
          />
        </>
      )}

      {tab === 'numericals' && (
        <>
          <div className="row tight mb1">
            {LOGIC_PROBLEMS.map((p, i) => (
              <button
                key={p.id}
                className={`btn sm ${problemIndex === i ? 'primary' : ''}`}
                onClick={() => setProblemIndex(i)}
              >
                {p.title.replace(/^Problem (\d+) — .*/, 'P$1')}
              </button>
            ))}
          </div>
          <NumericalSolver problem={LOGIC_PROBLEMS[problemIndex]} topicId={TOPIC4.id} />
          <hr />
          <LogicInterfaceLab />
        </>
      )}

      {tab === 'analysis' && (
        <>
          <LogicInterfaceLab />

          <div className="row mt2" style={{ gap: '0.9rem', alignItems: 'stretch', flexWrap: 'wrap' }}>
            <div className="card" style={{ flex: '1 1 300px' }}>
              <div className="block-kind mb1">TTL input characteristics (source)</div>
              <ul className="bullets">
                {INPUT_NOTES.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
            <div className="card" style={{ flex: '1 1 300px' }}>
              <div className="block-kind mb1">TTL output characteristics (source)</div>
              <ul className="bullets">
                {OUTPUT_NOTES.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card mt2">
            <div className="block-kind mb1">Unused inputs — rules (source)</div>
            <ul className="bullets">
              {UNUSED_INPUT_RULES.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>

          <div className="card mt2">
            <div className="block-kind mb1">TTL family evolution (source)</div>
            <ul className="bullets">
              {TTL_FAMILY_NOTES.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      {tab === 'design' && <DesignChallenge spec={LOGIC_DESIGN} topicId={TOPIC4.id} />}

      {tab === 'debugging' && (
        <>
          <div className="row tight mb1">
            {DEBUG_CASES4.map((d, i) => (
              <button
                key={d.id}
                className={`btn sm ${debugIndex === i ? 'primary' : ''}`}
                onClick={() => setDebugIndex(i)}
              >
                {d.title}
              </button>
            ))}
          </div>
          <DebugLab fault={DEBUG_CASES4[debugIndex]} topicId={TOPIC4.id} />
        </>
      )}

      {tab === 'viva' && <VivaEngine questions={vivaQs} />}

      {tab === 'quiz' && (
        <>
          <p className="section-sub">
            Quiz: {mcqs.length} MCQs followed by {written.length} written questions.
          </p>
          <QuizEngine questions={[...mcqs, ...written]} title="Topic 4 Quiz" />
        </>
      )}

      {tab === 'exam' && (
        <>
          <Callout tone="warn" title="Exam Mode — the assignment question">
            Unit 1 Q.5 asks: “Explain the need for TTL-CMOS interfacing. Discuss TTL-to-CMOS and
            CMOS-to-TTL interfacing techniques with suitable circuits.” The Theory tab in Exam Mode
            writes the complete 8-mark answer with both directions and the marking scheme.
          </Callout>
          <div className="mt2">
            <QuizEngine questions={written.filter((q) => q.marks >= 4)} title="Topic 4 — Exam practice" />
          </div>
        </>
      )}

      {tab === 'bank' && (
        <>
          <Callout title="Unit 1 Question Bank">
            This bank currently holds the Topic 4 set ({questions.length} questions). The combined
            Unit 1 bank is available from the sidebar.
          </Callout>
          <QuestionBank questions={questions} />
        </>
      )}

      {tab === 'progress' && <ProgressTracker unit={UNIT1} topicId={TOPIC4.id} />}
    </div>
  )
}
