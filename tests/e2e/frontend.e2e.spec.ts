import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can go on homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/Payload Website Template/)

    const heading = page.locator('h1').first()

    await expect(heading).toHaveText('Payload Website Template')
  })

  test('WhatsApp button is present and functional', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Check if WhatsApp button exists
    const whatsappButton = page.locator('a[href*="wa.me"]')
    await expect(whatsappButton).toBeVisible()

    // Check if button has correct styling
    await expect(whatsappButton).toHaveClass(/bg-green-500/)
    await expect(whatsappButton).toHaveClass(/rounded-full/)

    // Check if button opens WhatsApp link in new tab
    const href = await whatsappButton.getAttribute('href')
    expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/)
    expect(href).toContain('target="_blank"')
  })
})
