import { UNIT1, UNIT1_QUESTIONS } from '../data/unit1/unit1'
import { QuestionBank } from '../components/QuestionBank'
import { Callout } from '../components/Provenance'

export function Unit1BankPage() {
  const live = UNIT1.topics.filter((t) => t.status === 'live')
  const byTopic = live.map((t) => ({
    topic: t,
    count: UNIT1_QUESTIONS.filter((q) => q.topicId === t.id).length,
  }))

  return (
    <div>
      <div className="section-title">
        <h2>Unit 1 Question Bank</h2>
      </div>
      <p className="section-sub">
        Every question built for Unit 1 so far, filterable by topic, difficulty, marks, type and
        provenance. Use the filters to build a targeted practice set from your weak areas.
      </p>

      <div className="row tight mb1">
        {byTopic.map(({ topic, count }) => (
          <span className="badge" key={topic.id}>
            Topic {topic.index} · {topic.shortTitle} · {count}
          </span>
        ))}
        <span className="badge marks">Total {UNIT1_QUESTIONS.length}</span>
      </div>

      <Callout>
        <strong>Bank coverage.</strong> {UNIT1_QUESTIONS.length} questions across{' '}
        {live.length} of {UNIT1.topics.length} topics. The remaining Unit 1 topics will add their
        questions here as they are built. The full Unit 1 target is 250+ questions.
      </Callout>

      <QuestionBank questions={UNIT1_QUESTIONS} />
    </div>
  )
}
