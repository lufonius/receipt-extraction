import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'app-category-upsert',
  styleUrl: 'app-category-upsert.scss',
  shadow: true,
})
export class AppCategoryUpsert {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
