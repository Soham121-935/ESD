import type { ReactNode } from 'react'
import type { Provenance as Prov } from '../types'

export function SourceBadge({ p, label }: { p: Prov; label?: string }) {
  const text = label ?? (p === 'source' ? 'Source material' : 'Engineering Insight')
  return <span className={`badge ${p}`}>{text}</span>
}

export function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warn' | 'ok'
  title?: string
  children: ReactNode
}) {
  return (
    <div className={`callout ${tone === 'info' ? '' : tone}`}>
      {title ? (
        <>
          <strong>{title}</strong>{' '}
        </>
      ) : null}
      {children}
    </div>
  )
}

/** Compact legend explaining the two provenance colours. */
export function ProvenanceLegend() {
  return (
    <div className="provenance-legend">
      <span className="badge source">Source material</span>
      <span className="small faint">from the supplied PDFs</span>
      <span className="badge insight">Engineering Insight</span>
      <span className="small faint">general practice, added and labelled</span>
    </div>
  )
}
