import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createSession, DEFAULT_CONFIG, sessionReducer } from '../lib/session.ts'
import { expectNoAxeViolations } from '../test/axe.ts'
import { Announcer } from './Announcer.tsx'
import { Keyboard } from './Keyboard.tsx'
import { Results } from './Results.tsx'
import { Segmented } from './Segmented.tsx'
import { WpmChart } from './WpmChart.tsx'

describe('Keyboard', () => {
  it('is hidden from assistive tech and reflects pressed / next / shift state', () => {
    const { container } = render(
      <Keyboard
        pressed={new Set(['KeyA', 'ShiftLeft'])}
        next={{ code: 'KeyP', shift: true, shiftCode: 'ShiftLeft' }}
      />,
    )
    const kb = container.querySelector('.keyboard')!
    expect(kb).toHaveAttribute('aria-hidden', 'true')
    expect(kb.querySelector('[data-code="KeyA"]')).toHaveAttribute('data-pressed')
    expect(kb.querySelector('[data-code="KeyP"]')).toHaveAttribute('data-next')
    expect(kb.querySelector('[data-code="ShiftLeft"]')).toHaveAttribute('data-next')
    // Shift held: the shifted legend becomes active.
    expect(kb.querySelector('[data-code="Digit1"] .keycap-shift')).toHaveAttribute('data-active')
  })

  it('renders a heat map for mistakes', () => {
    const { container } = render(<Keyboard heat={{ KeyE: 1, KeyR: 0.5 }} />)
    expect(container.querySelector('[data-code="KeyE"]')).toHaveAttribute('data-heat')
    expect(container.querySelector('[data-code="KeyQ"]')).not.toHaveAttribute('data-heat')
  })
})

describe('Segmented', () => {
  it('is a labelled native radio group', async () => {
    const onChange = vi.fn<(v: number) => void>()
    const user = userEvent.setup()
    const { container } = render(
      <Segmented
        legend="Duration"
        value={15}
        onChange={onChange}
        options={[
          { value: 15, label: '15s', srLabel: '15 seconds' },
          { value: 30, label: '30s', srLabel: '30 seconds' },
        ]}
      />,
    )
    expect(screen.getByRole('group', { name: 'Duration' })).toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: '30 seconds' }))
    expect(onChange).toHaveBeenCalledWith(30)
    await expectNoAxeViolations(container)
  })
})

describe('Announcer', () => {
  it('is a polite live region and re-announces identical text', () => {
    const { rerender } = render(<Announcer message={{ text: '10 seconds left', id: 1 }} />)
    const region = document.querySelector('output')!
    expect(region).toHaveAttribute('aria-live', 'polite')
    const first = region.textContent
    rerender(<Announcer message={{ text: '10 seconds left', id: 2 }} />)
    expect(region.textContent).not.toBe(first)
    expect(region.textContent?.trim()).toBe('10 seconds left')
  })
})

describe('WpmChart', () => {
  it('asks for more data with fewer than two samples', () => {
    render(<WpmChart samples={[]} />)
    expect(screen.getByText(/at least two seconds/)).toBeInTheDocument()
  })

  it('exposes a text alternative and a data table', async () => {
    const samples = [1, 2, 3].map((second) => ({
      second,
      wpm: 40 + second,
      raw: 50,
      errors: second === 2 ? 1 : 0,
      keystrokes: second * 4,
      totalErrors: second >= 2 ? 1 : 0,
    }))
    const { container } = render(<WpmChart samples={samples} />)
    const img = screen.getByRole('img', { name: /Words per minute over time/ })
    expect(img).toHaveAccessibleName(/peaked at 43 words per minute/)
    expect(screen.getByRole('table', { name: /each second/ })).toBeInTheDocument()
    await expectNoAxeViolations(container)
  })
})

describe('Results', () => {
  it('lists the most-missed keys in text, not only on the heat map', () => {
    let s = createSession({ ...DEFAULT_CONFIG, mode: 'words', wordCount: 5 }, 3)
    const wrong = s.target[0] === 'x' ? 'y' : 'x'
    s = sessionReducer(s, { type: 'input', value: wrong, now: 0 })
    s = sessionReducer(s, { type: 'input', value: `${wrong}${s.target.slice(1)}`, now: 4000 })
    expect(s.phase).toBe('finished')
    render(
      <Results
        state={s}
        previousBest={undefined}
        reducedMotion
        onNext={() => {}}
        onRepeat={() => {}}
      />,
    )
    expect(screen.getByText(/Most missed/)).toHaveTextContent(`${s.target[0]}`)
    expect(screen.getByRole('heading', { name: 'Results' })).toHaveFocus()
  })
})
