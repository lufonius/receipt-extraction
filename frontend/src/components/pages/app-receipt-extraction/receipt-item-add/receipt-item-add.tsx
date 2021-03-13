import {Component, Host, h, Prop, Watch, Method, State} from '@stencil/core';
import {Line} from "../../../model/client";

@Component({
  tag: 'receipt-item-add',
  styleUrl: 'receipt-item-add.scss',
  shadow: true,
})
export class ReceiptItemAdd {

  @State() public selectedLine?: Line = null;

  @Method() async selectLine(line: Line) {
    this.selectedLine = line;
    this.focusedInput.value = this.selectedLine.text;
  }

  public labelInput: HTMLInputElement;
  public valueInput: HTMLInputElement;
  public focusedInput: HTMLInputElement;

  componentDidLoad() {
    this.labelInput.blur();
    this.focusedInput = this.labelInput;
  }

  setFocusedInput(input: HTMLInputElement) {
    this.focusedInput = input;
  }

  render() {
    return (
      <Host>
        <div class="divider">Select receipt item label and amount</div>
        <div class="input">
          <app-input>
            <label htmlFor="label">Select an items <b>label</b> on the receipt</label>
            <input
              id="label"
              class="full-width"
              type="text"
              onFocus={() => this.setFocusedInput(this.labelInput)}
              ref={(el) => this.labelInput = el}
            />
          </app-input>
        </div>
        <div class="input">
          <app-input>
            <label htmlFor="value">Select an items <b>amount</b> on the receipt</label>
            <input
              id="value"
              class="full-width"
              type="text"
              onFocus={() => this.setFocusedInput(this.valueInput)}
              ref={(el) => this.valueInput = el}
            />
          </app-input>
        </div>
      </Host>
    );
  }

}
