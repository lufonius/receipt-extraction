import { newSpecPage } from '@stencil/core/testing';
import { AppQr } from '../app-qr';

describe('app-qr', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppQr],
      html: `<app-qr></app-qr>`,
    });
    expect(page.root).toEqualHtml(`
      <app-qr>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </app-qr>
    `);
  });
});
