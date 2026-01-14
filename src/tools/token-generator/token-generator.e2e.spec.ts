import { expect, test } from '@playwright/test';

test.describe('Tool - Token generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/token-generator');
  });

  test('Has title', async ({ page }) => {
    await expect(page).toHaveTitle('Token 生成器 - IT-Tools');
  });

  test('New token on refresh', async ({ page }) => {
    const initialToken = await page.getByTestId('token').inputValue();
    await page.getByTestId('refresh').click();
    const newToken = await page.getByTestId('token').inputValue();

    expect(newToken).not.toEqual(initialToken);
  });
});
