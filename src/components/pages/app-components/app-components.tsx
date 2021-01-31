import { Component, Host, h } from '@stencil/core';
import {MaterialIcons} from "../../../global/material-icons-enum";

@Component({
  tag: 'app-components',
  styleUrl: 'app-components.scss',
  shadow: true,
})
export class AppComponents {

  render() {
    return (
      <Host>
        <app-button>Normal button</app-button><br />
        <app-button primary={true}>Primary button</app-button><br />
        <app-button-round firstLine="hello" secondLine="world" icon={MaterialIcons.ROTATE_90_DEGREES_CCW}>Round button</app-button-round>
      </Host>
    );
  }
}
