import type { CSSProperties } from 'react'
import { KEYBOARD_ROWS, type KeyDef, type KeyTarget } from '../lib/keyboard.ts'
import './Keyboard.css'

const NO_KEYS: ReadonlySet<string> = new Set()

export interface KeyboardProps {
  pressed?: ReadonlySet<string>
  capsLock?: boolean
  next?: KeyTarget | undefined
  fingerColours?: boolean
  /** code -> 0..1 intensity, for the mistakes heat map. */
  heat?: Readonly<Record<string, number>>
  className?: string
}

function Keycap({
  k,
  shifted,
  isPressed,
  isNext,
  heat,
  capsOn,
}: {
  k: KeyDef
  shifted: boolean
  isPressed: boolean
  isNext: boolean
  heat: number | undefined
  capsOn: boolean
}) {
  const legend = shifted && k.shiftLabel ? k.shiftLabel : k.label
  const style = { '--w': k.width, ...(heat ? { '--heat': heat } : {}) } as CSSProperties
  return (
    <span
      className="keycap"
      style={style}
      data-code={k.code}
      data-finger={k.finger}
      data-modifier={k.modifier || undefined}
      data-pressed={isPressed || undefined}
      data-next={isNext || undefined}
      data-heat={heat ? '' : undefined}
    >
      {k.shiftLabel ? (
        <span className="keycap-legend keycap-legend--dual">
          <span className="keycap-shift" data-active={shifted || undefined}>
            {k.shiftLabel}
          </span>
          <span className="keycap-base" data-active={!shifted || undefined}>
            {k.label}
          </span>
        </span>
      ) : (
        <span className="keycap-legend">{legend}</span>
      )}
      {k.homing ? <span className="keycap-homing" /> : null}
      {k.code === 'CapsLock' ? <span className="keycap-led" data-on={capsOn || undefined} /> : null}
    </span>
  )
}

/**
 * Visual-only keyboard. Everything it shows is also exposed as text elsewhere
 * (input description, results summary), so it is hidden from assistive tech.
 */
export function Keyboard({
  pressed = NO_KEYS,
  capsLock = false,
  next,
  fingerColours = false,
  heat,
  className,
}: KeyboardProps) {
  const shifted = pressed.has('ShiftLeft') || pressed.has('ShiftRight')
  return (
    <div
      className={['keyboard', className].filter(Boolean).join(' ')}
      data-fingers={fingerColours || undefined}
      aria-hidden="true"
    >
      <div className="keyboard-frame">
        {KEYBOARD_ROWS.map((row) => (
          <div className="keyboard-row" key={row[0]?.code}>
            {row.map((k) => (
              <Keycap
                key={k.code}
                k={k}
                shifted={shifted}
                capsOn={capsLock}
                isPressed={pressed.has(k.code)}
                isNext={
                  !!next && (next.code === k.code || (next.shift && next.shiftCode === k.code))
                }
                heat={heat?.[k.code]}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
