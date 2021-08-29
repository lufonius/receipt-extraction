import {Component, Host, h, Event, EventEmitter, Prop, Watch, State} from '@stencil/core';
import {Validator} from "../validator";

@Component({
  tag: 'app-input',
  styleUrl: 'app-input.scss',
  shadow: true,
})
export class AppInput {

  @Event() inputFocus: EventEmitter<void>;
  @Event() inputBlur: EventEmitter<void>;
  @Event() inputValueChange: EventEmitter<string>;
  @Event() validChange: EventEmitter<boolean>;
  @State() errors: string[] = [];

  @Prop() label: string;
  @Prop() placeholder: string;
  @Prop() value: string;
  @Watch("value") onValueChange(value: string) {
    this.runValidators(value);
  }
  @Prop() validators: Validator[] = [];
  @Prop() focused: boolean = false;
  @Prop() showErrors: boolean = true;
  @Prop() messagePerError: { [error: string]: string } = {
    "required-error": "You must fill out this field",
    "number-format-error": "This is not a valid number. Valid numbers are for example: 7 / 6.98 / 77,43",
    "date-format-error": "This date is not in a valid format. A valid example is: 30.5.2009"
  };
  @Watch("focused") onFocusedChange(focus: boolean) {
    this.setFocus(focus);
  }

  componentDidLoad() {
    this.setFocus(this.focused);
    this.runValidators(this.valueInput.value);
  }

  setFocus(focus: boolean) {
    if (focus) {
      this.valueInput.focus()
    } else {
      this.valueInput.blur();
    }
  }

  private valueInput: HTMLInputElement;

  private setValueInput(el: HTMLInputElement) {
    this.valueInput = el;
  }

  private onInput(input: string) {
    this.runValidators(input);

    if (this.errors.length === 0) {
      this.inputValueChange.emit(input);
      this.value = input;
    }
  }

  public runValidators(input: string) {
    this.errors = [...this.validators.map(validator => validator(input)).filter(it => it !== null)];
    this.validChange.emit(this.errors.length === 0);
  }

  render() {
    return (
      <Host>
        <label htmlFor="value">{ this.label }</label>
        <input
          id="value"
          type="text"
          value={this.value}
          class={({ "error-input": this.showErrors && this.errors.length > 0 })}
          placeholder={this.placeholder}
          onInput={(e: InputEvent) => this.onInput(this.valueInput.value)}
          onFocus={(e) => this.inputFocus.emit()}
          onBlur={() => this.inputBlur.emit()}
          ref={(el) => this.valueInput = el}
        />
        {this.showErrors && this.errors.map(it => <span class="error-label"><b>{this.messagePerError[it]}</b></span>)}
      </Host>
    );
  }
}
