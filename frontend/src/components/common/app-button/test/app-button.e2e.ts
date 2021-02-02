import { newE2EPage } from '@stencil/core/testing';

describe('app-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<app-button></app-button>');

    const element = await page.find('app-button');
    expect(element).toHaveClass('hydrated');
  });
});
