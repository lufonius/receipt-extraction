import {Component, Host, h, Prop, Method} from '@stencil/core';

@Component({
  tag: 'app-dialog',
  styleUrl: 'app-dialog.scss',
  shadow: true,
})
export class AppDialog {
  @Prop() manuallyClosable: boolean = true;
  backdrop: HTMLAppBackdropElement;

  @Method() async isVisible(show: boolean) {
    await this.backdrop.componentOnReady();
    await this.backdrop.showChange(show);
  }

  componentDidLoad() {
    if (this.manuallyClosable) {
      document.addEventListener('keyup', (event: KeyboardEvent) => {
        if (event.code === 'Escape') {
          this.isVisible(false);
        }
      });
    }
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
