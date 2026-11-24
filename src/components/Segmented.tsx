import { useId, type ReactNode } from 'react'

export interface SegmentOption<T extends string | number> {
  value: T
  label: ReactNode
  /** Accessible name when the visible label is terse (e.g. "15" -> "15 seconds"). */
  srLabel?: string
}

/** Native radio group styled as a segmented control: arrow keys, labels and forms for free. */
export function Segmented<T extends string | number>({
  legend,
  options,
  value,
  onChange,
  hideLegend = false,
  className,
}: {
  legend: string
  options: readonly SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  hideLegend?: boolean
  className?: string
}) {
  const name = useId()
  return (
    <fieldset className={['segmented', className].filter(Boolean).join(' ')}>
      <legend className={hideLegend ? 'sr-only' : 'segmented-legend'}>{legend}</legend>
      <div className="segmented-track">
        {options.map((o) => (
          <label key={String(o.value)} className="segmented-option">
            <input
              type="radio"
              name={name}
              value={String(o.value)}
              checked={o.value === value}
              onChange={() => onChange(o.value)}
              aria-label={o.srLabel}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function Toggle({
  label,
  checked,
  onChange,
  description,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}) {
  const id = useId()
  return (
    <label className="toggle">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        aria-checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
        aria-describedby={description ? `${id}-d` : undefined}
      />
      <span className="toggle-track" aria-hidden="true">
        <span className="toggle-thumb" />
      </span>
      <span className="toggle-text">
        <span className="toggle-label">{label}</span>
        {description ? (
          <span className="toggle-description" id={`${id}-d`}>
            {description}
          </span>
        ) : null}
      </span>
    </label>
  )
}
