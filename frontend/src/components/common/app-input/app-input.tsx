import {Component, Host, h, } from '@stencil/core';

@Component({
  tag: 'app-input',
  styleUrl: 'app-input.scss',
  shadow: true,
})
export class AppInput {

  render() {
    return (
      <Host>
        <slot />
      </Host>
    );
  }

}
