interface Props {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (v: number) => void
  note?: string
  /** Optional formatter for the displayed value. */
  format?: (v: number) => string
}

export function ParameterSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  note,
  format,
}: Props) {
  return (
    <div className="slider">
      <label htmlFor={`sl-${label}`}>{label}</label>
      <span className="val">
        {format ? format(value) : value}
        {unit ? ` ${unit}` : ''}
      </span>
      <input
        id={`sl-${label}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {note && <span className="range-note">{note}</span>}
    </div>
  )
}
