import { newSpecPage } from '@stencil/core/testing';
import { AppCrop } from '../app-crop';

describe('app-crop', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppCrop],
      html: `<app-crop></app-crop>`,
    });
    expect(page.root).toEqualHtml(`
      <app-crop>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </app-crop>
    `);
  });
});
