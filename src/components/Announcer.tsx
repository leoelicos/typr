/**
 * Polite live region. `id` alternates a trailing no-break space so that
 * repeating identical text (e.g. two equal results) is still announced.
 */
export function Announcer({ message }: { message: { text: string; id: number } | null }) {
  const text = message ? `${message.text}${message.id % 2 ? '\u00a0' : ''}` : ''
  return (
    <output id="announcer" className="sr-only" aria-live="polite" aria-atomic="true">
      {text}
    </output>
  )
}
