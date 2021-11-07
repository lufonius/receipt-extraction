import {Component, Host, h, Prop, EventEmitter, Event, State, Watch, Method} from '@stencil/core';
import {Size} from "../../../common/size";
import {Icons} from "../../../../global/icons-enum";
import {dateValidator} from "../../../common/validator";
import {Line} from "../../../model/client";
import {Components} from "../../../../components";
import AppInput = Components.AppInput;

@Component({
  tag: 'receipt-date-edit',
  styleUrl: 'receipt-date-edit.scss',
  shadow: true,
})
export class ReceiptDateEdit {

  @Prop() date: string;
  @Watch("date") dateChanged(newDate: string) {
    const obj = new Date(newDate);
    this.dateFormatted = `${obj.getDate()}.${obj.getMonth() + 1}.${obj.getFullYear()}`;
  }
  @Event() dateChange: EventEmitter<string>;
  @Event() validChange: EventEmitter<boolean>;
  @Prop() submitted: boolean = false;

  @State() showKeyboard: boolean = false;

  @State() dateFormatted: string;

  @Method() async selectLine(line: Line) {
    this.dateFormatted = line.text;
    if (dateValidator(line.text) === null) {
      this.convertDateToIsoStringAndEmit(this.dateFormatted);
    }
  }

  componentWillLoad() {
    if (this.date !== null) {
      const obj = new Date(this.date);
      this.dateFormatted = `${obj.getDate()}.${obj.getMonth() + 1}.${obj.getFullYear()}`;
    }
  }

  convertDateToIsoStringAndEmit(date: string) {
    const splittedDate = date.split(".");
    const newDate = new Date(parseInt(splittedDate[2]), parseInt(splittedDate[1]) - 1, parseInt(splittedDate[0]))
    this.dateChange.emit(newDate.toISOString());
  }

  render() {
    return (
      <Host>
        <app-input
          label="Select the date on the receipt (format: dd.mm.yyyy)"
          value={this.dateFormatted}
          validators={[dateValidator]}
          onValidChange={({ detail: valid }) => { console.log("validity changed " + valid); this.validChange.emit(valid); }}
          focused={true}
          showErrors={this.submitted}
          onInputValueChange={({detail: date}) => this.convertDateToIsoStringAndEmit(date)}
          showMobileKeyboard={this.showKeyboard}
        />
        {!this.showKeyboard && <app-button-round
          class="margin-left-s"
          size={Size.l}
          onPress={() => this.showKeyboard = true}
        >
          <app-icon svgUrl="assets/custom-icons.svg#keyboard"/>
        </app-button-round>}

        {this.showKeyboard && <app-button-round
          class="margin-left-s"
          size={Size.l}
          onPress={() => this.showKeyboard = false}
        >
          <app-icon svgUrl="assets/custom-icons.svg#keyboard-hide"/>
        </app-button-round>}

        <app-button-round class="margin-left-s" size={Size.l} onPress={() => {
          this.date = null;
          this.dateFormatted = null;
          this.dateChange.emit(null);
        }}>
          <app-icon size={Size.sm} icon={Icons.DELETE}/>
        </app-button-round>
      </Host>
    );
  }

}
