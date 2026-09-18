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
for (const t of UNIT1.topics.filter((x) => x.id !== 'u1t1')) {
  render(
    `PlannedTopicPage ${t.id}`,
    wrap(<PlannedTopicPage />),
  )
}

/* Learn flow — all three modes */
for (const m of ['beginner', 'intermediate', 'exam'] as const) {
  render(
    `LearnFlow ${m}`,
    <LearnFlow
      content={TOPIC1_MODES[m]}
      diagram={<InteractiveCircuit nodes={SYSTEM_STAGES} edges={SYSTEM_EDGES} />}
    />,
  )
}

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
const ids = TOPIC1_QUESTIONS.map((q) => q.id)
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
results.push(
  dupes.length === 0
    ? `OK   question ids unique (${ids.length} questions)`
    : `FAIL duplicate question ids: ${dupes.join(', ')}`,
)

const badMcq = TOPIC1_QUESTIONS.filter(
  (q) => q.type === 'mcq' && (!q.options || !q.answerId || !q.options.some((o) => o.id === q.answerId)),
)
results.push(
  badMcq.length === 0
    ? `OK   all MCQs have options and a valid answer key (${TOPIC1_QUESTIONS.filter((q) => q.type === 'mcq').length})`
    : `FAIL invalid MCQ: ${badMcq.map((q) => q.id).join(', ')}`,
)

const stepIds = TEMP_RANGE_PROBLEM.steps.flatMap((s) => s.entries.map((e) => e.id))
results.push(
  new Set(stepIds).size === stepIds.length
    ? `OK   solver entry ids unique (${stepIds.length})`
    : 'FAIL duplicate solver entry ids',
)

console.log(results.join('\n'))
