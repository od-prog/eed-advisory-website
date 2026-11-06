import { expect, test } from '@playwright/test'

test.skip(process.env.E2E !== '1', 'Requires a running CMS (set E2E=1 together with the web env vars to enable)')

test('main content stays visible while animations run', async ({ page }) => {
  await page.goto('/')
  const heading = page.locator('main').getByRole('heading').first()
  await expect(heading).toBeVisible()
  await expect(heading).not.toBeEmpty()
})

test('reduced motion does not hide content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const heading = page.locator('main').getByRole('heading').first()
  await expect(heading).toBeVisible()
})

test('header animation is initialised exactly once per navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-observer-intercept]')).toHaveCount(1)
  await page.locator('header nav a').first().click()
  await expect(page.locator('[data-observer-intercept]')).toHaveCount(1)
})

test('motion components receive final visibility without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto('/')
  const revealElement = page.locator('[data-motion]').first()
  if ((await revealElement.count()) === 0) {
    test.skip()
  }
  await expect(revealElement).toBeVisible()
  await context.close()
})
