import { newSpecPage } from '@stencil/core/testing';
import { AppButton } from '../app-button';

describe('app-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [AppButton],
      html: `<app-button></app-button>`,
    });
    expect(page.root).toEqualHtml(`
      <app-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </app-button>
    `);
  });
});
