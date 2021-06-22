import {Component, Event, EventEmitter, h, Host, Method, Prop, State} from '@stencil/core';
import {Category, Line, ReceiptItem, ReceiptItemType} from "../../../model/client";
import {MaterialIcons} from "../../../../global/material-icons-enum";
import {Size} from "../../../common/size";
import {cloneDeep} from "../../../model/cloneDeep";
import {dateValidator, numberValidator, requiredValidator} from "../../../common/validator";

@Component({
  tag: 'receipt-item-add',
  styleUrl: 'receipt-item-add.scss',
  shadow: true,
})
export class ReceiptItemAdd {
  @Event() receiptItemChange: EventEmitter<ReceiptItem>;
  @Event() formValidChange: EventEmitter<boolean>;
  @Prop() receiptItem: ReceiptItem;

  @Prop() submitted: boolean = false;
  @Prop() categories: Category[] = [];
  @State() categoryOfReceiptItem: Category;
  private selectCategoryDialog: HTMLSelectCategoryDialogElement;

  @State() valueInputFocused: boolean = false;
  private valueInputValid: boolean = false;
  @State() labelInputFocused: boolean = true;
  private labelInputValid: boolean = false;

  @Method() async selectLine(line: Line) {
    if (this.valueInputFocused) {
      this.setValue(line.text, line.id);
    } else if (this.labelInputFocused) {
      this.setLabel(line.text, line.id);
      this.labelInputFocused = false;
      this.valueInputFocused = true;
    }
  }

  private onValidityChange() {
    this.formValidChange.emit(this.valueInputValid && this.labelInputValid);
  }

  private setValue(value: string, valueLineId?: number) {
    this.receiptItem = cloneDeep(this.receiptItem);
    this.receiptItem.value = value;
    this.receiptItem.valueLineId = valueLineId;
    this.receiptItemChange.emit(this.receiptItem);
  }

  private setLabel(value: string, labelLineId?: number) {
    this.receiptItem = cloneDeep(this.receiptItem);
    this.receiptItem.label = value;
    this.receiptItem.labelLineId = labelLineId;
    this.receiptItemChange.emit(this.receiptItem);
  }

  private setSelectedCategory(categoryId: number) {
    this.receiptItem.categoryId = categoryId;
    this.categoryOfReceiptItem = this.categories.find(it => it.id === categoryId);
    this.receiptItemChange.emit(this.receiptItem);
  }

  private getValueValidator() {
    if (this.receiptItem.type === ReceiptItemType.Date) {
      return [requiredValidator, dateValidator];
    } else {
      return [requiredValidator, numberValidator];
    }
  }

  render() {
    return (
      <Host>
        <div class="divider">
          <div class="fill" />
          {this.categoryOfReceiptItem && <div class="selected-category">
            <div class="circle" style={({ "background-color": "#" + this.categoryOfReceiptItem.color.toString(16) })} />
            <span class="margin-left-s">{this.categoryOfReceiptItem.name}</span>
          </div>}
          {this.receiptItem.type === ReceiptItemType.Category && <app-button
            class="margin-left-s"
            primary
            inverted
            onPress={() => this.selectCategoryDialog.show()}>
            {!this.categoryOfReceiptItem && <span>set category</span>}
            {this.categoryOfReceiptItem && <span>change</span>}
          </app-button>}
        </div>
        <div class="input">
          <div class="fill">
            <app-input
              label="Select the label on the receipt"
              value={this.receiptItem.label}
              focused={this.labelInputFocused}
              showErrors={this.submitted}
              onValidChange={({ detail: valid }) => { this.labelInputValid = valid; this.onValidityChange(); }}
              onInputValueChange={({ detail: text }) => this.setLabel(text, this.receiptItem.labelLineId)}
              onInputFocus={() => this.labelInputFocused = true}
              onInputBlur={() => this.labelInputFocused = false}
            />
          </div>
          <app-button-round class="margin-left-s" size={Size.l} onPress={() => this.setLabel("", null)}>
            <app-icon>{ MaterialIcons.DELETE }</app-icon>
          </app-button-round>
        </div>
        <div class="input">
          <div class="fill">
            <app-input
              label={`Select the ${this.receiptItem.type === ReceiptItemType.Date ? "date" : "value"} on the receipt`}
              value={this.receiptItem.value}
              focused={this.valueInputFocused}
              validators={this.getValueValidator()}
              showErrors={this.submitted}
              onValidChange={({ detail: valid }) => { this.valueInputValid = valid; this.onValidityChange(); }}
              onInputValueChange={({ detail: text }) => this.setValue(text, this.receiptItem.valueLineId)}
              onInputFocus={() => this.valueInputFocused = true}
              onInputBlur={() => this.valueInputFocused = false}
            />
          </div>
          <app-button-round class="margin-left-s" size={Size.l} onPress={() => this.setValue("", null)}>
            <app-icon>{ MaterialIcons.DELETE }</app-icon>
          </app-button-round>
        </div>
        {this.receiptItem && <select-category-dialog
          ref={(e) => this.selectCategoryDialog = e}
          selectedCategoryId={this.receiptItem.categoryId}
          onSelectedCategoryIdChange={({ detail }) => this.setSelectedCategory(detail)}
        />}
      </Host>
    );
  }

}
