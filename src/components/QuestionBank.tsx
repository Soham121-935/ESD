import { useMemo, useState } from 'react'
import type { Question, QuestionType, DifficultyLevel } from '../types'
import { QUESTION_TYPE_LABEL, LEVEL_LABEL } from '../types'
import { SourceBadge } from './Provenance'
import { UNIT1 } from '../data/unit1/unit1'

type TypeFilter = 'all' | QuestionType | 'circuit' | 'numerical-group'
type ProvFilter = 'all' | 'source' | 'insight'

const TYPE_GROUPS: { id: TypeFilter; label: string; match: (q: Question) => boolean }[] = [
  { id: 'all', label: 'All types', match: () => true },
  { id: 'conceptual', label: 'Conceptual', match: (q) => q.type === 'conceptual' },
  { id: 'numerical-group', label: 'Numerical', match: (q) => q.type === 'numerical' || q.skill === 'numerical' },
  {
    id: 'circuit',
    label: 'Circuit / System',
    match: (q) => q.type === 'circuit-analysis' || q.type === 'circuit-design',
  },
  { id: 'design', label: 'Design', match: (q) => q.type === 'design' || q.skill === 'design' },
  { id: 'debugging', label: 'Debugging', match: (q) => q.type === 'debugging' || q.skill === 'debugging' },
  { id: 'viva', label: 'Viva', match: (q) => q.type === 'viva' },
  { id: 'mcq', label: 'MCQ', match: (q) => q.type === 'mcq' },
  { id: 'exam', label: 'Exam / Long', match: (q) => q.type === 'exam' },
  { id: 'component-selection', label: 'Component / Class selection', match: (q) => q.type === 'component-selection' },
  { id: 'whatif', label: 'What-if', match: (q) => q.type === 'whatif' },
]

export function QuestionBank({ questions }: { questions: Question[] }) {
  const [level, setLevel] = useState<'all' | DifficultyLevel>('all')
  const [type, setType] = useState<TypeFilter>('all')
  const [prov, setProv] = useState<ProvFilter>('all')
  const [marks, setMarks] = useState<'all' | '1-2' | '3-4' | '5+'>('all')
  const [search, setSearch] = useState('')
  const [topic, setTopic] = useState<'all' | string>('all')

  const topicOptions = useMemo(() => {
    const ids = Array.from(new Set(questions.map((q) => q.topicId)))
    return ids
      .map((id) => ({ id, label: UNIT1.topics.find((t) => t.id === id)?.shortTitle ?? id }))
      .sort((a, b) => a.id.localeCompare(b.id))
  }, [questions])
  const [open, setOpen] = useState<Record<string, boolean>>({})
  const [showSol, setShowSol] = useState<Record<string, boolean>>({})

  const filtered = useMemo(() => {
    const group = TYPE_GROUPS.find((g) => g.id === type)
    return questions.filter((q) => {
      if (topic !== 'all' && q.topicId !== topic) return false
      if (level !== 'all' && q.level !== level) return false
      if (group && !group.match(q)) return false
      if (prov !== 'all' && q.provenance !== prov) return false
      if (marks === '1-2' && q.marks > 2) return false
      if (marks === '3-4' && (q.marks < 3 || q.marks > 4)) return false
      if (marks === '5+' && q.marks < 5) return false
      if (search.trim()) {
        const s = search.trim().toLowerCase()
        const hay = `${q.prompt} ${q.action} ${q.skill} ${q.engineeringExplanation}`.toLowerCase()
        if (!hay.includes(s)) return false
      }
      return true
    })
  }, [questions, topic, level, type, prov, marks, search])

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const q of questions) c[q.type] = (c[q.type] ?? 0) + 1
    return c
  }, [questions])

  return (
    <div>
      <div className="row tight mb1">
        {Object.entries(counts).map(([k, v]) => (
          <span className="badge" key={k}>
            {QUESTION_TYPE_LABEL[k as QuestionType]} · {v}
          </span>
        ))}
        <span className="badge marks">Total {questions.length}</span>
      </div>

      <div className="filters">
        {topicOptions.length > 1 && (
          <div className="field">
            <label htmlFor="f-topic">Topic</label>
            <select id="f-topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="all">All topics</option>
              {topicOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="field">
          <label htmlFor="f-type">Type</label>
          <select id="f-type" value={type} onChange={(e) => setType(e.target.value as TypeFilter)}>
            {TYPE_GROUPS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-level">Difficulty</label>
          <select
            id="f-level"
            value={level}
            onChange={(e) => setLevel(e.target.value as 'all' | DifficultyLevel)}
          >
            <option value="all">All levels</option>
            {([1, 2, 3, 4, 5] as DifficultyLevel[]).map((l) => (
              <option key={l} value={l}>
                Level {l}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-marks">Marks</label>
          <select
            id="f-marks"
            value={marks}
            onChange={(e) => setMarks(e.target.value as typeof marks)}
          >
            <option value="all">Any</option>
            <option value="1-2">1–2</option>
            <option value="3-4">3–4</option>
            <option value="5+">5 and above</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-prov">Provenance</label>
          <select
            id="f-prov"
            value={prov}
            onChange={(e) => setProv(e.target.value as ProvFilter)}
          >
            <option value="all">All</option>
            <option value="source">Source-derived</option>
            <option value="insight">Engineering Practice</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="f-search">Search</label>
          <input
            id="f-search"
            type="text"
            placeholder="e.g. temperature, maintenance"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <p className="small faint mb1">
        Showing {filtered.length} of {questions.length} questions.
      </p>

      {filtered.length === 0 && (
        <div className="empty">No questions match these filters. Widen the filter set.</div>
      )}

      {filtered.map((q) => (
        <div className="qcard" key={q.id}>
          <div className="qcard-head">
            <span className="badge">{QUESTION_TYPE_LABEL[q.type]}</span>
            <span className={`badge level${q.level}`}>L{q.level}</span>
            <span className="badge marks">{q.marks} mark{q.marks === 1 ? '' : 's'}</span>
            <span className="badge">{q.action}</span>
            <SourceBadge
              p={q.provenance}
              label={q.provenance === 'source' ? 'Source-derived' : 'Engineering Practice'}
            />
          </div>

          <p className="prompt">{q.prompt}</p>

          <div className="row tight">
            <button
              className="btn sm ghost"
              onClick={() => setOpen((o) => ({ ...o, [q.id]: !o[q.id] }))}
            >
              {open[q.id] ? 'Hide hint' : 'Hint'}
            </button>
            <button
              className="btn sm"
              onClick={() => setShowSol((s) => ({ ...s, [q.id]: !s[q.id] }))}
            >
              {showSol[q.id] ? 'Hide solution' : 'Full solution'}
            </button>
          </div>

          {open[q.id] && <div className="hintbox mt1">Hint: {q.hint}</div>}

          {showSol[q.id] && (
            <div className="reveal">
              <dl>
                {q.solution.map((s, k) => (
                  <div key={k} style={{ marginBottom: '0.5rem' }}>
                    <dt>{s.label}</dt>
                    <dd>{s.content}</dd>
                  </div>
                ))}
              </dl>
              {q.marking && (
                <>
                  <div className="block-kind mb1 mt2">Marking scheme</div>
                  <ul className="bullets">
                    {q.marking.map((m, k) => (
                      <li key={k}>{m}</li>
                    ))}
                  </ul>
                </>
              )}
              {q.type === 'mcq' && (
                <p className="small">
                  <strong>Key:</strong> ({q.answerId}){' '}
                  {q.options?.find((o) => o.id === q.answerId)?.text}
                </p>
              )}
              {q.followUps && q.followUps.length > 0 && (
                <>
                  <div className="block-kind mb1 mt2">Follow-up chain</div>
                  {q.followUps.map((f, k) => (
                    <div key={k} className="small" style={{ marginBottom: '0.5rem' }}>
                      <div>
                        <strong>Teacher:</strong> {f.teacher}
                      </div>
                      <div className="muted">
                        <strong>Expected:</strong> {f.expected}
                      </div>
                    </div>
                  ))}
                </>
              )}
              <div className="callout mt1">
                <strong>Engineering explanation.</strong> {q.engineeringExplanation}
              </div>
              <div className="srcref">{LEVEL_LABEL[q.level]}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
