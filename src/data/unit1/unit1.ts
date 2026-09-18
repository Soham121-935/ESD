import type { UnitMeta, TopicMeta } from '../../types'
import { TOPIC1, TOPIC1_QUESTIONS } from './topic1'
import { TOPIC2, TOPIC2_QUESTIONS } from './topic2'
import { TOPIC3, TOPIC3_QUESTIONS } from './topic3'
import { TOPIC4, TOPIC4_QUESTIONS } from './topic4'
import { TOPIC5, TOPIC5_QUESTIONS } from './topic5'
import { TOPIC6, TOPIC6_QUESTIONS } from './topic6'

export const UNIT1_TOPICS: TopicMeta[] = [
  TOPIC1,
  TOPIC2,
  TOPIC3,
  TOPIC4,
  TOPIC5,
  TOPIC6,
]

export const UNIT1: UnitMeta = {
  id: 'u1',
  title: 'Unit 1',
  code: 'UETPE0513 — Electronic System Design',
  topics: UNIT1_TOPICS,
}

/** Combined Unit 1 bank — grows as topics are built. */
export const UNIT1_QUESTIONS = [
  ...TOPIC1_QUESTIONS,
  ...TOPIC2_QUESTIONS,
  ...TOPIC3_QUESTIONS,
  ...TOPIC4_QUESTIONS,
  ...TOPIC5_QUESTIONS,
  ...TOPIC6_QUESTIONS,
]

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
