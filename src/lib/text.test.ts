import { generateText } from './text.ts'
import { HOME_ROW_WORDS, QUOTES } from './words.ts'

const base = { count: 50, punctuation: false, numbers: false, seed: 123 } as const

describe('generateText', () => {
  it('is deterministic for a seed', () => {
    const a = generateText({ ...base, source: 'words' })
    const b = generateText({ ...base, source: 'words' })
    const c = generateText({ ...base, source: 'words', seed: 124 })
    expect(a).toBe(b)
    expect(a).not.toBe(c)
  })

  it('produces exactly `count` single-spaced words', () => {
    const text = generateText({ ...base, source: 'words' })
    expect(text.split(' ')).toHaveLength(50)
    expect(text).not.toMatch(/\s{2,}|^\s|\s$/)
  })

  it('home row text only uses a s d f j k l ; and space', () => {
    const text = generateText({ ...base, source: 'home-row', count: 300 })
    expect(text).toMatch(/^[asdfjkl; ]+$/)
    expect(HOME_ROW_WORDS.every((w) => /^[asdfjkl;]+$/.test(w))).toBe(true)
  })

  it('adds capitals and sentence punctuation when asked', () => {
    const text = generateText({ ...base, source: 'words', punctuation: true, count: 200 })
    expect(text[0]).toMatch(/[A-Z]/)
    expect(text.endsWith('.')).toBe(true)
    expect(text).toMatch(/[.,?!;:] /)
  })

  it('mixes in numbers when asked', () => {
    const text = generateText({ ...base, source: 'words', numbers: true, count: 200 })
    expect(text).toMatch(/\b\d+\b/)
  })

  it('builds quote text from whole quotes', () => {
    const text = generateText({ ...base, source: 'quote', count: 20 })
    expect(text.split(' ').length).toBeGreaterThanOrEqual(20)
    expect(QUOTES.some((q) => text.startsWith(q))).toBe(true)
  })
})
