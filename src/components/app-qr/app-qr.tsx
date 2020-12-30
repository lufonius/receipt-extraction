import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'app-qr',
  styleUrl: 'app-qr.scss',
  shadow: true,
})
export class AppQr {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );  }

}
