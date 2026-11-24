import { createRng, pick } from './random.ts'
import { COMMON_WORDS, HOME_ROW_WORDS, PUNCTUATION_SUFFIXES, QUOTES } from './words.ts'

export type TextSource = 'words' | 'home-row' | 'quote'

export interface TextOptions {
  source: TextSource
  /** Number of words to generate (ignored for quotes, which repeat until long enough). */
  count: number
  punctuation: boolean
  numbers: boolean
  seed: number
}

export const SOURCE_LABELS: Record<TextSource, string> = {
  words: 'Common words',
  'home-row': 'Home row',
  quote: 'Quotes',
}

function capitalise(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

/** Generates practice text deterministically from a seed. Words are single-space separated. */
export function generateText({ source, count, punctuation, numbers, seed }: TextOptions): string {
  const rng = createRng(seed)
  const n = Math.max(1, Math.floor(count))

  if (source === 'quote') {
    const parts: string[] = []
    let words = 0
    while (words < n) {
      const quote = pick(rng, QUOTES)
      parts.push(quote)
      words += quote.split(' ').length
    }
    return parts.join(' ')
  }

  const pool: readonly string[] = source === 'home-row' ? HOME_ROW_WORDS : COMMON_WORDS
  const out: string[] = []
  let startOfSentence = true
  for (let i = 0; i < n; i++) {
    let word: string
    if (numbers && rng() < 0.12) {
      word = String(Math.floor(rng() * (rng() < 0.5 ? 100 : 10000)))
    } else {
      word = pick(rng, pool)
    }
    // Avoid immediate repeats; they feel broken.
    if (out.length > 0 && out[out.length - 1] === word) word = pick(rng, pool)

    if (punctuation && source === 'words') {
      if (startOfSentence) word = capitalise(word)
      startOfSentence = false
      if (i === n - 1) {
        word += '.'
      } else if (rng() < 0.14) {
        const mark = pick(rng, PUNCTUATION_SUFFIXES)
        word += mark
        startOfSentence = mark === '.' || mark === '?' || mark === '!'
      }
    }
    out.push(word)
  }
  return out.join(' ')
}
