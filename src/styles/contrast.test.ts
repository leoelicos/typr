/** Parses tokens.css and checks every text pair against WCAG 2.2 AA. */
import css from './tokens.css?raw'

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`)
  if (start < 0) throw new Error(`Missing block ${selector}`)
  const body = css.slice(start, css.indexOf('}', start))
  const vars: Record<string, string> = {}
  for (const m of body.matchAll(/(--[\w-]+):\s*(#[0-9a-f]{6})/gi)) vars[m[1]!] = m[2]!
  return vars
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].toSorted((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

const themes = ['dark', 'light'] as const
const accents = ['ember', 'lagoon', 'iris', 'lime'] as const
const backgrounds = ['--bg', '--surface', '--surface-2'] as const

describe.each(themes)('%s theme contrast', (theme) => {
  const t = block(`:root[data-theme='${theme}']`)

  it.each(['--text', '--text-muted', '--text-dim', '--error', '--success'])(
    '%s meets 4.5:1 on every surface',
    (fg) => {
      for (const bg of backgrounds) expect(contrast(t[fg]!, t[bg]!)).toBeGreaterThanOrEqual(4.5)
    },
  )

  it('control borders meet 3:1 non-text contrast', () => {
    expect(contrast(t['--line-strong']!, t['--bg']!)).toBeGreaterThanOrEqual(3)
    expect(contrast(t['--line-strong']!, t['--surface']!)).toBeGreaterThanOrEqual(3)
  })

  it.each(accents)('accent "%s" works as text and as a button fill', (accent) => {
    const a = block(`:root[data-theme='${theme}'][data-accent='${accent}']`)['--accent']!
    for (const bg of backgrounds) expect(contrast(a, t[bg]!)).toBeGreaterThanOrEqual(4.5)
    expect(contrast(t['--on-accent']!, a)).toBeGreaterThanOrEqual(4.5)
  })
})
