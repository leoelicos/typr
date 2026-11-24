import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.tsx'
import { clearHistory, historyStore } from './lib/history.ts'
import { DEFAULT_SETTINGS, settingsStore, updateTest } from './lib/settings.ts'
import { expectNoAxeViolations } from './test/axe.ts'

function promptText(): string {
  return Array.from(document.querySelectorAll('.typing-text .char'))
    .map((c) => c.textContent)
    .join('')
}

beforeEach(() => {
  settingsStore.set(DEFAULT_SETTINGS)
  clearHistory()
})

describe('App', () => {
  it('renders landmarks, a skip link and focuses the typing input', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Skip to typing test' })).toHaveAttribute(
      'href',
      '#typing-input',
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Find your flow.')
    expect(screen.getByLabelText(/Typing test/)).toHaveFocus()
  })

  it('has no axe violations on load', async () => {
    const { container } = render(<App />)
    await expectNoAxeViolations(container)
  })

  it('marks typed characters correct / incorrect and tracks live stats', async () => {
    const user = userEvent.setup()
    render(<App />)
    const target = promptText()
    const wrong = target[1] === 'x' ? 'y' : 'x'
    await user.keyboard(target[0]! + wrong)

    const chars = document.querySelectorAll('.typing-text .char')
    expect(chars[0]).toHaveAttribute('data-state', 'correct')
    expect(chars[1]).toHaveAttribute('data-state', 'incorrect')
    expect(chars[2]).toHaveAttribute('data-state', 'pending')
    expect(screen.getByText('50%')).toBeInTheDocument()

    // Backspace fixes the char but accuracy remembers the slip.
    await user.keyboard(`{Backspace}${target[1]}`)
    expect(document.querySelectorAll('.typing-text .char')[1]).toHaveAttribute(
      'data-state',
      'correct',
    )
    expect(screen.getByText('67%')).toBeInTheDocument()
  })

  it('describes the upcoming text to screen readers without announcing every key', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText(/Typing test/)
    const target = promptText()
    expect(input).toHaveAccessibleDescription(new RegExp(`^Next: ${target[0]!.toUpperCase()}`))
    await user.keyboard(target[0]!)
    // The live region stays quiet while typing.
    expect(document.getElementById('announcer')).toHaveTextContent('')
  })

  it('Escape starts a fresh test', async () => {
    const user = userEvent.setup()
    render(<App />)
    const before = promptText()
    await user.keyboard(before[0]!)
    await user.keyboard('{Escape}')
    expect(promptText()).not.toBe(before)
    expect(screen.getByLabelText(/Typing test/)).toHaveValue('')
  })

  it('highlights the next key on the on-screen keyboard', async () => {
    render(<App />)
    const target = promptText()
    const next = document.querySelector('.keycap[data-next]')
    expect(next).not.toBeNull()
    expect(next?.textContent?.toLowerCase()).toContain(target[0])
  })

  it('completes a words test, shows results, saves history and announces once', async () => {
    act(() => updateTest({ mode: 'words', wordCount: 10 }))
    const user = userEvent.setup()
    render(<App />)
    const target = promptText()
    expect(target.split(' ')).toHaveLength(10)
    await user.keyboard(target)

    const results = await screen.findByRole('region', { name: 'Results' })
    expect(within(results).getByRole('heading', { name: 'Results' })).toHaveFocus()
    expect(within(results).getByText('100.0%')).toBeInTheDocument()
    expect(within(results).getByText(/First result/)).toBeInTheDocument()
    expect(within(results).getByText(/Flawless/)).toBeInTheDocument()
    expect(historyStore.get()).toHaveLength(1)
    expect(document.getElementById('announcer')).toHaveTextContent(
      /^Test complete\. \d+ words per minute, 100 percent accuracy\./,
    )
    await expectNoAxeViolations(document.body)

    // History table reflects the result.
    const table = screen.getByRole('table', { name: /Last 1 test/ })
    expect(within(table).getAllByRole('row')).toHaveLength(2)

    // Next test returns to typing with focus in the input.
    await user.click(within(results).getByRole('button', { name: /Next test/ }))
    expect(screen.queryByRole('region', { name: 'Results' })).not.toBeInTheDocument()
  })

  it('"Repeat this text" restarts with the identical prompt', async () => {
    act(() => updateTest({ mode: 'words', wordCount: 10 }))
    const user = userEvent.setup()
    render(<App />)
    const target = promptText()
    await user.keyboard(target)
    await user.click(await screen.findByRole('button', { name: /Repeat this text/ }))
    expect(promptText()).toBe(target)
  })

  it('switching test options regenerates text without stealing focus', async () => {
    const user = userEvent.setup()
    render(<App />)
    const words = screen.getByRole('radio', { name: 'Words' })
    await user.click(words)
    expect(words).toBeChecked()
    expect(words).toHaveFocus()
    expect(screen.getByRole('group', { name: 'Length' })).toBeInTheDocument()
    expect(settingsStore.get().test.mode).toBe('words')
  })

  it('home row mode only uses home row keys', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('radio', { name: 'Home row' }))
    expect(promptText()).toMatch(/^[asdfjkl; ]+$/)
    expect(screen.getByRole('checkbox', { name: 'Punctuation' })).toBeDisabled()
  })

  it('opens an accessible settings dialog and applies the theme', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Settings' }))
    const dialog = screen.getByRole('dialog', { name: 'Settings' })
    expect(dialog).toHaveAttribute('open')
    await expectNoAxeViolations(dialog)

    await user.click(within(dialog).getByRole('radio', { name: 'Light' }))
    expect(document.documentElement.dataset['theme']).toBe('light')

    await user.click(within(dialog).getByRole('radio', { name: 'Reduced' }))
    expect(document.documentElement.dataset['motion']).toBe('reduce')

    await user.click(within(dialog).getByRole('switch', { name: 'Show on-screen keyboard' }))
    expect(document.querySelector('.keyboard')).toBeNull()
  })

  it('header theme toggle flips between dark and light', async () => {
    const user = userEvent.setup()
    render(<App />)
    // jsdom matchMedia reports no dark preference, so "system" resolves to light.
    expect(document.documentElement.dataset['theme']).toBe('light')
    await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }))
    expect(document.documentElement.dataset['theme']).toBe('dark')
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument()
  })
})
