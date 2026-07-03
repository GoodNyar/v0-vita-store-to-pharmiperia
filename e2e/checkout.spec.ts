import { test, expect } from '@playwright/test'
import { dismissCookieBannerIfVisible, seedCookieConsent } from './helpers/consent'
import { e2eSkipReason, isE2EEnabled, uniqueE2EEmail } from './helpers/env'
import { waitForOrderByEmail } from './helpers/supabase'

test.describe('Checkout critical path', () => {
  test.skip(!isE2EEnabled(), e2eSkipReason())

  test('catalog → cart → checkout → draft order in DB', async ({ page }) => {
    const email = uniqueE2EEmail()

    await seedCookieConsent(page)
    await page.goto('/lv')
    await dismissCookieBannerIfVisible(page)

    const addToCart = page.getByRole('button', { name: 'Pievienot grozam' }).first()
    await expect(addToCart).toBeVisible()
    await addToCart.click()

    await page.goto('/lv/checkout')
    await dismissCookieBannerIfVisible(page)

    await expect(
      page.getByRole('heading', { name: 'Pasūtījuma noformēšana' })
    ).toBeVisible()

    await page.locator('input[name="firstName"]').fill('E2E')
    await page.locator('input[name="lastName"]').fill('Testers')
    await page.locator('input[name="email"]').fill(email)
    await page.locator('input[name="phone"]').fill('+371 20000001')

    await page.getByRole('button', { name: 'Turpināt uz apmaksu' }).click()

    const stripeCheckout = page.locator('#stripe-checkout')
    await expect(stripeCheckout).toBeVisible({ timeout: 45_000 })

    const stripeFrame = stripeCheckout.locator('iframe').first()
    await expect(stripeFrame).toBeAttached({ timeout: 45_000 })

    const order = await waitForOrderByEmail(email, { paymentStatus: 'pending' })
    expect(order.email).toBe(email)
    expect(order.payment_status).toBe('pending')
    expect(order.status).toBe('pending')
    expect(order.order_number).toMatch(/^PH/)
  })
})