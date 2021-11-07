import {Component, Host, h, Prop, EventEmitter, Event, State, Method} from '@stencil/core';
import {Size} from "../../../common/size";
import {Icons} from "../../../../global/icons-enum";
import {Line} from "../../../model/client";
import {numberValidator} from "../../../common/validator";

@Component({
  tag: 'receipt-total-edit',
  styleUrl: 'receipt-total-edit.scss',
  shadow: true,
})
export class ReceiptTotalEdit {

  @Prop() total?: string = null;
  @Event() totalChange: EventEmitter<number>;
  @Event() validChange: EventEmitter<boolean>;

  @Prop() submitted: boolean = false;
  @State() showKeyboard: boolean = false;

  @Method() async selectLine(line: Line) {
    this.total = line.text;
    this.totalChange.emit(parseFloat(this.total));
  }

  render() {
    return (
      <Host>
        <app-input
          label="Select the total on the receipt"
          type="text"
          value={this.total}
          focused={true}
          validators={[numberValidator]}
          onValidChange={({ detail: valid }) => this.validChange.emit(valid)}
          showErrors={this.submitted}
          onInputValueChange={({ detail: total }) => this.totalChange.emit(parseFloat(total))}
          showMobileKeyboard={this.showKeyboard}
        />
        {!this.showKeyboard && <app-button-round
          class="margin-left-s"
          size={Size.l}
          onPress={() => this.showKeyboard = true}
        >
          <app-icon svgUrl="assets/custom-icons.svg#keyboard" />
        </app-button-round>}

        {this.showKeyboard && <app-button-round
          class="margin-left-s"
          size={Size.l}
          onPress={() => this.showKeyboard = false}
        >
          <app-icon svgUrl="assets/custom-icons.svg#keyboard-hide" />
        </app-button-round>}

        <app-button-round class="margin-left-s" size={Size.l} onPress={() => {
          this.total = null;
          this.totalChange.emit(null);
        }}>
          <app-icon size={Size.sm} icon={Icons.DELETE} />
        </app-button-round>
      </Host>
    );
  }

}
