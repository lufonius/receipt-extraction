import { Component, Host, h } from '@stencil/core';
import {MaterialIcons} from "../../../global/material-icons-enum";
import {Size} from "../../common/size";

@Component({
  tag: 'app-components',
  styleUrl: 'app-components.scss',
  shadow: true,
})
export class AppComponents {

  size = Size;

  render() {
    return (
      <Host>
        <app-button>Normal button</app-button><br />
        <app-button primary={true}>Primary button</app-button><br />

        <app-button-round size={Size.xs}>
          <app-icon>{MaterialIcons.DONE_ALL}</app-icon>
        </app-button-round>

        <app-button-round size={Size.s}>
          <app-icon>{MaterialIcons.DONE_ALL}</app-icon>
        </app-button-round>

        <app-button-round size={Size.m}>
          <app-icon>{MaterialIcons.DONE_ALL}</app-icon>
        </app-button-round>

        <app-button-round size={Size.l}>
          <app-icon>{MaterialIcons.DONE_ALL}</app-icon>
        </app-button-round>

        <app-button-round size={Size.xl}>
          <app-icon>{MaterialIcons.DONE_ALL}</app-icon>
        </app-button-round>

        <app-button-round>
          <app-icon>{MaterialIcons.ROTATE_90_DEGREES_CCW}</app-icon>
          <span>rotate</span><br />
          <span>image</span>
        </app-button-round>

        <br />

        <app-input>
          <input type="text" />
        </app-input>
      </Host>
    );
  }
}
