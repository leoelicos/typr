import { AxeBuilder } from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

async function expectAccessible(page: Page) {
  // Let entrance animations settle so axe measures final colours, not mid-fade.
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)
        .map((a) => a.finished),
    ),
  )
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
  expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([])
}

async function prompt(page: Page): Promise<string> {
  return page
    .locator('.typing-text .char')
    .evaluateAll((els) => els.map((e) => e.textContent).join(''))
}

test('loads with the typing box focused and no axe violations', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Find your flow.')
  await expect(page.getByLabel(/Typing test/)).toBeFocused()
  await expectAccessible(page)
})

test('skip link is the first tab stop and jumps to the test', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard navigation test')
  await page.goto('/')
  const firstFocusable = await page.evaluate(
    () => document.querySelector('a[href], button, input, [tabindex="0"]')?.textContent,
  )
  expect(firstFocusable).toBe('Skip to typing test')
  const skip = page.getByRole('link', { name: 'Skip to typing test' })
  await skip.focus()
  await expect(skip).toBeInViewport()
  await page.keyboard.press('Enter')
  await expect(page.getByLabel(/Typing test/)).toBeFocused()
})

test('a full 10-word test produces results, history and stays accessible', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('radio', { name: 'Words', exact: true }).click()
  await page.getByRole('radio', { name: '10 words' }).click()
  await page.getByLabel(/Typing test/).focus()
  const text = await prompt(page)
  expect(text.split(' ')).toHaveLength(10)
  await page.keyboard.type(text, { delay: 15 })

  const results = page.getByRole('region', { name: 'Results' })
  await expect(results).toBeVisible()
  await expect(results.getByRole('heading', { name: 'Results' })).toBeFocused()
  await expect(results.getByText('100.0%')).toBeVisible()
  await expect(page.locator('#announcer')).toContainText('Test complete.')
  await expect(page.getByRole('table', { name: /Last 1 test/ })).toBeVisible()
  await expectAccessible(page)

  // Reload: history persists locally.
  await page.reload()
  await expect(page.getByRole('table', { name: /Last 1 test/ })).toBeVisible()
})

test('Tab leaves the typing box (no keyboard trap) and Escape restarts', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'keyboard navigation test')
  await page.goto('/')
  const input = page.getByLabel(/Typing test/)
  const before = await prompt(page)
  await page.keyboard.type(before.slice(0, 3))
  await page.keyboard.press('Escape')
  await expect(input).toHaveValue('')
  expect(await prompt(page)).not.toBe(before)
  await page.keyboard.press('Tab')
  await expect(input).not.toBeFocused()
})

test('settings dialog is accessible and theme switch keeps contrast', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Settings' }).click()
  const dialog = page.getByRole('dialog', { name: 'Settings' })
  await expect(dialog).toBeVisible()
  await expectAccessible(page)
  await dialog.getByRole('radio', { name: 'Light' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expectAccessible(page)
})
