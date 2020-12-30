import { newE2EPage } from '@stencil/core/testing';

describe('app-qr', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-qr></app-qr>');

    const element = await page.find('app-qr');
    expect(element).toHaveClass('hydrated');
  });
});
