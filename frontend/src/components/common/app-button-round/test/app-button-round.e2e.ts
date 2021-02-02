import { newE2EPage } from '@stencil/core/testing';

describe('app-button-round', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-button-round></app-button-round>');

    const element = await page.find('app-button-round');
    expect(element).toHaveClass('hydrated');
  });
});
