import { newSpecPage } from '@stencil/core/testing';
import { AppButtonRound } from '../app-button-round';

describe('app-button-round', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppButtonRound],
      html: `<app-button-round></app-button-round>`,
    });
    expect(page.root).toEqualHtml(`
      <app-button-round>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </app-button-round>
    `);
  });
});
