import { useParams, Link } from 'react-router-dom'
import { UNIT1 } from '../data/unit1/unit1'
import { Callout } from '../components/Provenance'

export function PlannedTopicPage() {
  const { topicId } = useParams()
  const topic = UNIT1.topics.find((t) => t.id === topicId)

  return (
    <div>
      <div className="section-title">
        <h2>
          Topic {topic?.index} — {topic?.title}
        </h2>
      </div>
      <p className="section-sub">{topic?.hook}</p>

      <div className="empty">
        <p>
          <strong>Not built yet.</strong>
        </p>
        <p className="small">
          This session is implementing Unit 1 one topic at a time. Topic 1 (Electronic System
          Classification) is complete; this topic is scheduled for the next development pass.
        </p>
        <Link className="btn sm primary" to="/u1/u1t1">
          Go to Topic 1
        </Link>
      </div>

      <div className="mt2">
        <Callout title="Syllabus coverage planned for this topic">
          {topic?.id === 'u1t2' &&
            'Meaning of reliability, failure, failure rate, exponential reliability law R(t) = e^(−λt), assumptions, bathtub curve (infant mortality, useful life, wear-out), causes of failure, improvement at component and system level, numerical reliability problems.'}
          {topic?.id === 'u1t3' &&
            'Why ideal op-amp assumptions are insufficient; VOS, IB, IOS, temperature drift, CMRR; effect on output; practical inverting-amplifier analysis with the supplied R1 = 10 kΩ, Rf = 20 kΩ, Vi = 3 V, 2 kΩ load and IQ = 0.5 mA problem.'}
          {topic?.id === 'u1t4' &&
            'TTL and CMOS logic levels, noise margin, fan-out, power, unused inputs, open collector/drain, tri-state, TTL-to-CMOS and CMOS-to-TTL interfacing, pull-up and level translation, interface numerics.'}
          {topic?.id === 'u1t5' &&
            'System Performance Matrix: definition, purpose, parameters, comparison, trade-offs, construction and interpretation.'}
          {topic?.id === 'u1t6' &&
            'Design Matrix: requirements, constraints, parameters, trade-offs, engineering decisions, construction and interpretation.'}
        </Callout>
      </div>
    </div>
  )
}
