import { useState } from 'react'
import { SourceBadge } from './Provenance'
import type { Provenance as Prov } from '../types'

export interface ConceptCardProps {
  title: string
  definition: string
  intuition?: string
  formula?: string
  example?: string
  why?: string
  provenance: Prov
  sourceRef?: string
  children?: React.ReactNode
}

/**
 * ConceptCard — Definition, intuition, formula, example and why.
 * Everything except the definition is behind a disclosure so the card
 * teaches first and explains on demand.
 */
export function ConceptCard({
  title,
  definition,
  intuition,
  formula,
  example,
  why,
  provenance,
  sourceRef,
  children,
}: ConceptCardProps) {
  const [open, setOpen] = useState(false)
  const hasMore = Boolean(intuition || formula || example || why || children)

  return (
    <div className="card">
      <div className="block-head">
        <h3 style={{ margin: 0 }}>{title}</h3>
        <SourceBadge p={provenance} />
      </div>
      <p>{definition}</p>
      {hasMore && (
        <>
          <button className="btn sm ghost" onClick={() => setOpen((o) => !o)}>
            {open ? 'Hide detail' : 'Intuition / formula / why'}
          </button>
          {open && (
            <div className="reveal">
              <dl>
                {intuition && (
                  <>
                    <dt>Intuition</dt>
                    <dd>{intuition}</dd>
                  </>
                )}
                {formula && (
                  <>
                    <dt>Relation</dt>
                    <dd className="eq">{formula}</dd>
                  </>
                )}
                {example && (
                  <>
                    <dt>Example</dt>
                    <dd>{example}</dd>
                  </>
                )}
                {why && (
                  <>
                    <dt>Why it matters</dt>
                    <dd>{why}</dd>
                  </>
                )}
              </dl>
              {children}
              {sourceRef && <div className="srcref">{sourceRef}</div>}
            </div>
          )}
        </>
      )}
      {!hasMore && sourceRef && <div className="srcref">{sourceRef}</div>}
    </div>
  )
}
