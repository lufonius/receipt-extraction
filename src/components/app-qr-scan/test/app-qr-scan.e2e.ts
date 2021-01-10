import { newE2EPage } from '@stencil/core/testing';

describe('app-qr-scan', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-qr-scan></app-qr-scan>');

    const element = await page.find('app-qr-scan');
    expect(element).toHaveClass('hydrated');
  });
});
