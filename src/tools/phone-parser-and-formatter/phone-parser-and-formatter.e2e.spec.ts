import { expect, test } from '@playwright/test';

test.describe('Tool - Phone parser and formatter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/phone-parser-and-formatter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('电话分析器和格式化程序 - IT-Tools');
  });
});
