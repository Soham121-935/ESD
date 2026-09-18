import { useEffect, useMemo, useState } from 'react'
import { useProgress } from '../lib/progress'
import { ModeSwitcher } from '../components/ModeSwitcher'
import { LearnFlow, FlowRibbon } from '../components/LearnFlow'
import { InteractiveCircuit } from '../components/InteractiveCircuit'
import { PerformanceMatrix } from '../components/PerformanceMatrix'
import { NumericalSolver } from '../components/NumericalSolver'
import { TemperatureWindowSim } from '../components/TemperatureWindowSim'
import { DesignChallenge } from '../components/DesignChallenge'
import { DebugLab } from '../components/DebugLab'
import { QuizEngine } from '../components/QuizEngine'
import { VivaEngine } from '../components/VivaEngine'
import { QuestionBank } from '../components/QuestionBank'
import { ProgressTracker } from '../components/ProgressTracker'
import { StepBuilder } from '../components/StepBuilder'
import { WhyButton } from '../components/WhyButton'
import { ProvenanceLegend, Callout, SourceBadge } from '../components/Provenance'
import {
  CLASSIFICATION_MATRIX,
  DEBUG_CASES,
  SOURCE_NOTE,
  SYSTEM_EDGES,
  SYSTEM_STAGES,
  TEMP_RANGE_PROBLEM,
  TICKET_DESIGN,
  TOPIC1,
  TOPIC1_MODES,
  TOPIC1_QUESTIONS,
  TOPIC1_SECTIONS,
} from '../data/unit1/topic1'
import { UNIT1 } from '../data/unit1/unit1'
import type { StudyMode } from '../types'

type TabId = (typeof TOPIC1_SECTIONS)[number]['id'] | 'bank' | 'progress'

const TABS: { id: TabId; label: string }[] = [
  { id: 'theory', label: 'Theory' },
  { id: 'numericals', label: 'Numericals' },
  { id: 'analysis', label: 'System Analysis' },
  { id: 'design', label: 'Design' },
  { id: 'debugging', label: 'Debugging' },
  { id: 'viva', label: 'Viva' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'exam', label: 'Exam' },
  { id: 'bank', label: 'Question Bank' },
  { id: 'progress', label: 'Progress' },
]

export function Topic1Page() {
  const { state, setMode, recordActivity, visited } = useProgress()
  const mode: StudyMode = state.mode
  const [tab, setTab] = useState<TabId>('theory')
  const [debugIndex, setDebugIndex] = useState(0)

  useEffect(() => {
    if (tab !== 'bank' && tab !== 'progress') recordActivity(TOPIC1.id, tab)
  }, [tab, recordActivity])

  const questions = TOPIC1_QUESTIONS
  const mcqs = useMemo(() => questions.filter((q) => q.type === 'mcq'), [questions])
  const written = useMemo(
    () => questions.filter((q) => q.type !== 'mcq' && q.type !== 'exam' && q.type !== 'viva'),
    [questions],
  )
  const vivaQs = useMemo(() => questions.filter((q) => q.type === 'viva'), [questions])
  const examQs = useMemo(() => questions.filter((q) => q.type === 'exam'), [questions])

  const content = TOPIC1_MODES[mode]

  return (
    <div>
      <div className="section-title">
        <h2>
          Topic 1 — {TOPIC1.title}
        </h2>
      </div>
      <p className="section-sub">{TOPIC1.hook}</p>

      <div className="between mb1" style={{ flexWrap: 'wrap', gap: '0.7rem' }}>
        <ModeSwitcher mode={mode} onChange={setMode} />
        <div className="row tight">
          <span className="badge source">Topic status: live</span>
          <span className="badge">{questions.length} questions in bank</span>
        </div>
      </div>

      <Callout>
        <strong>Source for this topic.</strong> {SOURCE_NOTE.primary} {SOURCE_NOTE.coverage}
      </Callout>

      <FlowRibbon />

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? 'on' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.id !== 'bank' && t.id !== 'progress' && visited(`${TOPIC1.id}.${t.id}`) && (
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
                <InteractiveCircuit
                  nodes={SYSTEM_STAGES}
                  edges={SYSTEM_EDGES}
                  caption="Generic electronic system — interactive reconstruction"
                />
                <p className="small faint mt1">
                  Interactive reconstruction (Engineering Insight). The supplied material gives the
                  classification table and the definition of ergonomics; the block decomposition is
                  standard engineering practice.
                </p>
              </div>
            }
          />
          <div className="mt2">
            <PerformanceMatrix spec={CLASSIFICATION_MATRIX} />
          </div>
        </>
      )}

      {tab === 'numericals' && (
        <>
          <NumericalSolver problem={TEMP_RANGE_PROBLEM} />
          <hr />
          <TemperatureWindowSim />
        </>
      )}

      {tab === 'analysis' && (
        <>
          <h3>System analysis — where each parameter is created</h3>
          <p className="section-sub">
            A system-analysis question does not ask you to define; it asks you to locate. For each
            block, name the parameter it decides and the consequence if that block is under-designed.
          </p>
          <InteractiveCircuit
            nodes={SYSTEM_STAGES}
            edges={SYSTEM_EDGES}
            caption="Block diagram with parameter ownership"
          />

          <div className="mt2">
            <h3>Build the system one stage at a time</h3>
            <p className="section-sub">
              Reveal each stage, and before revealing the next one say what the stage must do for
              this product class.
            </p>
            <StepBuilder
              stages={[
                {
                  id: 's1',
                  title: 'Input / sensor',
                  body: 'Converts the physical quantity into an electrical signal.',
                  detail:
                    'Owns the operating-temperature parameter. If the sensor cannot survive the ambient, no amount of good design downstream helps. Specify the range here first.',
                },
                {
                  id: 's2',
                  title: 'Signal conditioning',
                  body: 'Amplifies, filters, level-shifts and protects.',
                  detail:
                    'Owns reliability and cost. Component grade, derating and protection here decide the field failure rate — and a large part of the development cost.',
                },
                {
                  id: 's3',
                  title: 'Processing / control',
                  body: 'Implements the intended function.',
                  detail:
                    'Owns cost and life. This is where the development effort concentrates, and where obsolescence of a key part can end the product life early.',
                },
                {
                  id: 's4',
                  title: 'Output / actuator / display',
                  body: 'Delivers the result to the operator or to another machine.',
                  detail:
                    'Owns ergonomics and aesthetics, and a large part of the maintenance requirement: connectors, displays and keypads are what wear out and what the operator touches.',
                },
                {
                  id: 's5',
                  title: 'Power supply',
                  body: 'Feeds every block and generates heat inside the enclosure.',
                  detail:
                    'Owns the operating-temperature parameter from the inside: the internal temperature rise it creates eats the high-side margin you calculated on the Numericals tab.',
                },
              ]}
            />
          </div>

          <div className="mt2">
            <h3>Comparison matrix</h3>
            <PerformanceMatrix spec={CLASSIFICATION_MATRIX} />
            <WhyButton
              label="Why these entries? (requirement → parameter → value → what if)"
              entries={[
                {
                  requirement: 'Product must work at −22 °C',
                  parameter: 'Operating temp. range',
                  value: 'Industry, −25 to 85 °C',
                  whatIf:
                    'At Consumer (0 to 70 °C) the behaviour below 0 °C is unspecified — the product does not degrade gracefully, it simply has no defined behaviour.',
                },
                {
                  requirement: 'Plant must keep running',
                  parameter: 'Reliability',
                  value: '“Higher: Service @ customer sight”',
                  whatIf:
                    'At “Good” (Consumer) there is no service obligation; the plant waits for a replacement instead of a repair.',
                },
                {
                  requirement: 'Operator wears gloves',
                  parameter: 'Ergonomics',
                  value: '“Operator safety is important”',
                  whatIf:
                    'Treating it as “Comfort” produces small keys and a glossy display — and operator error, which is a safety fault, not a comfort fault.',
                },
                {
                  requirement: '10-year service life',
                  parameter: 'Life / Maintenance',
                  value: '“Better” / “Minimum”',
                  whatIf:
                    'At “Moderate” life the product becomes an unplanned replacement cost inside the plant’s asset plan.',
                },
                {
                  requirement: 'Batch of 200 units',
                  parameter: 'Cost',
                  value: '“Development cost higher”, unit cost controlled',
                  whatIf:
                    'Choosing Military (“Very High”) multiplies the cost by 200 for margin the specification never requested.',
                },
              ]}
            />
          </div>
        </>
      )}

      {tab === 'design' && (
        <DesignChallenge spec={TICKET_DESIGN} topicId={TOPIC1.id} />
      )}

      {tab === 'debugging' && (
        <>
          <div className="row tight mb1">
            {DEBUG_CASES.map((d, i) => (
              <button
                key={d.id}
                className={`btn sm ${debugIndex === i ? 'primary' : ''}`}
                onClick={() => setDebugIndex(i)}
              >
                {d.title}
              </button>
            ))}
          </div>
          <DebugLab fault={DEBUG_CASES[debugIndex]} />
        </>
      )}

      {tab === 'viva' && <VivaEngine questions={vivaQs} />}

      {tab === 'quiz' && (
        <>
          <p className="section-sub">
            Quiz: {mcqs.length} MCQs followed by {written.length} written questions. Written answers
            are self-rated against the model solution — that is the honest way to grade reasoning.
          </p>
          <QuizEngine questions={[...mcqs, ...written]} title="Topic 1 Quiz" />
        </>
      )}

      {tab === 'exam' && (
        <>
          <Callout tone="warn" title="Exam Mode — 8-mark answer format">
            In this mode the topic is written the way an 8-mark answer is written: introduction and
            definition → labelled diagram → comparison table → explanation of the parameters →
            justification. The model answers below are structured with a marking scheme.
          </Callout>
          <div className="mt1">
            <SourceBadge p="source" label="Theory content: source" />{' '}
            <SourceBadge p="insight" label="Method and structure: insight" />
          </div>
          <div className="mt2">
            <QuizEngine questions={examQs} title="Topic 1 — 8-mark questions" />
          </div>
        </>
      )}

      {tab === 'bank' && (
        <>
          <Callout title="Unit 1 Question Bank">
            This bank currently holds the Topic 1 set ({questions.length} questions). As Unit 1
            topics are built, their questions are added to this same bank and become filterable by
            topic, difficulty, marks, type and provenance.
          </Callout>
          <QuestionBank questions={questions} />
        </>
      )}

      {tab === 'progress' && <ProgressTracker unit={UNIT1} topicId={TOPIC1.id} />}
    </div>
  )
}
