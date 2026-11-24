import axe, { type Result } from 'axe-core'

function format(violations: Result[]): string {
  return violations
    .map(
      (v) =>
        `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(' ')).join('\n  ')}`,
    )
    .join('\n')
}

/**
 * Runs axe-core against a container with WCAG 2.2 A/AA rules. Colour contrast
 * is skipped here (jsdom has no layout/paint) and covered by contrast.test.ts
 * plus the Playwright axe run in a real browser.
 */
export async function expectNoAxeViolations(container: Element = document.body): Promise<void> {
  const results = await axe.run(container, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
    },
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  })
  if (results.violations.length) throw new Error(`axe violations:\n${format(results.violations)}`)
}
