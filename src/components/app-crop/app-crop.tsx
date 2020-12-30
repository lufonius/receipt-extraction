import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'app-crop',
  styleUrl: 'app-crop.css',
  shadow: true,
})
export class AppCrop {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
