/** ANSI US keyboard, as data. Widths are in key units (1u = a letter key). */
export type Finger =
  | 'l-pinky'
  | 'l-ring'
  | 'l-middle'
  | 'l-index'
  | 'r-index'
  | 'r-middle'
  | 'r-ring'
  | 'r-pinky'
  | 'thumb'

export interface KeyDef {
  code: string
  /** Primary legend (what is printed on the cap). */
  label: string
  /** Legend shown while Shift is held, if different. */
  shiftLabel?: string
  /** Character produced without Shift (single char keys only). */
  char?: string
  /** Character produced with Shift. */
  shiftChar?: string
  /** Human name for assistive tech. */
  name: string
  width: number
  finger: Finger
  /** F and J have tactile homing bumps. */
  homing?: boolean
  /** Modifier / non-character keys render muted. */
  modifier?: boolean
}

type Spec = [code: string, char: string, shiftChar: string, finger: Finger]

const NAMED: Record<string, string> = {
  '`': 'backtick',
  '~': 'tilde',
  '-': 'minus',
  _: 'underscore',
  '=': 'equals',
  '+': 'plus',
  '[': 'left bracket',
  '{': 'left brace',
  ']': 'right bracket',
  '}': 'right brace',
  '\\': 'backslash',
  '|': 'pipe',
  ';': 'semicolon',
  ':': 'colon',
  "'": 'apostrophe',
  '"': 'quote',
  ',': 'comma',
  '<': 'less than',
  '.': 'full stop',
  '>': 'greater than',
  '/': 'slash',
  '?': 'question mark',
  '!': 'exclamation mark',
  '@': 'at',
  '#': 'hash',
  $: 'dollar',
  '%': 'percent',
  '^': 'caret',
  '&': 'ampersand',
  '*': 'asterisk',
  '(': 'left parenthesis',
  ')': 'right parenthesis',
}

export function charName(char: string): string {
  if (char === ' ') return 'space'
  return NAMED[char] ?? char.toUpperCase()
}

function charKey([code, char, shiftChar, finger]: Spec): KeyDef {
  const isLetter = /^[a-z]$/.test(char)
  const key: KeyDef = {
    code,
    label: isLetter ? char.toUpperCase() : char,
    char,
    shiftChar,
    name: charName(char),
    width: 1,
    finger,
  }
  if (!isLetter) key.shiftLabel = shiftChar
  if (code === 'KeyF' || code === 'KeyJ') key.homing = true
  return key
}

function mod(
  code: string,
  label: string,
  name: string,
  width: number,
  finger: Finger,
  char?: string,
): KeyDef {
  const key: KeyDef = { code, label, name, width, finger, modifier: char === undefined }
  if (char !== undefined) key.char = char
  return key
}

const L = (f: 'pinky' | 'ring' | 'middle' | 'index') => `l-${f}` as const
const R = (f: 'pinky' | 'ring' | 'middle' | 'index') => `r-${f}` as const

export const KEYBOARD_ROWS: readonly (readonly KeyDef[])[] = [
  [
    ...(
      [
        ['Backquote', '`', '~', L('pinky')],
        ['Digit1', '1', '!', L('pinky')],
        ['Digit2', '2', '@', L('ring')],
        ['Digit3', '3', '#', L('middle')],
        ['Digit4', '4', '$', L('index')],
        ['Digit5', '5', '%', L('index')],
        ['Digit6', '6', '^', R('index')],
        ['Digit7', '7', '&', R('index')],
        ['Digit8', '8', '*', R('middle')],
        ['Digit9', '9', '(', R('ring')],
        ['Digit0', '0', ')', R('pinky')],
        ['Minus', '-', '_', R('pinky')],
        ['Equal', '=', '+', R('pinky')],
      ] satisfies Spec[]
    ).map(charKey),
    mod('Backspace', '⌫', 'Backspace', 2, R('pinky')),
  ],
  [
    mod('Tab', '⇥', 'Tab', 1.5, L('pinky')),
    ...(
      [
        ['KeyQ', 'q', 'Q', L('pinky')],
        ['KeyW', 'w', 'W', L('ring')],
        ['KeyE', 'e', 'E', L('middle')],
        ['KeyR', 'r', 'R', L('index')],
        ['KeyT', 't', 'T', L('index')],
        ['KeyY', 'y', 'Y', R('index')],
        ['KeyU', 'u', 'U', R('index')],
        ['KeyI', 'i', 'I', R('middle')],
        ['KeyO', 'o', 'O', R('ring')],
        ['KeyP', 'p', 'P', R('pinky')],
        ['BracketLeft', '[', '{', R('pinky')],
        ['BracketRight', ']', '}', R('pinky')],
      ] satisfies Spec[]
    ).map(charKey),
    { ...charKey(['Backslash', '\\', '|', R('pinky')]), width: 1.5 },
  ],
  [
    mod('CapsLock', '⇪', 'Caps Lock', 1.75, L('pinky')),
    ...(
      [
        ['KeyA', 'a', 'A', L('pinky')],
        ['KeyS', 's', 'S', L('ring')],
        ['KeyD', 'd', 'D', L('middle')],
        ['KeyF', 'f', 'F', L('index')],
        ['KeyG', 'g', 'G', L('index')],
        ['KeyH', 'h', 'H', R('index')],
        ['KeyJ', 'j', 'J', R('index')],
        ['KeyK', 'k', 'K', R('middle')],
        ['KeyL', 'l', 'L', R('ring')],
        ['Semicolon', ';', ':', R('pinky')],
        ['Quote', "'", '"', R('pinky')],
      ] satisfies Spec[]
    ).map(charKey),
    mod('Enter', '⏎', 'Enter', 2.25, R('pinky')),
  ],
  [
    mod('ShiftLeft', '⇧', 'Left Shift', 2.25, L('pinky')),
    ...(
      [
        ['KeyZ', 'z', 'Z', L('pinky')],
        ['KeyX', 'x', 'X', L('ring')],
        ['KeyC', 'c', 'C', L('middle')],
        ['KeyV', 'v', 'V', L('index')],
        ['KeyB', 'b', 'B', L('index')],
        ['KeyN', 'n', 'N', R('index')],
        ['KeyM', 'm', 'M', R('index')],
        ['Comma', ',', '<', R('middle')],
        ['Period', '.', '>', R('ring')],
        ['Slash', '/', '?', R('pinky')],
      ] satisfies Spec[]
    ).map(charKey),
    mod('ShiftRight', '⇧', 'Right Shift', 2.75, R('pinky')),
  ],
  [
    mod('ControlLeft', 'ctrl', 'Left Control', 1.25, L('pinky')),
    mod('MetaLeft', '◆', 'Left Meta', 1.25, 'thumb'),
    mod('AltLeft', 'alt', 'Left Alt', 1.25, 'thumb'),
    mod('Space', '', 'Space', 6.25, 'thumb', ' '),
    mod('AltRight', 'alt', 'Right Alt', 1.25, 'thumb'),
    mod('MetaRight', '◆', 'Right Meta', 1.25, 'thumb'),
    mod('ContextMenu', '☰', 'Menu', 1.25, 'thumb'),
    mod('ControlRight', 'ctrl', 'Right Control', 1.25, R('pinky')),
  ],
]

export const ALL_KEYS: readonly KeyDef[] = KEYBOARD_ROWS.flat()

export interface KeyTarget {
  code: string
  shift: boolean
  /** Which Shift to use: the one on the opposite hand (touch-typing convention). */
  shiftCode?: 'ShiftLeft' | 'ShiftRight'
}

const CHAR_MAP: ReadonlyMap<string, KeyTarget> = (() => {
  const map = new Map<string, KeyTarget>()
  for (const key of ALL_KEYS) {
    if (key.char !== undefined && !map.has(key.char))
      map.set(key.char, { code: key.code, shift: false })
    if (key.shiftChar !== undefined && !map.has(key.shiftChar)) {
      const shiftCode = key.finger.startsWith('l-') ? 'ShiftRight' : 'ShiftLeft'
      map.set(key.shiftChar, { code: key.code, shift: true, shiftCode })
    }
  }
  return map
})()

/** Which physical key (and Shift) types a given character on a US layout. */
export function keyForChar(char: string): KeyTarget | undefined {
  return CHAR_MAP.get(char)
}

export const FINGER_LABELS: Record<Finger, string> = {
  'l-pinky': 'Left pinky',
  'l-ring': 'Left ring',
  'l-middle': 'Left middle',
  'l-index': 'Left index',
  'r-index': 'Right index',
  'r-middle': 'Right middle',
  'r-ring': 'Right ring',
  'r-pinky': 'Right pinky',
  thumb: 'Thumbs',
}
