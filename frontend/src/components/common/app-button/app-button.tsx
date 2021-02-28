import {Component, Host, h, Prop, Event, EventEmitter} from '@stencil/core';

@Component({
  tag: 'app-button',
  styleUrl: 'app-button.scss',
  shadow: true,
})
export class AppButton {

  @Prop() primary: boolean = false;
  @Event() press: EventEmitter<MouseEvent>;

  render() {
    return (
      <Host>
        <button
          class={{ 'button': true, 'button--primary': this.primary }}
          onClick={(e) => !!this.press ? this.press.emit(e) : null}
        >
          <slot />
        </button>
      </Host>
    );
  }

}