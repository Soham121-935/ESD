import type { ReactNode } from 'react'
import type { ContentBlock, ModeContent } from '../types'
import { SourceBadge } from './Provenance'

const KIND_LABEL: Record<ContentBlock['kind'], string> = {
  problem: 'Problem',
  concept: 'Concept',
  why: 'Why?',
  how: 'How?',
  diagram: 'Engineering diagram',
  calculation: 'Step-by-step calculation',
  whatif: 'What if?',
  insight: 'Engineering insight',
}

/**
 * LearnFlow — renders the teaching sequence in the required order:
 * PROBLEM → CONCEPT → WHY? → HOW? → DIAGRAM → CALCULATION → WHAT IF?
 * Theory is never dumped ahead of the engineering situation.
 */
export function LearnFlow({ content, diagram }: { content: ModeContent; diagram?: ReactNode }) {
  return (
    <div>
      <p className="section-sub">{content.framing}</p>
      {content.blocks.map((b, i) => (
        <div className={`block ${b.kind}`} key={i}>
          <div className="block-head">
            <div>
              <div className="block-kind">{KIND_LABEL[b.kind]}</div>
              <h3>{b.title}</h3>
            </div>
            <SourceBadge p={b.provenance} />
          </div>

          {b.body.map((p, k) => (
            <p key={k}>{p}</p>
          ))}

          {b.quote && <div className="quote">{b.quote}</div>}

          {b.bullets && (
            <ul className="bullets">
              {b.bullets.map((t, k) => (
                <li key={k}>{t}</li>
              ))}
            </ul>
          )}

          {b.kind === 'diagram' && diagram}

          {b.sourceRef && <div className="srcref">{b.sourceRef}</div>}
        </div>
      ))}
    </div>
  )
}

/** The canonical Unit-1 teaching order, shown as a ribbon. */
export function FlowRibbon() {
  const steps = [
    'LEARN',
    'INTERACT',
    'CALCULATE',
    'DESIGN',
    'BREAK',
    'DEBUG',
    'VERIFY',
    'TEST',
  ]
  return (
    <div className="flowline">
      {steps.map((s, i) => (
        <span key={s}>
          <span className="step">{s}</span>
          {i < steps.length - 1 && <span className="arrow">↓ </span>}
        </span>
      ))}
    </div>
  )
}
