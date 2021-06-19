import {Component, Host, h, Event, EventEmitter, Prop, Method, Watch} from '@stencil/core';

@Component({
  tag: 'app-input',
  styleUrl: 'app-input.scss',
  shadow: true,
})
export class AppInput {

  @Event() inputFocus: EventEmitter<void>;
  @Event() inputBlur: EventEmitter<void>;
  @Event() inputChange: EventEmitter<string>;

  @Prop() label: string;
  @Prop() value: string;
  @Prop() focused: boolean = false;
  @Watch("focused") onFocusedChange(focus: boolean) {
    this.setFocus(focus);
  }

  componentDidLoad() {
    this.setFocus(this.focused);
  }

  setFocus(focus: boolean) {
    if (focus) {
      this.valueInput.focus();
    } else {
      this.valueInput.blur();
    }
  }

  private valueInput: HTMLInputElement;

  private setValueInput(el: HTMLInputElement) {
    this.valueInput = el;
  }

  render() {
    return (
      <Host>
        <label htmlFor="value">{ this.label }</label>
        <input
          id="value"
          type="text"
          value={this.value}
          onInput={(e: InputEvent) => this.inputChange.emit(this.valueInput.value)}
          onFocus={(e) => this.inputFocus.emit()}
          onBlur={() => this.inputBlur.emit()}
          ref={(el) => this.valueInput = el}
        />
      </Host>
    );
  }
}
