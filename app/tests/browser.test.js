import { test } from '@playwright/test'

test('test browser', async ({ page }) => {
  // point this to wherever you want
  await page.goto('http://localhost:3000/Marcelo-e-Dayse-Miami/7f709383-81f8-43fe-8095-bf66aafb717a')

  // keep browser open
  await page.pause()
})