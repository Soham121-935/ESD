import { useEffect, useMemo, useState } from 'react'
import type { DesignChallengeSpec, ModeContent, Question, TopicMeta } from '../types'
import type { MatrixOption, MatrixParam } from '../components/MatrixBuilder'
import { useProgress } from '../lib/progress'
import { ModeSwitcher } from '../components/ModeSwitcher'
import { LearnFlow, FlowRibbon } from '../components/LearnFlow'
import { MatrixBuilder } from '../components/MatrixBuilder'
import { DesignChallenge } from '../components/DesignChallenge'
import { QuizEngine } from '../components/QuizEngine'
import { VivaEngine } from '../components/VivaEngine'
import { QuestionBank } from '../components/QuestionBank'
import { ProgressTracker } from '../components/ProgressTracker'
import { ProvenanceLegend, Callout } from '../components/Provenance'
import { UNIT1 } from '../data/unit1/unit1'
import type { StudyMode } from '../types'

type ReviewFault = { id: string; title: string; fault: string; whyItIsWrong: string; fix: string }

interface Props {
  topic: TopicMeta
  sourceNote: { primary: string; coverage: string }
  modes: Record<'beginner' | 'intermediate' | 'exam', ModeContent>
  params: MatrixParam[]
  options: MatrixOption[]
  matrixTitle: string
  matrixNote: string
  design: DesignChallengeSpec
  questions: Question[]
  sections: readonly { id: string; label: string }[]
  examBlurb: string
  reviewFaults: ReviewFault[]
}

type TabId = string

export function MatrixTopicPage({
  topic,
  sourceNote,
  modes,
  params,
  options,
  matrixTitle,
  matrixNote,
  design,
  questions,
  sections,
  examBlurb,
  reviewFaults,
}: Props) {
  const { state, setMode, recordActivity, visited } = useProgress()
  const mode: StudyMode = state.mode
  const [tab, setTab] = useState<TabId>('theory')

  useEffect(() => {
    if (tab !== 'bank' && tab !== 'progress') recordActivity(topic.id, tab)
  }, [tab, recordActivity, topic.id])

  const mcqs = useMemo(() => questions.filter((q) => q.type === 'mcq'), [questions])
  const written = useMemo(
    () => questions.filter((q) => q.type !== 'mcq' && q.type !== 'viva'),
    [questions],
  )
  const vivaQs = useMemo(() => questions.filter((q) => q.type === 'viva'), [questions])
  const content = modes[mode]

  const tabs: { id: TabId; label: string }[] = [
    ...sections.map((s) => ({ id: s.id, label: s.label })),
    { id: 'bank', label: 'Question Bank' },
    { id: 'progress', label: 'Progress' },
  ]

  return (
    <div>
      <div className="section-title">
        <h2>
          Topic {topic.index} — {topic.title}
        </h2>
      </div>
      <p className="section-sub">{topic.hook}</p>

      <div className="between mb1" style={{ flexWrap: 'wrap', gap: '0.7rem' }}>
        <ModeSwitcher mode={mode} onChange={setMode} />
        <div className="row tight">
          <span className="badge source">Topic status: live</span>
          <span className="badge">{questions.length} questions in bank</span>
        </div>
      </div>

      <Callout>
        <strong>Source for this topic.</strong> {sourceNote.primary} {sourceNote.coverage}
      </Callout>

      <FlowRibbon />

      <div className="tabs">
        {tabs.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            {t.label}
            {t.id !== 'bank' && t.id !== 'progress' && visited(`${topic.id}.${t.id}`) && (
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
                <MatrixBuilder title={matrixTitle} params={params} options={options} note={matrixNote} />
              </div>
            }
          />
        </>
      )}

      {tab === 'numericals' && (
        <MatrixBuilder title={matrixTitle} params={params} options={options} note={matrixNote} />
      )}

      {tab === 'analysis' && (
        <>
          <h3>Reading a matrix critically</h3>
          <p className="section-sub">
            An analysis question on this topic asks you to check the matrix, not to fill it in. Work
            through the checks below against the builder in the Matrix Lab.
          </p>
          <ul className="bullets">
            <li>
              <strong>Is every row traceable to a requirement?</strong> If not, the row is either
              irrelevant or it encodes an unstated requirement that should be raised.
            </li>
            <li>
              <strong>Is every direction marked?</strong> Cost, power, size, complexity and
              maintenance burden are lower-is-better.
            </li>
            <li>
              <strong>Is anything pass/fail being scored?</strong> Hard limits must screen, not
              weight.
            </li>
            <li>
              <strong>Is every score evidenced?</strong> A score from memory is an opinion wearing a
              number.
            </li>
            <li>
              <strong>What is not in the table?</strong> The missing parameter is usually the one
              that decides.
            </li>
          </ul>

          <div className="mt2">
            <MatrixBuilder
              title={`${matrixTitle} — analysis copy`}
              params={params}
              options={options}
              note={matrixNote}
            />
          </div>
        </>
      )}

      {tab === 'design' && <DesignChallenge spec={design} topicId={topic.id} />}

      {tab === 'debugging' && (
        <>
          <h3>Review faults — find what is wrong with the matrix</h3>
          <p className="section-sub">
            These are the five ways a matrix gets misused. For each one, diagnose the fault before
            reading the explanation — this is the debugging section of the topic.
          </p>
          {reviewFaults.map((f, i) => (
            <div className="qcard" key={f.id}>
              <div className="qcard-head">
                <span className="badge">Fault {i + 1}</span>
                <span className="badge">Review</span>
              </div>
              <p className="prompt">
                <strong>{f.title}.</strong> {f.fault}
              </p>
              <div className="reveal">
                <dl>
                  <dt>Why wrong</dt>
                  <dd>{f.whyItIsWrong}</dd>
                  <dt>Fix</dt>
                  <dd>{f.fix}</dd>
                </dl>
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'viva' && <VivaEngine questions={vivaQs} />}

      {tab === 'quiz' && (
        <>
          <p className="section-sub">
            Quiz: {mcqs.length > 0 ? `${mcqs.length} MCQs followed by ` : ''}
            {written.length} written questions, self-rated against the model solutions.
          </p>
          <QuizEngine questions={[...mcqs, ...written]} title={`Topic ${topic.index} Quiz`} />
        </>
      )}

      {tab === 'exam' && (
        <>
          <Callout tone="warn" title="Exam Mode — the assignment question">
            {examBlurb}
          </Callout>
          <div className="mt2">
            <QuizEngine
              questions={written.filter((q) => q.marks >= 3)}
              title={`Topic ${topic.index} — Exam practice`}
            />
          </div>
        </>
      )}

      {tab === 'bank' && (
        <>
          <Callout title="Unit 1 Question Bank">
            This bank currently holds the Topic {topic.index} set ({questions.length} questions). The
            combined Unit 1 bank is available from the sidebar.
          </Callout>
          <QuestionBank questions={questions} />
        </>
      )}

      {tab === 'progress' && <ProgressTracker unit={UNIT1} topicId={topic.id} />}
    </div>
  )
}
