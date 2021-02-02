import { newSpecPage } from '@stencil/core/testing';
import { AppReceiptExtraction } from '../app-receipt-extraction';

describe('app-receipt-extraction', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppReceiptExtraction],
      html: `<app-receipt-extraction></app-receipt-extraction>`,
    });
    expect(page.root).toEqualHtml(`
      <app-receipt-extraction>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </app-receipt-extraction>
    `);
  });
});
