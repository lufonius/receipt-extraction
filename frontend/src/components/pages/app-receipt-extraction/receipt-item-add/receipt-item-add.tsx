import {Component, Host, h, Prop, Watch, Method, State, EventEmitter, Event} from '@stencil/core';
import {Line, ReceiptItem, ReceiptItemType} from "../../../model/client";
import {MaterialIcons} from "../../../../global/material-icons-enum";
import {Size} from "../../../common/size";

@Component({
  tag: 'receipt-item-add',
  styleUrl: 'receipt-item-add.scss',
  shadow: true,
})
export class ReceiptItemAdd {
  public labelInput: HTMLInputElement;
  public valueInput: HTMLInputElement;
  public focusedInput: HTMLInputElement;

  private focusedProp: 'value' | 'label' = 'label';

  @Event() setCategoryChange: EventEmitter<void>;

  @Event() receiptItemChange: EventEmitter<ReceiptItem>;
  @Prop() receiptItem: ReceiptItem;
  @Watch("receiptItem")
  receiptItemChanged() {
    this.fillInputsWithReceiptItem();
    this.onInit();
  }

  @Method() async selectLine(line: Line) {
    this.focusedInput.value = line.text;

    if (this.focusedProp === 'value') {
      this.receiptItem.value = line.text;
      this.receiptItem.valueLineId = line.id;
    } else if (this.focusedProp === 'label') {
      this.receiptItem.label = line.text;
      this.receiptItem.labelLineId = line.id;
      this.valueInput.focus();
      this.focusedInput = this.valueInput;
      this.focusedProp = 'value';
    } else {
      throw Error("unknown type of focused prop.");
    }

    this.receiptItemChange.emit(this.receiptItem);
  }

  componentDidLoad() {
    this.onInit();
  }

  private onInit() {
    this.labelInput.focus();
    this.focusedInput = this.labelInput;
    this.fillInputsWithReceiptItem();
  }

  fillInputsWithReceiptItem() {
    this.labelInput.value = this.receiptItem.label;
    this.valueInput.value = this.receiptItem.value;
  }

  setLabelCurrentlyFocused() {
    this.focusedProp = 'label';
    this.focusedInput = this.labelInput;
  }

  setValueCurrentlyFocused() {
    this.focusedProp = 'value';
    this.focusedInput = this.valueInput;
  }

  valueChanged(text: string) {
    this.receiptItem.value = text;
    this.receiptItemChange.emit(this.receiptItem);
  }

  labelChanged(text: string) {
    this.receiptItem.label = text;
    this.receiptItemChange.emit(this.receiptItem);
  }

  resetReferencedLabelLineId() {
    this.receiptItem.label = "";
    this.receiptItem.labelLineId = null;
    this.receiptItemChange.emit(this.receiptItem);
    this.labelInput.value = "";
  }

  resetReferencedValueLineId() {
    this.receiptItem.value = "";
    this.receiptItem.valueLineId = null;
    this.receiptItemChange.emit(this.receiptItem);
    this.valueInput.value = "";
  }

  render() {
    return (
      <Host>
        <div class="divider">
          Select receipt item label and amount
          <div class="fill" />
          {this.receiptItem.type === ReceiptItemType.Category && <app-button
            primary
            inverted
            onPress={() => this.setCategoryChange.emit()}>
            set category
          </app-button>}
        </div>
        <div class="input">
          <div class="fill">
            <app-input>
              <label htmlFor="label">Select an items <b>label</b> on the receipt</label>
              <input
                id="label"
                type="text"
                class="full-width"
                onInput={(e: InputEvent) => this.labelChanged(this.labelInput.value)}
                onFocus={() => this.setLabelCurrentlyFocused()}
                ref={(el) => this.labelInput = el}
              />
            </app-input>
          </div>
          <app-button-round class="margin-left-s" size={Size.l} onPress={() => this.resetReferencedLabelLineId()}>
            <app-icon>{ MaterialIcons.DELETE }</app-icon>
          </app-button-round>
        </div>
        <div class="input">
          <div class="fill">
            <app-input>
              <label htmlFor="value">Select an items <b>amount</b> on the receipt</label>
              <input
                id="value"
                class="full-width"
                type="text"
                onInput={(e: InputEvent) => this.valueChanged(this.valueInput.value)}
                onFocus={() => this.setValueCurrentlyFocused()}
                ref={(el) => this.valueInput = el}
              />
            </app-input>
          </div>
          <app-button-round class="margin-left-s" size={Size.l} onPress={() => this.resetReferencedValueLineId()}>
            <app-icon>{ MaterialIcons.DELETE }</app-icon>
          </app-button-round>
        </div>
      </Host>
    );
  }

}
