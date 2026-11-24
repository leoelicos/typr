import { test, type Page } from '@playwright/test'

/**
 * Regenerates the README screenshots: `npm run screenshots`.
 * Skipped in normal runs.
 */
test.skip(!process.env['SCREENSHOTS'], 'Set SCREENSHOTS=1 to regenerate docs/screenshots')

const out = (name: string) => `docs/screenshots/${name}.png`

async function prompt(page: Page): Promise<string> {
  return page
    .locator('.typing-text .char')
    .evaluateAll((els) => els.map((e) => e.textContent).join(''))
}

test('screenshots', async ({ page }, info) => {
  const theme = info.project.name.includes('light') ? 'light' : 'dark'
  const prefix = info.project.name === 'mobile' ? 'mobile' : theme
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: out(`${prefix}-idle`) })

  const text = await prompt(page)
  // Type a little over a line with one deliberate slip, then hold a key.
  const sample = text.slice(0, 70)
  const typed = `${sample.slice(0, 31)}${sample[31] === 'q' ? 'w' : 'q'}${sample.slice(32)}`
  await page.keyboard.type(typed, { delay: 70 })
  await page.keyboard.down('Shift')
  await page.screenshot({ path: out(`${prefix}-typing`) })
  await page.keyboard.up('Shift')

  if (prefix === 'mobile') return
  await page.getByRole('radio', { name: 'Words', exact: true }).click()
  await page.getByRole('radio', { name: '25 words' }).click()
  await page.getByLabel(/Typing test/).focus()
  const words = await prompt(page)
  let i = 0
  for (const ch of words) {
    // A couple of realistic slips, fixed with Backspace.
    if (i === 40 || i === 95) {
      await page.keyboard.type(ch === 'x' ? 'z' : 'x', { delay: 60 })
      await page.keyboard.press('Backspace')
    }
    await page.keyboard.type(ch, { delay: 55 + ((i * 37) % 60) })
    i++
  }
  await page.getByRole('region', { name: 'Results' }).waitFor()
  await page.waitForTimeout(1600)
  await page.locator('.stage').screenshot({ path: out(`${prefix}-results`) })
})
