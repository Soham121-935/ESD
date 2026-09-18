import type { StudyMode } from '../types'
import { MODE_LABEL } from '../types'

const ORDER: StudyMode[] = ['beginner', 'intermediate', 'exam']

export function ModeSwitcher({
  mode,
  onChange,
}: {
  mode: StudyMode
  onChange: (m: StudyMode) => void
}) {
  return (
    <div className="seg" role="group" aria-label="Study mode">
      {ORDER.map((m) => (
        <button
          key={m}
          className={mode === m ? 'on' : ''}
          onClick={() => onChange(m)}
          aria-pressed={mode === m}
        >
          {MODE_LABEL[m]}
        </button>
      ))}
    </div>
  )
}
