import {Component, Host, h, State} from '@stencil/core';
import {MaterialIcons} from "../../../global/material-icons-enum";
import {Size} from "../../common/size";

@Component({
  tag: 'app-components',
  styleUrl: 'app-components.scss',
  shadow: true,
})
export class AppComponents {

  size = Size;
  dialog: HTMLAppDialogElement;

  @State() showMobileKeyboard: boolean = false;
  @State() isFocused: boolean = false;

  async showDialog() {
    await this.dialog.componentOnReady();
    this.dialog.isVisible(true);
  }

  render() {
    return (
      <Host>
        <app-button>Normal button</app-button><br />
        <app-button primary={true} onPress={() => this.showDialog()}>show dialog</app-button><br />

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

        <app-button-round label="rotate image">
          <app-icon>{MaterialIcons.ROTATE_90_DEGREES_CCW}</app-icon>
        </app-button-round>

        <br />

        <app-input />

        <br />

        <app-input
          focused={this.isFocused}
          placeholder="manually triggering the mobile keyboard"
          showMobileKeyboard={this.showMobileKeyboard}
        />
        <app-button
          primary
          onPress={() => this.showMobileKeyboard = !this.showMobileKeyboard}>
            Toggle keyboard
        </app-button>

        <app-button
          primary
          onPress={() => this.isFocused = !this.isFocused}>
          toggle focus
        </app-button>

        <br />

        Loading some stuff: <app-loader />

        <app-dialog ref={(e) => this.dialog = e}>
          <div class="dialog-title">
            <h1>HOI!</h1>
          </div>
          <div class="dialog-content">
            <app-input>
              <input type="text" />
            </app-input>
          </div>
          <app-button onPress={(e) => this.dialog.isVisible(false)} primary>close this annoying thing</app-button>
        </app-dialog>
      </Host>
    );
  }
}
