import {Component, Host, h, Prop, Watch, State} from '@stencil/core';
import {Size} from "../size";

@Component({
  tag: 'app-icon',
  styleUrl: 'app-icon.scss',
  shadow: true,
})
export class AppIcon {
  @Prop() icon: string;
  @Prop() size: Size;

  @Prop() svgUrl: string = null;

  getComposedSvgUrl(): string {
    if (this.svgUrl) {
      return this.svgUrl;
    } else {
      return "/lib/feather-sprite.svg#" + this.icon;
    }
  }

  render() {
    return (<Host>
      <svg class={"feather " + this.size}>
        <use href={this.getComposedSvgUrl()} />
      </svg>
    </Host>);
  }
}
