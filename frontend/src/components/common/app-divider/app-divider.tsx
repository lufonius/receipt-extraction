import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'app-divider',
  styleUrl: 'app-divider.scss',
  shadow: true,
})
export class AppDivider {

  render() {
    return (
      <Host>< hr /></Host>
    );
  }

}
