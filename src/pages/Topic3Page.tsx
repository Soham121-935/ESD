import { useEffect, useMemo, useState } from 'react'
import { useProgress } from '../lib/progress'
import { ModeSwitcher } from '../components/ModeSwitcher'
import { LearnFlow, FlowRibbon } from '../components/LearnFlow'
import { PerformanceMatrix } from '../components/PerformanceMatrix'
import { NumericalSolver } from '../components/NumericalSolver'
import { OpAmpInvertingLab } from '../components/OpAmpInvertingLab'
import { DesignChallenge } from '../components/DesignChallenge'
import { DebugLab } from '../components/DebugLab'
import { QuizEngine } from '../components/QuizEngine'
import { VivaEngine } from '../components/VivaEngine'
import { QuestionBank } from '../components/QuestionBank'
import { ProgressTracker } from '../components/ProgressTracker'
import { WhyButton } from '../components/WhyButton'
import { ProvenanceLegend, Callout } from '../components/Provenance'
import {
  BIAS_DRIFT_RULE,
  DEBUG_CASES3,
  LOW_IB_NOTES,
  OPAMP_DESIGN,
  OPAMP_PROBLEMS,
  OPAMP_SPEC_MATRIX,
  SOURCE_NOTE3,
  TOPIC3,
  TOPIC3_MODES,
  TOPIC3_QUESTIONS,
  TOPIC3_SECTIONS,
} from '../data/unit1/topic3'
import { UNIT1 } from '../data/unit1/unit1'
import type { StudyMode } from '../types'

type TabId = (typeof TOPIC3_SECTIONS)[number]['id'] | 'bank' | 'progress'

const TABS: { id: TabId; label: string }[] = [
  { id: 'theory', label: 'Theory' },
  { id: 'numericals', label: 'Numericals' },
  { id: 'analysis', label: 'Circuit Analysis' },
  { id: 'design', label: 'Design' },
  { id: 'debugging', label: 'Debugging' },
  { id: 'viva', label: 'Viva' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'exam', label: 'Exam' },
  { id: 'bank', label: 'Question Bank' },
  { id: 'progress', label: 'Progress' },
]

export function Topic3Page() {
  const { state, setMode, recordActivity, visited } = useProgress()
  const mode: StudyMode = state.mode
  const [tab, setTab] = useState<TabId>('theory')
  const [problemIndex, setProblemIndex] = useState(0)
  const [debugIndex, setDebugIndex] = useState(0)

  useEffect(() => {
    if (tab !== 'bank' && tab !== 'progress') recordActivity(TOPIC3.id, tab)
  }, [tab, recordActivity])

  const questions = TOPIC3_QUESTIONS
  const mcqs = useMemo(() => questions.filter((q) => q.type === 'mcq'), [questions])
  const written = useMemo(() => questions.filter((q) => q.type !== 'mcq' && q.type !== 'viva'), [questions])
  const vivaQs = useMemo(() => questions.filter((q) => q.type === 'viva'), [questions])

  const content = TOPIC3_MODES[mode]

  return (
    <div>
      <div className="section-title">
        <h2>Topic 3 — {TOPIC3.title}</h2>
      </div>
      <p className="section-sub">{TOPIC3.hook}</p>

      <div className="between mb1" style={{ flexWrap: 'wrap', gap: '0.7rem' }}>
        <ModeSwitcher mode={mode} onChange={setMode} />
        <div className="row tight">
          <span className="badge source">Topic status: live</span>
          <span className="badge">{questions.length} questions in bank</span>
        </div>
      </div>

      <Callout>
        <strong>Source for this topic.</strong> {SOURCE_NOTE3.primary} {SOURCE_NOTE3.coverage}
      </Callout>

      <FlowRibbon />

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            {t.label}
            {t.id !== 'bank' && t.id !== 'progress' && visited(`${TOPIC3.id}.${t.id}`) && (
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
                <OpAmpInvertingLab />
              </div>
            }
          />
          <div className="mt2">
            <PerformanceMatrix spec={OPAMP_SPEC_MATRIX} />
          </div>
        </>
      )}

      {tab === 'numericals' && (
        <>
          <div className="row tight mb1">
            {OPAMP_PROBLEMS.map((p, i) => (
              <button
                key={p.id}
                className={`btn sm ${problemIndex === i ? 'primary' : ''}`}
                onClick={() => setProblemIndex(i)}
              >
                {p.title.replace(/^Problem (\d+) — .*/, 'P$1')}
              </button>
            ))}
          </div>
          <NumericalSolver problem={OPAMP_PROBLEMS[problemIndex]} topicId={TOPIC3.id} />
          <hr />
          <OpAmpInvertingLab />
        </>
      )}

      {tab === 'analysis' && (
        <>
          <OpAmpInvertingLab />

          <div className="mt2">
            <PerformanceMatrix spec={OPAMP_SPEC_MATRIX} />
          </div>

          <div className="card mt2">
            <div className="block-kind mb1">Low input-bias-current options (source)</div>
            <ul className="bullets">
              {LOW_IB_NOTES.map((n, i) => (
                <li key={i}>
                  <strong>{n.device}:</strong> {n.note}
                </li>
              ))}
            </ul>
            <div className="srcref">{BIAS_DRIFT_RULE}</div>
          </div>

          <div className="mt2">
            <WhyButton
              label="Which error term dominates, and what is the cheapest fix? (situation → term → fix → if you skip it)"
              entries={[
                {
                  requirement: 'High gain, output offset with input grounded',
                  parameter: 'VOS × noise gain',
                  value: 'Lower-VOS device, or reduce the noise gain',
                  whatIf:
                    'At a gain of 1000 a 741 gives about 2 V of error. Trimming removes it at one temperature only — drift brings it back.',
                },
                {
                  requirement: 'Output offset that scales with resistor values',
                  parameter: 'IB through R1||Rf (Rp omitted)',
                  value: 'Fit Rp = R1||Rf',
                  whatIf:
                    'Leaving Rp out leaves the IB term unopposed; in the source example the error is 175 mV instead of 44 mV.',
                },
                {
                  requirement: 'Offset that remains after Rp is fitted',
                  parameter: 'IOS × Rf',
                  value: 'Reduce Rf, or choose a lower-IOS device',
                  whatIf:
                    'IOS cannot be cancelled by resistor matching. Reducing all resistances by 10 reduces this term by 10.',
                },
                {
                  requirement: 'Output error that grows with temperature',
                  parameter: 'TC(VOS) × ΔT × noise gain',
                  value: 'Low-drift device, or periodic auto-zero',
                  whatIf:
                    'Drift cannot be trimmed out with a one-time adjustment, because it moves.',
                },
                {
                  requirement: 'Signal sitting on a common-mode voltage',
                  parameter: 'Vcm / CMRR',
                  value: 'Use the inverting topology, or buy higher CMRR',
                  whatIf:
                    'The source notes CMRR is no serious concern for the inverting amplifier because Vp is at 0 V — topology removes the term for free.',
                },
              ]}
            />
          </div>
        </>
      )}

      {tab === 'design' && <DesignChallenge spec={OPAMP_DESIGN} topicId={TOPIC3.id} />}

      {tab === 'debugging' && (
        <>
          <div className="row tight mb1">
            {DEBUG_CASES3.map((d, i) => (
              <button
                key={d.id}
                className={`btn sm ${debugIndex === i ? 'primary' : ''}`}
                onClick={() => setDebugIndex(i)}
              >
                {d.title}
              </button>
            ))}
          </div>
          <DebugLab fault={DEBUG_CASES3[debugIndex]} topicId={TOPIC3.id} />
        </>
      )}

      {tab === 'viva' && <VivaEngine questions={vivaQs} />}

      {tab === 'quiz' && (
        <>
          <p className="section-sub">
            Quiz: {mcqs.length} MCQs followed by {written.length} written questions. Written answers
            are self-rated against the model solution.
          </p>
          <QuizEngine questions={[...mcqs, ...written]} title="Topic 3 Quiz" />
        </>
      )}

      {tab === 'exam' && (
        <>
          <Callout tone="warn" title="Exam Mode — the assignment question">
            Unit 1 Q.4 asks: “An inverting amplifier with R1 = 10 kΩ and Rf = 20 kΩ and Vi = 3 V
            drives a 2 kΩ load. (a) Assume IQ = 0.5 mA, find icc, iee and io. (b) Find the power
            dissipated inside the Op-Amp.” The Theory tab in Exam Mode writes the full answer with
            the assumption declared and the marking scheme.
          </Callout>
          <div className="mt2">
            <QuizEngine questions={written.filter((q) => q.marks >= 4)} title="Topic 3 — Exam practice" />
          </div>
        </>
      )}

      {tab === 'bank' && (
        <>
          <Callout title="Unit 1 Question Bank">
            This bank currently holds the Topic 3 set ({questions.length} questions). The combined
            Unit 1 bank is available from the sidebar.
          </Callout>
          <QuestionBank questions={questions} />
        </>
      )}

      {tab === 'progress' && <ProgressTracker unit={UNIT1} topicId={TOPIC3.id} />}
    </div>
  )
}
