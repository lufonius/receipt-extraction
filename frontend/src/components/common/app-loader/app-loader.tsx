import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'app-loader',
  styleUrl: 'app-loader.scss',
  shadow: true,
})
export class AppLoader {

  render() {
    return (
      <Host>
        <div class="loader-wrapper">
          <div class="loader" />
        </div>
      </Host>
    );
  }

}
