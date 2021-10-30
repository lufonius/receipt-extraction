import {Component, Event, EventEmitter, h, Host, Method, Prop, State, Watch} from '@stencil/core';
import {Category, Line, ReceiptItem} from "../../../model/client";
import {Icons} from "../../../../global/icons-enum";
import {Size} from "../../../common/size";
import {cloneDeep} from "../../../model/cloneDeep";
import {numberValidator, requiredValidator} from "../../../common/validator";

@Component({
  tag: 'receipt-item-add',
  styleUrl: 'receipt-item-add.scss',
  shadow: true,
})
export class ReceiptItemAdd {
  @Event() receiptItemChange: EventEmitter<ReceiptItem>;
  @Event() formValidChange: EventEmitter<boolean>;
  @Prop() receiptItem: ReceiptItem;
  @Watch("receiptItem") receiptItemInChange(receiptItem: ReceiptItem) {
    this.priceAsText = receiptItem.price?.toFixed(2);
  }
  @State() priceAsText: string;

  @Prop() submitted: boolean = false;
  @Prop() categories: Category[] = [];
  @State() categoryOfReceiptItem: Category;
  private selectCategoryDialog: HTMLSelectCategoryDialogElement;

  @State() valueInputFocused: boolean = false;
  private valueInputValid: boolean = false;
  @State() valueInputShowKeyboard: boolean = false;

  @State() labelInputFocused: boolean = true;
  private labelInputValid: boolean = false;
  @State() labelInputShowKeyboard: boolean = false;

  @Method() async selectLine(line: Line) {
    if (this.valueInputFocused) {
      this.setPrice(line.text, line.id);
    } else if (this.labelInputFocused) {
      this.setLabel(line.text, line.id);
    }
  }

  private onValidityChange() {
    this.formValidChange.emit(this.valueInputValid && this.labelInputValid);
  }

  private setPrice(priceAsText: string, valueLineId?: number) {
    this.priceAsText = priceAsText;

    this.receiptItem = cloneDeep(this.receiptItem);
    this.receiptItem.valueLineId = valueLineId;

    if (numberValidator(this.priceAsText) === null) {
      this.receiptItem.price = parseFloat(priceAsText);
    }

    this.receiptItemChange.emit(this.receiptItem);
  }

  private setLabel(value: string, labelLineId?: number) {
    this.receiptItem = cloneDeep(this.receiptItem);
    this.receiptItem.label = value;
    this.receiptItem.labelLineId = labelLineId;
    this.receiptItemChange.emit(this.receiptItem);
    this.labelInputFocused = true;
    this.valueInputFocused = false;
  }

  private setSelectedCategory(categoryId: number) {
    this.receiptItem.categoryId = categoryId;
    this.categoryOfReceiptItem = this.categories.find(it => it.id === categoryId);
    this.receiptItemChange.emit(this.receiptItem);
  }

  private unassignCurrentCategory() {
    this.receiptItem.categoryId = null;
    this.categoryOfReceiptItem = null
    this.receiptItemChange.emit(this.receiptItem);
  }

  render() {
    return (
      <Host>
        <app-divider />
        <div class="category-item">
          {this.categoryOfReceiptItem && <div class="category-item-circle" style={({ "background-color": "#" + this.categoryOfReceiptItem.color.toString(16) })} />}

          <div class="category-item-text-container">
            <span class="category-item-label">Category</span>
            {this.categoryOfReceiptItem && <span>{this.categoryOfReceiptItem.name}</span>}
            {!this.categoryOfReceiptItem && <span>Select a category (optional)</span>}
          </div>

          <div class="fill" />

         <app-button-round size={Size.l} onPress={() => this.selectCategoryDialog.show()}>
            <app-icon size={Size.sm} icon={Icons.EDIT} />
          </app-button-round>

          {this.categoryOfReceiptItem && <app-button-round
            size={Size.l}
            class="delete-button"
            onPress={() => this.unassignCurrentCategory()}>
            <app-icon size={Size.sm} icon={Icons.DELETE} />
          </app-button-round>}
        </div>

        <app-divider />

        <div class="input">
          <div class="fill">
            <app-input
              label="Select the label on the receipt (optional)"
              value={this.receiptItem.label}
              focused={this.labelInputFocused}
              showErrors={this.submitted}
              onValidChange={({ detail: valid }) => { this.labelInputValid = valid; this.onValidityChange(); }}
              onInputValueChange={({ detail: text }) => this.setLabel(text, this.receiptItem.labelLineId)}
              onInputFocus={() => this.labelInputFocused = true}
              onInputBlur={() => this.labelInputFocused = false}
              showMobileKeyboard={this.valueInputShowKeyboard}
            />
          </div>
          {this.valueInputShowKeyboard && <app-button-round
            class="margin-left-s"
            size={Size.l}
            onPress={() => this.valueInputShowKeyboard = false}
          >
            <app-icon svgUrl="assets/custom-icons.svg#keyboard-hide" />
          </app-button-round>}
          {!this.valueInputShowKeyboard && <app-button-round
            class="margin-left-s"
            size={Size.l}
            onPress={() => this.valueInputShowKeyboard = true}
          >
            <app-icon svgUrl="assets/custom-icons.svg#keyboard" />
          </app-button-round>}
          <app-button-round class="margin-left-s" size={Size.l} onPress={() => this.setLabel("", null)}>
            <app-icon size={Size.sm} icon={Icons.DELETE} />
          </app-button-round>
        </div>
        <div class="input">
          <div class="fill">
            <app-input
              label={`Select the article name on the receipt`}
              value={this.priceAsText}
              focused={this.valueInputFocused}
              validators={[requiredValidator, numberValidator]}
              showErrors={this.submitted}
              onValidChange={({ detail: valid }) => { this.valueInputValid = valid; this.onValidityChange(); }}
              onInputValueChange={({ detail: text }) => this.setPrice(text, this.receiptItem.valueLineId)}
              onInputFocus={() => this.valueInputFocused = true}
              onInputBlur={() => this.valueInputFocused = false}
              showMobileKeyboard={this.labelInputShowKeyboard}
              mobileKeyboardType="numeric"
            />
          </div>
          {this.labelInputShowKeyboard && <app-button-round
            class="margin-left-s"
            size={Size.l}
            onPress={() => this.labelInputShowKeyboard = false}
          >
            <app-icon svgUrl="assets/custom-icons.svg#keyboard-hide" />
          </app-button-round>}
          {!this.labelInputShowKeyboard && <app-button-round
            class="margin-left-s"
            size={Size.l}
            onPress={() => this.labelInputShowKeyboard = true}
          >
            <app-icon svgUrl="assets/custom-icons.svg#keyboard" />
          </app-button-round>}
          <app-button-round class="margin-left-s" size={Size.l} onPress={() => this.setPrice(null, null)}>
            <app-icon size={Size.sm} icon={Icons.DELETE} />
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
