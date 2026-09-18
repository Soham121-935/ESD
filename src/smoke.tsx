/**
 * Smoke-test entry used only by `npm run smoke`.
 * Renders every Topic 1 tab and every reusable component through react-dom/server
 * so that component-level runtime errors surface without a browser.
 *
 * NOTE: App itself is not rendered here because HashRouter touches `document`
 * during construction; it is client-only by design.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { ProgressProvider } from './lib/progress'
import { Topic1Page } from './pages/Topic1Page'
import { Topic2Page } from './pages/Topic2Page'
import { Topic3Page } from './pages/Topic3Page'
import { Topic4Page } from './pages/Topic4Page'
import { Topic5Page } from './pages/Topic5Page'
import { Topic6Page } from './pages/Topic6Page'
import { Unit1BankPage } from './pages/Unit1BankPage'
import { Unit1TestPage } from './pages/Unit1TestPage'
import { PlannedTopicPage } from './pages/PlannedTopicPage'
import { LearnFlow } from './components/LearnFlow'
import { InteractiveCircuit } from './components/InteractiveCircuit'
import { PerformanceMatrix } from './components/PerformanceMatrix'
import { NumericalSolver } from './components/NumericalSolver'
import { TemperatureWindowSim } from './components/TemperatureWindowSim'
import { DesignChallenge } from './components/DesignChallenge'
import { DebugLab } from './components/DebugLab'
import { QuizEngine } from './components/QuizEngine'
import { VivaEngine } from './components/VivaEngine'
import { QuestionBank } from './components/QuestionBank'
import { ProgressTracker } from './components/ProgressTracker'
import { StepBuilder } from './components/StepBuilder'
import { WhyButton } from './components/WhyButton'
import { ConceptCard } from './components/ConceptCard'
import { ReliabilityExplorer } from './components/ReliabilityExplorer'
import { OpAmpInvertingLab } from './components/OpAmpInvertingLab'
import { LogicInterfaceLab } from './components/LogicInterfaceLab'
import { MatrixBuilder } from './components/MatrixBuilder'
import {
  LOGIC_DESIGN,
  LOGIC_PROBLEMS,
  SOURCE_NOTE4,
  TOPIC4_MODES,
  TOPIC4_QUESTIONS,
} from './data/unit1/topic4'
import { LOGIC_FAMILIES } from './components/LogicInterfaceLab'
import {
  OPAMP_DESIGN,
  OPAMP_PROBLEMS,
  OPAMP_SPEC_MATRIX,
  TOPIC3_MODES,
  TOPIC3_QUESTIONS,
} from './data/unit1/topic3'
import {
  FINAL_TEST_QUESTIONS,
  FINAL_TEST_TOTAL_MARKS,
  UNIT1_FINAL_TEST,
} from './data/unit1/finalTest'
import {
  DESIGN_OPTIONS,
  DESIGN_PARAMS,
  DM_DESIGN,
  DM_REVIEW_FAULTS,
  TOPIC6_MODES,
  TOPIC6_QUESTIONS,
} from './data/unit1/topic6'
import {
  PM_DESIGN,
  PM_OPTIONS,
  PM_PARAMS,
  PM_REVIEW_FAULTS,
  TOPIC5_MODES,
  TOPIC5_QUESTIONS,
} from './data/unit1/topic5'
import { BathtubCurve } from './components/BathtubCurve'
import {
  BATHTUB_REGIONS,
  DEBUG_CASES2 as DEBUG2,
  FAILURE_TYPE_MATRIX,
  RELIABILITY_DESIGN,
  RELIABILITY_PROBLEMS,
  TOPIC2_MODES,
  TOPIC2_QUESTIONS,
} from './data/unit1/topic2'
import { UNIT1_QUESTIONS } from './data/unit1/unit1'
import {
  CLASSIFICATION_MATRIX,
  DEBUG_CASES,
  SYSTEM_EDGES,
  SYSTEM_STAGES,
  TEMP_RANGE_PROBLEM,
  TICKET_DESIGN,
  TOPIC1_MODES,
  TOPIC1_QUESTIONS,
} from './data/unit1/topic1'
import { UNIT1 } from './data/unit1/unit1'

const results: string[] = []

function render(name: string, node: React.ReactNode) {
  try {
    const html = renderToString(node)
    results.push(`OK   ${name} (${html.length} chars)`)
    if (process.env.DUMP_DIR) {
      mkdirSync(process.env.DUMP_DIR, { recursive: true })
      writeFileSync(
        `${process.env.DUMP_DIR}/${name.replace(/[^\w]+/g, '_')}.html`,
        html,
      )
    }
  } catch (e) {
    results.push(`FAIL ${name}: ${(e as Error).message}`)
    process.exitCode = 1
  }
}

const wrap = (node: React.ReactNode) => (
  <ProgressProvider>
    <MemoryRouter>{node}</MemoryRouter>
  </ProgressProvider>
)

/* Pages */
render('Topic1Page', wrap(<Topic1Page />))
render('Topic2Page', wrap(<Topic2Page />))
render('Topic3Page', wrap(<Topic3Page />))
render('Topic4Page', wrap(<Topic4Page />))
render('Topic5Page', wrap(<Topic5Page />))
render('Topic6Page', wrap(<Topic6Page />))
render('Unit1BankPage', wrap(<Unit1BankPage />))
render('Unit1TestPage', wrap(<Unit1TestPage />))
for (const t of UNIT1.topics.filter((x) => x.id !== 'u1t1')) {
  render(
    `PlannedTopicPage ${t.id}`,
    wrap(<PlannedTopicPage />),
  )
}

/* Learn flow — all three modes, both topics */
for (const m of ['beginner', 'intermediate', 'exam'] as const) {
  render(
    `LearnFlow T1 ${m}`,
    <LearnFlow
      content={TOPIC1_MODES[m]}
      diagram={<InteractiveCircuit nodes={SYSTEM_STAGES} edges={SYSTEM_EDGES} />}
    />,
  )
  render(
    `LearnFlow T2 ${m}`,
    <LearnFlow content={TOPIC2_MODES[m]} diagram={<ReliabilityExplorer />} />,
  )
}

/* Topic 3 components */
render('OpAmpInvertingLab', <OpAmpInvertingLab />)
render('OpAmpSpecMatrix', <PerformanceMatrix spec={OPAMP_SPEC_MATRIX} />)
OPAMP_PROBLEMS.forEach((p) => render(`OpAmp ${p.id}`, wrap(<NumericalSolver problem={p} topicId="u1t3" />)))
render('OpAmpDesign', wrap(<DesignChallenge spec={OPAMP_DESIGN} topicId="u1t3" />))
for (const m of ['beginner', 'intermediate', 'exam'] as const) {
  render(`LearnFlow T3 ${m}`, <LearnFlow content={TOPIC3_MODES[m]} diagram={<OpAmpInvertingLab />} />)
}

/* Topic 4 components */
render('LogicInterfaceLab', <LogicInterfaceLab />)
LOGIC_PROBLEMS.forEach((p) => render(`Logic ${p.id}`, wrap(<NumericalSolver problem={p} topicId="u1t4" />)))
render('LogicDesign', wrap(<DesignChallenge spec={LOGIC_DESIGN} topicId="u1t4" />))
for (const m of ['beginner', 'intermediate', 'exam'] as const) {
  render(`LearnFlow T4 ${m}`, <LearnFlow content={TOPIC4_MODES[m]} diagram={<LogicInterfaceLab />} />)
}

/* Topic 5 and 6 — matrix builder */
render('MatrixBuilder T5', <MatrixBuilder title="t" params={PM_PARAMS} options={PM_OPTIONS} />)
render('MatrixBuilder T6', <MatrixBuilder title="t" params={DESIGN_PARAMS} options={DESIGN_OPTIONS} />)
render('PMDesign', wrap(<DesignChallenge spec={PM_DESIGN} topicId="u1t5" />))
render('DMDesign', wrap(<DesignChallenge spec={DM_DESIGN} topicId="u1t6" />))
for (const m of ['beginner', 'intermediate', 'exam'] as const) {
  render(
    `LearnFlow T5 ${m}`,
    <LearnFlow content={TOPIC5_MODES[m]} diagram={<MatrixBuilder title="t" params={PM_PARAMS} options={PM_OPTIONS} />} />,
  )
  render(
    `LearnFlow T6 ${m}`,
    <LearnFlow content={TOPIC6_MODES[m]} diagram={<MatrixBuilder title="t" params={DESIGN_PARAMS} options={DESIGN_OPTIONS} />} />,
  )
}

/* Topic 2 components */
render('ReliabilityExplorer', <ReliabilityExplorer />)
render('BathtubCurve', <BathtubCurve regions={BATHTUB_REGIONS} />)
render('FailureTypeMatrix', <PerformanceMatrix spec={FAILURE_TYPE_MATRIX} />)
RELIABILITY_PROBLEMS.forEach((p) => render(`Solver ${p.id}`, wrap(<NumericalSolver problem={p} topicId="u1t2" />)))
render('ReliabilityDesign', wrap(<DesignChallenge spec={RELIABILITY_DESIGN} topicId="u1t2" />))
DEBUG2.forEach((d, i) => render(`DebugLab T2 ${i + 1}`, wrap(<DebugLab fault={d} topicId="u1t2" />)))
render(
  'QuizEngine T2 mcq',
  wrap(<QuizEngine questions={TOPIC2_QUESTIONS.filter((q) => q.type === 'mcq')} title="T2 MCQ" />),
)
render('VivaEngine T2', wrap(<VivaEngine questions={TOPIC2_QUESTIONS.filter((q) => q.type === 'viva')} />))
render('QuestionBank T2', <QuestionBank questions={TOPIC2_QUESTIONS} />)
render('QuestionBank Unit1', <QuestionBank questions={UNIT1_QUESTIONS} />)

/* Reusable components */
render('PerformanceMatrix', <PerformanceMatrix spec={CLASSIFICATION_MATRIX} />)
render('InteractiveCircuit', <InteractiveCircuit nodes={SYSTEM_STAGES} edges={SYSTEM_EDGES} />)
render('NumericalSolver', wrap(<NumericalSolver problem={TEMP_RANGE_PROBLEM} topicId="u1t1" />))
render('TemperatureWindowSim', <TemperatureWindowSim />)
render('DesignChallenge', wrap(<DesignChallenge spec={TICKET_DESIGN} topicId="u1t1" />))
DEBUG_CASES.forEach((d, i) => render(`DebugLab ${i + 1}`, wrap(<DebugLab fault={d} topicId="u1t1" />)))
render(
  'QuizEngine (mcq)',
  wrap(<QuizEngine questions={TOPIC1_QUESTIONS.filter((q) => q.type === 'mcq')} title="MCQ" />),
)
render(
  'QuizEngine (written)',
  wrap(
    <QuizEngine
      questions={TOPIC1_QUESTIONS.filter((q) => !['mcq', 'viva', 'exam'].includes(q.type))}
      title="Written"
    />,
  ),
)
render(
  'QuizEngine (exam)',
  wrap(<QuizEngine questions={TOPIC1_QUESTIONS.filter((q) => q.type === 'exam')} title="Exam" />),
)
render('VivaEngine', wrap(<VivaEngine questions={TOPIC1_QUESTIONS.filter((q) => q.type === 'viva')} />))
render('QuestionBank', <QuestionBank questions={TOPIC1_QUESTIONS} />)
render('ProgressTracker', wrap(<ProgressTracker unit={UNIT1} topicId="u1t1" />))
render(
  'StepBuilder',
  <StepBuilder stages={[{ id: 'a', title: 'A', body: 'b', detail: 'd' }]} />,
)
render(
  'WhyButton',
  <WhyButton
    entries={[{ requirement: 'r', parameter: 'p', value: 'v', whatIf: 'w' }]}
  />,
)
render(
  'ConceptCard',
  <ConceptCard
    title="t"
    definition="d"
    intuition="i"
    formula="f"
    why="w"
    provenance="source"
  />,
)

/* Data integrity checks */
const allQuestions = [
  ...TOPIC1_QUESTIONS,
  ...TOPIC2_QUESTIONS,
  ...TOPIC3_QUESTIONS,
  ...TOPIC4_QUESTIONS,
  ...TOPIC5_QUESTIONS,
  ...TOPIC6_QUESTIONS,
]
const ids = allQuestions.map((q) => q.id)
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
results.push(
  dupes.length === 0
    ? `OK   question ids unique (${ids.length} questions)`
    : `FAIL duplicate question ids: ${dupes.join(', ')}`,
)
if (dupes.length) process.exitCode = 1

const badMcq = allQuestions.filter(
  (q) => q.type === 'mcq' && (!q.options || !q.answerId || !q.options.some((o) => o.id === q.answerId)),
)
results.push(
  badMcq.length === 0
    ? `OK   all MCQs have options and a valid answer key (${allQuestions.filter((q) => q.type === 'mcq').length})`
    : `FAIL invalid MCQ: ${badMcq.map((q) => q.id).join(', ')}`,
)
if (badMcq.length) process.exitCode = 1

const allProblems = [
  TEMP_RANGE_PROBLEM,
  ...RELIABILITY_PROBLEMS,
  ...OPAMP_PROBLEMS,
  ...LOGIC_PROBLEMS,
]
for (const pr of allProblems) {
  const stepIds = pr.steps.flatMap((s) => s.entries.map((e) => e.id))
  const ok = new Set(stepIds).size === stepIds.length
  results.push(ok ? `OK   solver entry ids unique — ${pr.id} (${stepIds.length})` : `FAIL duplicate entry ids in ${pr.id}`)
  if (!ok) process.exitCode = 1
}

const bankSizes: [string, number][] = [
  ['topic 1', TOPIC1_QUESTIONS.length],
  ['topic 2', TOPIC2_QUESTIONS.length],
  ['topic 3', TOPIC3_QUESTIONS.length],
  ['topic 4', TOPIC4_QUESTIONS.length],
  ['topic 5', TOPIC5_QUESTIONS.length],
  ['topic 6', TOPIC6_QUESTIONS.length],
]
for (const [name, n] of bankSizes) {
  results.push(n > 0 ? `OK   ${name} bank size ${n}` : `FAIL ${name} bank is empty`)
  if (n === 0) process.exitCode = 1
}
const unitTotal = UNIT1_QUESTIONS.length
results.push(
  unitTotal >= 250
    ? `OK   unit 1 total ${unitTotal} questions (>= 250)`
    : `FAIL unit 1 total ${unitTotal} questions (expected >= 250)`,
)
if (unitTotal < 250) process.exitCode = 1

/* every topic referenced by a question must exist */
const knownTopicIds = new Set(UNIT1.topics.map((t) => t.id))
const orphanQs = allQuestions.filter((q) => !knownTopicIds.has(q.topicId))
results.push(
  orphanQs.length === 0
    ? 'OK   every question maps to a known topic'
    : `FAIL questions with unknown topic: ${orphanQs.slice(0, 5).map((q) => q.id).join(', ')}`,
)
if (orphanQs.length) process.exitCode = 1

/* topic 4 source note must disclose that level values are Engineering Insight */
results.push(
  SOURCE_NOTE4.coverage.includes('Engineering Insight')
    ? 'OK   topic 4 discloses that numeric level values are Engineering Insight'
    : 'FAIL topic 4 does not disclose the provenance of its level values',
)
if (!SOURCE_NOTE4.coverage.includes('Engineering Insight')) process.exitCode = 1

/* review faults present for the matrix topics */
results.push(PM_REVIEW_FAULTS.length === 5 ? 'OK   topic 5 review faults (5)' : 'FAIL topic 5 review faults')
results.push(DM_REVIEW_FAULTS.length === 5 ? 'OK   topic 6 review faults (5)' : 'FAIL topic 6 review faults')
if (PM_REVIEW_FAULTS.length !== 5 || DM_REVIEW_FAULTS.length !== 5) process.exitCode = 1

/* logic family data sanity */
const badFamily = LOGIC_FAMILIES.filter((f) => f.vihMin <= f.vilMax || f.vohMin <= f.volMax)
results.push(
  badFamily.length === 0
    ? `OK   logic family levels ordered (${LOGIC_FAMILIES.length} families)`
    : `FAIL inconsistent logic levels: ${badFamily.map((f) => f.id).join(', ')}`,
)
if (badFamily.length) process.exitCode = 1


/* ---------------- Unit 1 final test ---------------- */

const ftSections = UNIT1_FINAL_TEST.length
results.push(
  ftSections === 8 ? 'OK   final test has 8 sections' : `FAIL final test has ${ftSections} sections`,
)
if (ftSections !== 8) process.exitCode = 1

const ftLetters = UNIT1_FINAL_TEST.map((s) => s.letter).join('')
results.push(
  ftLetters === 'ABCDEFGH'
    ? 'OK   final test sections are labelled A-H'
    : `FAIL final test letters are ${ftLetters}`,
)
if (ftLetters !== 'ABCDEFGH') process.exitCode = 1

results.push(
  FINAL_TEST_QUESTIONS.length === 35 && FINAL_TEST_TOTAL_MARKS === 160
    ? `OK   final test paper is ${FINAL_TEST_QUESTIONS.length} questions / ${FINAL_TEST_TOTAL_MARKS} marks`
    : `FAIL final test paper is ${FINAL_TEST_QUESTIONS.length} questions / ${FINAL_TEST_TOTAL_MARKS} marks (expected 35 / 160)`,
)
if (FINAL_TEST_QUESTIONS.length !== 35 || FINAL_TEST_TOTAL_MARKS !== 160) process.exitCode = 1

const ftIds = FINAL_TEST_QUESTIONS.map((q) => q.id)
results.push(
  new Set(ftIds).size === ftIds.length ? 'OK   final test question ids unique' : 'FAIL duplicate final test question ids',
)
if (new Set(ftIds).size !== ftIds.length) process.exitCode = 1

const ftNoScheme = FINAL_TEST_QUESTIONS.filter((q) => !q.marking || q.marking.length === 0)
results.push(
  ftNoScheme.length === 0
    ? 'OK   every final test question carries a marking scheme'
    : `FAIL final test questions without a marking scheme: ${ftNoScheme.map((q) => q.id).join(', ')}`,
)
if (ftNoScheme.length) process.exitCode = 1

const ftBadMarks = UNIT1_FINAL_TEST.flatMap((sec) =>
  sec.questions.filter((q) => q.marks !== sec.marksEach).map((q) => q.id),
)
results.push(
  ftBadMarks.length === 0
    ? 'OK   every final test question matches its section mark value'
    : `FAIL final test mark mismatch: ${ftBadMarks.join(', ')}`,
)
if (ftBadMarks.length) process.exitCode = 1

const ftOrphans = FINAL_TEST_QUESTIONS.filter((q) => !knownTopicIds.has(q.topicId))
results.push(
  ftOrphans.length === 0
    ? 'OK   every final test question maps to a known topic'
    : `FAIL final test questions with unknown topic: ${ftOrphans.map((q) => q.id).join(', ')}`,
)
if (ftOrphans.length) process.exitCode = 1

const ftTopics = new Set(FINAL_TEST_QUESTIONS.map((q) => q.topicId))
results.push(
  ftTopics.size === 6
    ? 'OK   final test covers all six Unit 1 topics'
    : `FAIL final test covers only ${ftTopics.size} topics`,
)
if (ftTopics.size !== 6) process.exitCode = 1

const ftThin = FINAL_TEST_QUESTIONS.filter((q) => q.solution.length < 3 || q.hint.length < 10)
results.push(
  ftThin.length === 0
    ? 'OK   every final test question has a hint and a full worked solution'
    : `FAIL thin final test questions: ${ftThin.map((q) => q.id).join(', ')}`,
)
if (ftThin.length) process.exitCode = 1

/* matrix scoring direction — a raw figure must never be rewarded for being large */
const invertedMatrixParams = [...PM_PARAMS, ...DESIGN_PARAMS].filter((p) => !p.higherIsBetter)
results.push(
  invertedMatrixParams.length === 0
    ? 'OK   every matrix parameter is scored in the "5 is best" direction'
    : `FAIL matrix parameters still marked for inversion: ${invertedMatrixParams.map((p) => p.id).join(', ')}`,
)
if (invertedMatrixParams.length) process.exitCode = 1

console.log(results.join('\n'))
