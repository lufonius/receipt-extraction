import {Component, Host, h, Prop, Method} from '@stencil/core';

@Component({
  tag: 'app-dialog',
  styleUrl: 'app-dialog.scss',
  shadow: true,
})
export class AppDialog {

  @Prop() public show: boolean = false;
  backdrop: HTMLAppBackdropElement;

  @Method() async showChange(show: boolean) {
    this.show = show;
    await this.backdrop.componentOnReady();
    this.backdrop.showChange(this.show);
  }

  componentDidLoad() {
    document.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        this.showChange(false);
      }
    });
  }

  render() {
    return (
      <Host>
        <app-backdrop ref={(el) => this.backdrop = el} withAnimation={true}>
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
