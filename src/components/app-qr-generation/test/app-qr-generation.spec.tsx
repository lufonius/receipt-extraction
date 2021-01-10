import { newSpecPage } from '@stencil/core/testing';
import { AppQrGeneration } from '../app-qr-generation';

describe('app-qr', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppQrGeneration],
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
