import { newE2EPage } from '@stencil/core/testing';

describe('app-crop', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-crop></app-crop>');

    const element = await page.find('app-crop');
    expect(element).toHaveClass('hydrated');
  });
});
