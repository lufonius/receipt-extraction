import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'app-receipt-extraction',
  styleUrl: 'app-receipt-extraction.css',
  shadow: true,
})
export class AppReceiptExtraction {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
