import {Component, Host, h, Prop, Method} from '@stencil/core';

@Component({
  tag: 'app-dialog',
  styleUrl: 'app-dialog.scss',
  shadow: true,
})
export class AppDialog {

  @Prop() public show: boolean = false;
  dialog: HTMLAppBackdropElement;

  @Method() async showChange(show: boolean) {
    this.show = show;
    await this.dialog.componentOnReady();
    this.dialog.showChange(this.show);
  }

  render() {
    return (
      <Host>
        <app-backdrop ref={(el) => this.dialog = el} withAnimation={true}>
          <div class="flex-container">
            <div class="content">
              <slot />
            </div>
          </div>
        </app-backdrop>
      </Host>
    );
  }

}
