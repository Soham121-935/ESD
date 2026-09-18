import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { SkillDimension, StudyMode, UnitMeta } from '../types'

const STORAGE_KEY = 'esd-learning-lab:v1'

export interface AttemptRecord {
  questionId: string
  topicId: string
  skill: SkillDimension
  correct: boolean
  marks: number
  awarded: number
  at: number
}

export interface ActivityRecord {
  /** e.g. "u1.t1.theory" — section key inside a topic. */
  key: string
  topicId: string
  section: string
  at: number
}

export interface ProgressState {
  mode: StudyMode
  attempts: AttemptRecord[]
  activity: ActivityRecord[]
  /** Design challenge ids the student has submitted. */
  designSubmissions: Record<string, number>
  /** Debug cases solved. */
  debugSolved: string[]
  /** Viva questions answered confidently (self-rated). */
  vivaDone: string[]
}

const emptyState: ProgressState = {
  mode: 'beginner',
  attempts: [],
  activity: [],
  designSubmissions: {},
  debugSolved: [],
  vivaDone: [],
}

function load(): ProgressState {
  if (typeof window === 'undefined') return emptyState
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return {
      mode: parsed.mode ?? 'beginner',
      attempts: parsed.attempts ?? [],
      activity: parsed.activity ?? [],
      designSubmissions: parsed.designSubmissions ?? {},
      debugSolved: parsed.debugSolved ?? [],
      vivaDone: parsed.vivaDone ?? [],
    }
  } catch {
    return emptyState
  }
}

interface ProgressContextValue {
  state: ProgressState
  setMode: (mode: StudyMode) => void
  recordAttempt: (r: Omit<AttemptRecord, 'at'>) => void
  recordActivity: (topicId: string, section: string) => void
  recordDesign: (id: string, scorePct: number) => void
  recordDebug: (id: string) => void
  recordViva: (id: string) => void
  /** Remove the recorded attempt for the given question ids (used to re-sit a paper). */
  clearAttempts: (questionIds: string[]) => void
  reset: () => void
  /** Percentage per skill for a topic. */
  skillAccuracy: (topicId: string) => Partial<Record<SkillDimension, number>>
  /** Percentage per skill across the whole unit. */
  unitSkillAccuracy: (unit: UnitMeta) => Partial<Record<SkillDimension, number>>
  visited: (key: string) => boolean
}

const Ctx = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => load())

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable — keep running in memory */
    }
  }, [state])

  const setMode = useCallback((mode: StudyMode) => {
    setState((s) => ({ ...s, mode }))
  }, [])

  const recordAttempt = useCallback((r: Omit<AttemptRecord, 'at'>) => {
    setState((s) => ({
      ...s,
      attempts: [
        ...s.attempts.filter((a) => a.questionId !== r.questionId),
        { ...r, at: Date.now() },
      ],
    }))
  }, [])

  const recordActivity = useCallback((topicId: string, section: string) => {
    setState((s) => {
      const key = `${topicId}.${section}`
      if (s.activity.some((a) => a.key === key)) return s
      return {
        ...s,
        activity: [...s.activity, { key, topicId, section, at: Date.now() }],
      }
    })
  }, [])

  const recordDesign = useCallback((id: string, scorePct: number) => {
    setState((s) => ({
      ...s,
      designSubmissions: { ...s.designSubmissions, [id]: scorePct },
    }))
  }, [])

  const recordDebug = useCallback((id: string) => {
    setState((s) =>
      s.debugSolved.includes(id) ? s : { ...s, debugSolved: [...s.debugSolved, id] },
    )
  }, [])

  const recordViva = useCallback((id: string) => {
    setState((s) => (s.vivaDone.includes(id) ? s : { ...s, vivaDone: [...s.vivaDone, id] }))
  }, [])

  const clearAttempts = useCallback((questionIds: string[]) => {
    const drop = new Set(questionIds)
    setState((s) => ({ ...s, attempts: s.attempts.filter((a) => !drop.has(a.questionId)) }))
  }, [])

  const reset = useCallback(() => setState({ ...emptyState }), [])

  const skillAccuracy = useCallback(
    (topicId: string) => {
      const acc: Partial<Record<SkillDimension, number>> = {}
      const groups: Record<string, { got: number; max: number }> = {}
      for (const a of state.attempts) {
        if (a.topicId !== topicId) continue
        groups[a.skill] ??= { got: 0, max: 0 }
        groups[a.skill].got += a.awarded
        groups[a.skill].max += a.marks
      }
      for (const [k, v] of Object.entries(groups)) {
        if (v.max > 0) acc[k as SkillDimension] = Math.round((v.got / v.max) * 100)
      }
      return acc
    },
    [state.attempts],
  )

  const unitSkillAccuracy = useCallback(
    (unit: UnitMeta) => {
      const ids = new Set(unit.topics.map((t) => t.id))
      const acc: Partial<Record<SkillDimension, number>> = {}
      const groups: Record<string, { got: number; max: number }> = {}
      for (const a of state.attempts) {
        if (!ids.has(a.topicId)) continue
        groups[a.skill] ??= { got: 0, max: 0 }
        groups[a.skill].got += a.awarded
        groups[a.skill].max += a.marks
      }
      for (const [k, v] of Object.entries(groups)) {
        if (v.max > 0) acc[k as SkillDimension] = Math.round((v.got / v.max) * 100)
      }
      return acc
    },
    [state.attempts],
  )

  const visited = useCallback(
    (key: string) => state.activity.some((a) => a.key === key),
    [state.activity],
  )

  const value = useMemo(
    () => ({
      state,
      setMode,
      recordAttempt,
      recordActivity,
      recordDesign,
      recordDebug,
      recordViva,
      clearAttempts,
      reset,
      skillAccuracy,
      unitSkillAccuracy,
      visited,
    }),
    [
      state,
      setMode,
      recordAttempt,
      recordActivity,
      recordDesign,
      recordDebug,
      recordViva,
      clearAttempts,
      reset,
      skillAccuracy,
      unitSkillAccuracy,
      visited,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useProgress() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider')
  return ctx
}
