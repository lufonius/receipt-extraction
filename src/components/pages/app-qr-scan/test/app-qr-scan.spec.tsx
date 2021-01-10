import { newSpecPage } from '@stencil/core/testing';
import { AppQrScan } from '../app-qr-scan';

describe('app-qr-scan', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppQrScan],
      html: `<app-qr-scan></app-qr-scan>`,
    });
    expect(page.root).toEqualHtml(`
      <app-qr-scan>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </app-qr-scan>
    `);
  });
});
