import type { UnitMeta, TopicMeta } from '../../types'
import { TOPIC1 } from './topic1'

export const UNIT1_TOPICS: TopicMeta[] = [
  TOPIC1,
  {
    id: 'u1t2',
    index: 2,
    title: 'System Reliability',
    shortTitle: 'Reliability',
    hook: 'R(t) = e^(−λt) — and the three regions of the bathtub curve.',
    status: 'planned',
  },
  {
    id: 'u1t3',
    title: 'Op-Amp Characteristics',
    index: 3,
    shortTitle: 'Op-Amp',
    hook: 'Why the ideal op-amp model is not enough: VOS, IB, IOS, drift, CMRR.',
    status: 'planned',
  },
  {
    id: 'u1t4',
    title: 'TTL and CMOS',
    index: 4,
    shortTitle: 'TTL & CMOS',
    hook: 'Logic levels, noise margin, fan-out, interfacing and why direct connection fails.',
    status: 'planned',
  },
  {
    id: 'u1t5',
    title: 'System Performance Matrix',
    index: 5,
    shortTitle: 'Performance Matrix',
    hook: 'Compare candidate systems on defined parameters and defend the trade-off.',
    status: 'planned',
  },
  {
    id: 'u1t6',
    title: 'Design Matrix',
    index: 6,
    shortTitle: 'Design Matrix',
    hook: 'Turn requirements and constraints into parameters, then choose.',
    status: 'planned',
  },
]

export const UNIT1: UnitMeta = {
  id: 'u1',
  title: 'Unit 1',
  code: 'UETPE0513 — Electronic System Design',
  topics: UNIT1_TOPICS,
}

export const TOPIC1_SECTION_IDS = [
  'theory',
  'numericals',
  'analysis',
  'design',
  'debugging',
  'viva',
  'quiz',
  'exam',
] as const
