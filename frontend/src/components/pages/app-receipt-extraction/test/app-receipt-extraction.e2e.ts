import { newE2EPage } from '@stencil/core/testing';

describe('app-receipt-extraction', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-receipt-extraction></app-receipt-extraction>');

    const element = await page.find('app-receipt-extraction');
    expect(element).toHaveClass('hydrated');
  });
});
