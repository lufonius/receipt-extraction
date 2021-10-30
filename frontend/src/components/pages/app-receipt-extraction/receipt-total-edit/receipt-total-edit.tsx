import {Component, Host, h, Prop, EventEmitter, Event, State} from '@stencil/core';
import {Size} from "../../../common/size";
import {Icons} from "../../../../global/icons-enum";

@Component({
  tag: 'receipt-total-edit',
  styleUrl: 'receipt-total-edit.scss',
  shadow: true,
})
export class ReceiptTotalEdit {

  @Prop() total?: number = null;
  @Event() totalChange: EventEmitter<number>;

  @Prop() submitted: boolean = false;
  @State() showKeyboard: boolean = false;

  render() {
    return (
      <Host>
        <app-input
          label="Select the total on the receipt"
          type="number"
          value={this.total}
          focused={true}
          showErrors={this.submitted}
          onInputValueChange={({ detail: total }) => this.totalChange.emit(total)}
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
