import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'app-layout-vertical-split',
  styleUrl: 'app-layout-vertical-split.css',
  shadow: true,
})
export class AppHeaderVerticalSplit {

  render() {
    return (
      <Host>
        <div class="container">
          <div class="top">
            <slot name="top" />
          </div>
          <div class="bottom">
            <slot name="bottom" />
          </div>
        </div>
      </Host>
    );
  }
}
