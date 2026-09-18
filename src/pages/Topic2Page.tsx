import { useEffect, useMemo, useState } from 'react'
import { useProgress } from '../lib/progress'
import { ModeSwitcher } from '../components/ModeSwitcher'
import { LearnFlow, FlowRibbon } from '../components/LearnFlow'
import { PerformanceMatrix } from '../components/PerformanceMatrix'
import { NumericalSolver } from '../components/NumericalSolver'
import { ReliabilityExplorer } from '../components/ReliabilityExplorer'
import { BathtubCurve } from '../components/BathtubCurve'
import { DesignChallenge } from '../components/DesignChallenge'
import { DebugLab } from '../components/DebugLab'
import { QuizEngine } from '../components/QuizEngine'
import { VivaEngine } from '../components/VivaEngine'
import { QuestionBank } from '../components/QuestionBank'
import { ProgressTracker } from '../components/ProgressTracker'
import { WhyButton } from '../components/WhyButton'
import { ProvenanceLegend, Callout } from '../components/Provenance'
import {
  BATHTUB_REGIONS,
  DEBUG_CASES2,
  EQUIPMENT_RELIABILITY_FACTORS,
  FAILURE_FACTORS,
  FAILURE_TYPE_MATRIX,
  RELIABILITY_DESIGN,
  RELIABILITY_PROBLEMS,
  SOURCE_NOTE2,
  TOPIC2,
  TOPIC2_MODES,
  TOPIC2_QUESTIONS,
  TOPIC2_SECTIONS,
} from '../data/unit1/topic2'
import { UNIT1 } from '../data/unit1/unit1'
import type { StudyMode } from '../types'

type TabId = (typeof TOPIC2_SECTIONS)[number]['id'] | 'bank' | 'progress'

const TABS: { id: TabId; label: string }[] = [
  { id: 'theory', label: 'Theory' },
  { id: 'numericals', label: 'Numericals' },
  { id: 'analysis', label: 'Bathtub Analysis' },
  { id: 'design', label: 'Design' },
  { id: 'debugging', label: 'Debugging' },
  { id: 'viva', label: 'Viva' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'exam', label: 'Exam' },
  { id: 'bank', label: 'Question Bank' },
  { id: 'progress', label: 'Progress' },
]

export function Topic2Page() {
  const { state, setMode, recordActivity, visited } = useProgress()
  const mode: StudyMode = state.mode
  const [tab, setTab] = useState<TabId>('theory')
  const [problemIndex, setProblemIndex] = useState(0)
  const [debugIndex, setDebugIndex] = useState(0)

  useEffect(() => {
    if (tab !== 'bank' && tab !== 'progress') recordActivity(TOPIC2.id, tab)
  }, [tab, recordActivity])

  const questions = TOPIC2_QUESTIONS
  const mcqs = useMemo(() => questions.filter((q) => q.type === 'mcq'), [questions])
  const written = useMemo(
    () => questions.filter((q) => q.type !== 'mcq' && q.type !== 'viva'),
    [questions],
  )
  const vivaQs = useMemo(() => questions.filter((q) => q.type === 'viva'), [questions])

  const content = TOPIC2_MODES[mode]

  return (
    <div>
      <div className="section-title">
        <h2>Topic 2 — {TOPIC2.title}</h2>
      </div>
      <p className="section-sub">{TOPIC2.hook}</p>

      <div className="between mb1" style={{ flexWrap: 'wrap', gap: '0.7rem' }}>
        <ModeSwitcher mode={mode} onChange={setMode} />
        <div className="row tight">
          <span className="badge source">Topic status: live</span>
          <span className="badge">{questions.length} questions in bank</span>
        </div>
      </div>

      <Callout>
        <strong>Source for this topic.</strong> {SOURCE_NOTE2.primary} {SOURCE_NOTE2.coverage}
      </Callout>

      <FlowRibbon />

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            {t.label}
            {t.id !== 'bank' && t.id !== 'progress' && visited(`${TOPIC2.id}.${t.id}`) && (
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
                {mode === 'intermediate' ? (
                  <BathtubCurve regions={BATHTUB_REGIONS} />
                ) : (
                  <ReliabilityExplorer />
                )}
              </div>
            }
          />
          <div className="mt2">
            <PerformanceMatrix spec={FAILURE_TYPE_MATRIX} />
          </div>
        </>
      )}

      {tab === 'numericals' && (
        <>
          <div className="row tight mb1">
            {RELIABILITY_PROBLEMS.map((p, i) => (
              <button
                key={p.id}
                className={`btn sm ${problemIndex === i ? 'primary' : ''}`}
                onClick={() => setProblemIndex(i)}
              >
                {p.title.replace('Problem ', '').replace(/^(\d+)/, 'P$1')}
              </button>
            ))}
          </div>
          <NumericalSolver
            problem={RELIABILITY_PROBLEMS[problemIndex]}
            topicId={TOPIC2.id}
          />
          <hr />
          <ReliabilityExplorer />
        </>
      )}

      {tab === 'analysis' && (
        <>
          <BathtubCurve regions={BATHTUB_REGIONS} />

          <div className="mt2">
            <h3>Failure or defect — types and phases</h3>
            <p className="section-sub">
              Reproduced from the supplied material. Mapping these types onto the bathtub regions is
              a standard exam move.
            </p>
            <PerformanceMatrix spec={FAILURE_TYPE_MATRIX} />
          </div>

          <div className="row mt2" style={{ gap: '0.9rem', alignItems: 'stretch', flexWrap: 'wrap' }}>
            <div className="card" style={{ flex: '1 1 320px' }}>
              <div className="block-kind mb1">Reliability of equipment (source)</div>
              <ul className="bullets">
                {EQUIPMENT_RELIABILITY_FACTORS.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
            <div className="card" style={{ flex: '1 1 320px' }}>
              <div className="block-kind mb1">Factors responsible for failure (source)</div>
              <ul className="bullets">
                {FAILURE_FACTORS.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt2">
            <WhyButton
              label="Which action belongs to which region? (requirement → region → action → if you get it wrong)"
              entries={[
                {
                  requirement: 'Failures clustered in the first weeks',
                  parameter: 'Infant mortality',
                  value: 'Burn-in screening + incoming lot acceptance',
                  whatIf:
                    'Screening does not change the useful-life λ. If your failures are random, burn-in spends money and fixes nothing.',
                },
                {
                  requirement: 'Steady random failures through the middle of life',
                  parameter: 'Useful life (constant λ)',
                  value: 'Derating, protection, operating-condition discipline',
                  whatIf:
                    'Scheduling preventive replacement here wastes the remaining life of good units — replace only in wear-out.',
                },
                {
                  requirement: 'Failure rate rising after years at full load',
                  parameter: 'Wear-out',
                  value: 'Reduce stress severity; condition-based replacement before the knee',
                  whatIf:
                    'Continuing with a constant-λ forecast under-predicts failures, and the error grows every quarter.',
                },
                {
                  requirement: 'Product simply has too many parts',
                  parameter: 'All regions at once',
                  value: 'Attack complexity — fewer parts, fewer connectors',
                  whatIf:
                    'The source lists “Complexity of equipment” as a factor responsible for failure. Every part you remove removes a failure mechanism.',
                },
              ]}
            />
          </div>
        </>
      )}

      {tab === 'design' && <DesignChallenge spec={RELIABILITY_DESIGN} topicId={TOPIC2.id} />}

      {tab === 'debugging' && (
        <>
          <div className="row tight mb1">
            {DEBUG_CASES2.map((d, i) => (
              <button
                key={d.id}
                className={`btn sm ${debugIndex === i ? 'primary' : ''}`}
                onClick={() => setDebugIndex(i)}
              >
                {d.title}
              </button>
            ))}
          </div>
          <DebugLab fault={DEBUG_CASES2[debugIndex]} topicId={TOPIC2.id} />
        </>
      )}

      {tab === 'viva' && <VivaEngine questions={vivaQs} />}

      {tab === 'quiz' && (
        <>
          <p className="section-sub">
            Quiz: {mcqs.length} MCQs followed by {written.length} written questions. Written answers
            are self-rated against the model solution — that is the honest way to grade reasoning.
          </p>
          <QuizEngine questions={[...mcqs, ...written]} title="Topic 2 Quiz" />
        </>
      )}

      {tab === 'exam' && (
        <>
          <Callout tone="warn" title="Exam Mode — assignment-style answers">
            The Unit 1 assignment asks this topic as: “What is reliability? Explain exponential law
            of reliability? Which factor affects reliability of the equipment?” and “Discuss the
            causes of failures during the Infant Mortality, Useful Life, and Wear-out periods of the
            Bathtub Curve.” The Theory tab in Exam Mode writes both answers in 8-mark form with a
            marking scheme.
          </Callout>
          <div className="mt2">
            <QuizEngine questions={written.filter((q) => q.marks >= 4)} title="Topic 2 — Exam practice" />
          </div>
        </>
      )}

      {tab === 'bank' && (
        <>
          <Callout title="Unit 1 Question Bank">
            This bank currently holds the Topic 2 set ({questions.length} questions). Topic 1’s
            questions are on the Topic 1 Question Bank tab; the combined Unit 1 bank is available
            from the sidebar.
          </Callout>
          <QuestionBank questions={questions} />
        </>
      )}

      {tab === 'progress' && <ProgressTracker unit={UNIT1} topicId={TOPIC2.id} />}
    </div>
  )
}
