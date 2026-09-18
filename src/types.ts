/**
 * Shared content model for the ESD Learning Lab.
 *
 * Every piece of content carries a provenance marker so the UI can show whether
 * it came from the supplied course material or from general engineering practice.
 */

/** Where a piece of content came from. */
export type Provenance = 'source' | 'insight'

/**
 * 'source'  -> supported by the supplied course material (Classification & reliability.pdf etc.)
 * 'insight' -> Engineering Insight: general engineering knowledge, clearly labelled in the UI.
 */
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5

export const LEVEL_LABEL: Record<DifficultyLevel, string> = {
  1: 'LEVEL 1 — Fundamental',
  2: 'LEVEL 2 — Application',
  3: 'LEVEL 3 — Engineering Analysis',
  4: 'LEVEL 4 — Design',
  5: 'LEVEL 5 — Troubleshooting / Integrated',
}

export type QuestionType =
  | 'conceptual'
  | 'numerical'
  | 'circuit-analysis'
  | 'circuit-design'
  | 'component-selection'
  | 'debugging'
  | 'whatif'
  | 'design'
  | 'viva'
  | 'mcq'
  | 'exam'

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  conceptual: 'Conceptual',
  numerical: 'Numerical',
  'circuit-analysis': 'Circuit / System Analysis',
  'circuit-design': 'Circuit Design',
  'component-selection': 'Component Selection',
  debugging: 'Debugging / Fault Finding',
  whatif: 'What-if',
  design: 'Engineering Design',
  viva: 'Viva',
  mcq: 'MCQ',
  exam: 'Exam / Long Answer',
}

/** Skill dimension used for weak-area tracking. */
export type SkillDimension =
  | 'concept'
  | 'numerical'
  | 'analysis'
  | 'design'
  | 'debugging'
  | 'viva'

export interface SolutionStep {
  /** Short heading, e.g. "Given", "Required", "Equation", "Substitution", "Answer". */
  label: string
  content: string
}

export interface McqOption {
  id: string
  text: string
}

export interface VivaFollowUp {
  teacher: string
  expected: string
}

export interface Question {
  id: string
  topicId: string
  type: QuestionType
  level: DifficultyLevel
  marks: number
  /** The reasoning skill the question is really testing. */
  skill: SkillDimension
  /** Verb-first tag so the bank can be filtered by engineering action. */
  action: string
  prompt: string
  hint: string
  /** Ordered solution write-up. Rendered as Given → Required → … → Interpretation. */
  solution: SolutionStep[]
  /** Why the answer matters to a practising engineer. */
  engineeringExplanation: string
  provenance: Provenance
  /** Present only for MCQs. */
  options?: McqOption[]
  answerId?: string
  /** Present only for viva questions — the follow-up chain a teacher would ask. */
  followUps?: VivaFollowUp[]
  /** Marks scheme for exam-style answers. */
  marking?: string[]
}

/* ------------------------------------------------------------------ */
/* Numerical solver model                                             */
/* ------------------------------------------------------------------ */

export interface StepEntry {
  id: string
  label: string
  unit: string
  /** Expected numeric value, or null when the entry is judged by text. */
  answer: number | null
  /** Accepted free-text answers (case-insensitive, punctuation-stripped). */
  accepted?: string[]
  /** Absolute tolerance applied to a numeric answer. */
  tolerance: number
}

export interface SolverStep {
  id: string
  /** What the student must work out at this step. */
  ask: string
  /** Concept / principle that justifies this step. */
  concept: string
  equation: string
  /** Worked substitution string, shown only once the step is solved. */
  substitution: string
  /** One input box per intermediate quantity. */
  entries: StepEntry[]
  hints: string[]
  /** Shown after the step is solved. */
  interpretation: string
  /** "What changes if a parameter changes?" for this step. */
  whatIf?: string
}

export interface NumericalProblem {
  id: string
  title: string
  provenance: Provenance
  /** Context sentence — the "engineering situation". */
  situation: string
  given: { symbol: string; value: string }[]
  required: string[]
  assumptions: string[]
  steps: SolverStep[]
  /** Final engineering read-out. */
  verification: string
  interpretation: string
}

/* ------------------------------------------------------------------ */
/* Design challenge model                                             */
/* ------------------------------------------------------------------ */

export interface DesignCheck {
  id: string
  label: string
  /** What the student must decide. */
  ask: string
  unit?: string
  /** Accepted answers (case-insensitive, trimmed). */
  accepted: string[]
  hints: string[]
  rationale: string
}

export interface DesignChallengeSpec {
  id: string
  title: string
  provenance: Provenance
  requirement: string
  constraints: string[]
  assumptions: string[]
  checks: DesignCheck[]
  /** Full worked answer, revealed after the student attempts. */
  solution: SolutionStep[]
  failureModes: string[]
  interpretation: string
}

/* ------------------------------------------------------------------ */
/* Debugging lab model                                                */
/* ------------------------------------------------------------------ */

export interface DebugOption {
  id: string
  text: string
}

export interface DebugFault {
  id: string
  title: string
  provenance: Provenance
  symptom: string
  /** Readings the student is allowed to "measure". */
  measurements: { label: string; value: string }[]
  /** Multiple-choice hypothesis stage. */
  hypotheses: DebugOption[]
  correctHypothesisId: string
  /** Multiple-choice fix stage. */
  fixes: DebugOption[]
  correctFixId: string
  /** Progressive hints — revealed one at a time. */
  hints: string[]
  /** Why the fault produced that symptom. */
  rootCause: string
  prevention: string
}

/* ------------------------------------------------------------------ */
/* Matrix models                                                      */
/* ------------------------------------------------------------------ */

export interface MatrixRow {
  id: string
  /** Parameter / requirement name. */
  parameter: string
  cells: Record<string, string>
  provenance: Provenance
  note?: string
}

export interface MatrixSpec {
  id: string
  title: string
  columns: string[]
  rows: MatrixRow[]
  provenance: Provenance
  interpretation: string
}

/* ------------------------------------------------------------------ */
/* Content blocks used by the "Learn" flow                            */
/* ------------------------------------------------------------------ */

export type BlockKind =
  | 'problem'
  | 'concept'
  | 'why'
  | 'how'
  | 'diagram'
  | 'calculation'
  | 'whatif'
  | 'insight'

export interface ContentBlock {
  kind: BlockKind
  title: string
  body: string[]
  provenance: Provenance
  /** Optional bullet list rendered under the body. */
  bullets?: string[]
  /** Optional verbatim quotation from the supplied material. */
  quote?: string
  sourceRef?: string
}

export interface ModeContent {
  /** Short framing line for the mode. */
  framing: string
  blocks: ContentBlock[]
}

export type StudyMode = 'beginner' | 'intermediate' | 'exam'

export const MODE_LABEL: Record<StudyMode, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  exam: 'Exam Mode',
}

export interface TopicMeta {
  id: string
  index: number
  title: string
  shortTitle: string
  /** One-line engineering hook. */
  hook: string
  status: 'live' | 'planned'
}

export interface UnitMeta {
  id: string
  title: string
  code: string
  topics: TopicMeta[]
}
