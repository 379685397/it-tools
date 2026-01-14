import { expect, test } from '@playwright/test';

test.describe('Date time converter - json to yaml', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/date-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('日期时间转换器 - IT-Tools');
  });

  test('Format is auto detected from a date and the date is correctly converted', async ({ page }) => {
    const initialFormat = await page.getByTestId('date-time-converter-format-select').innerText();
    expect(initialFormat.trim()).toEqual('时间戳（毫秒）');

    await page.getByTestId('date-time-converter-input').fill('2023-04-12T23:10:24+02:00');

    const detectedFormat = await page.getByTestId('date-time-converter-format-select').innerText();
    expect(detectedFormat.trim()).toEqual('ISO 8601');

    expect((await page.getByTestId('jsLocale').inputValue()).trim()).toEqual(
      'Wed Apr 12 2023 23:10:24 GMT+0200 (Central European Summer Time)',
    );
    expect((await page.getByTestId('iso8601').inputValue()).trim()).toEqual('2023-04-12T23:10:24+02:00');
    expect((await page.getByTestId('iso9075').inputValue()).trim()).toEqual('2023-04-12 23:10:24');
    expect((await page.getByTestId('unix').inputValue()).trim()).toEqual('1681333824');
    expect((await page.getByTestId('rfc7231').inputValue()).trim()).toEqual('Wed, 12 Apr 2023 21:10:24 GMT');
    expect((await page.getByTestId('rfc3339').inputValue()).trim()).toEqual('2023-04-12T23:10:24+02:00');
    expect((await page.getByTestId('timestamp').inputValue()).trim()).toEqual('1681333824000');
    expect((await page.getByTestId('utc').inputValue()).trim()).toEqual('Wed, 12 Apr 2023 21:10:24 GMT');
    expect((await page.getByTestId('mongoObjectId').inputValue()).trim()).toEqual('64371e400000000000000000');
    expect((await page.getByTestId('excel').inputValue()).trim()).toEqual('45028.88222222222');
  });
});
