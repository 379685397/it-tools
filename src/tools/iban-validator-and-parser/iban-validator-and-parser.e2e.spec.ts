import { type Page, expect, test } from '@playwright/test';

async function extractIbanInfo({ page }: { page: Page }) {
  const itemsLines = await page
    .locator('.c-key-value-list__item').all();

  return await Promise.all(
    itemsLines.map(async item => [
      (await item.locator('.c-key-value-list__key').textContent() ?? '').trim(),
      (await item.locator('.c-key-value-list__value').textContent() ?? '').trim(),
    ]),
  );
}

test.describe('Tool - Iban validator and parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iban-validator-and-parser');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('IBAN验证器和解析器 - IT-Tools');
  });

  test('iban info are extracted from a valid iban', async ({ page }) => {
    await page.getByTestId('iban-input').fill('DE89370400440532013000');

    const ibanInfo = await extractIbanInfo({ page });

    expect(ibanInfo).toEqual([
      ['IBAN 是否有效？', '是'],
      ['是否为 QR-IBAN？', '否'],
      ['国家代码', 'DE'],
      ['BBAN', '370400440532013000'],
      ['友好格式', 'DE89 3704 0044 0532 0130 00'],
    ]);
  });

  test('invalid iban errors are displayed', async ({ page }) => {
    await page.getByTestId('iban-input').fill('FR7630006060011234567890189');

    const ibanInfo = await extractIbanInfo({ page });

    expect(ibanInfo).toEqual([
      ['IBAN 是否有效？', '否'],
      ['IBAN 错误', '银行/分行账号校验和不正确 IBAN 校验和不正确'],
      ['是否为 QR-IBAN？', '否'],
      ['国家代码', '不适用'],
      ['BBAN', '不适用'],
      ['友好格式', 'FR76 3000 6060 0112 3456 7890 189'],
    ]);
  });
});
