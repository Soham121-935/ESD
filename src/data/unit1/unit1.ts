import type { UnitMeta, TopicMeta } from '../../types'
import { TOPIC1, TOPIC1_QUESTIONS } from './topic1'
import { TOPIC2, TOPIC2_QUESTIONS } from './topic2'

export const UNIT1_TOPICS: TopicMeta[] = [
  TOPIC1,
  TOPIC2,
  {
    id: 'u1t3',
    index: 3,
    title: 'Op-Amp Characteristics',
    shortTitle: 'Op-Amp',
    hook: 'Why the ideal op-amp model is not enough: VOS, IB, IOS, drift, CMRR.',
    status: 'planned',
  },
  {
    id: 'u1t4',
    index: 4,
    title: 'TTL and CMOS',
    shortTitle: 'TTL & CMOS',
    hook: 'Logic levels, noise margin, fan-out, interfacing and why direct connection fails.',
    status: 'planned',
  },
  {
    id: 'u1t5',
    index: 5,
    title: 'System Performance Matrix',
    shortTitle: 'Performance Matrix',
    hook: 'Compare candidate systems on defined parameters and defend the trade-off.',
    status: 'planned',
  },
  {
    id: 'u1t6',
    index: 6,
    title: 'Design Matrix',
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

/** Combined Unit 1 bank — grows as topics are built. */
export const UNIT1_QUESTIONS = [...TOPIC1_QUESTIONS, ...TOPIC2_QUESTIONS]

/** Section ids used for per-topic progress ticks. */
export const TOPIC_SECTION_IDS = [
  'theory',
  'numericals',
  'analysis',
  'design',
  'debugging',
  'viva',
  'quiz',
  'exam',
] as const
