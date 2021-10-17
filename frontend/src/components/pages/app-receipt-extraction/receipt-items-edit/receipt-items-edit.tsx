import {Component, Event, EventEmitter, h, Host, Prop, State} from '@stencil/core';
import {MaterialIcons} from "../../../../global/material-icons-enum";
import {Size} from "../../../common/size";
import {Category, ReceiptItem, ReceiptItemType} from "../../../model/client";
import {Inject} from "../../../../global/di/inject";
import {GlobalStore} from "../../../../global/global-store.service";
import flyd from 'flyd';

@Component({
  tag: 'receipt-items-edit',
  styleUrl: 'receipt-items-edit.scss',
  shadow: true,
})
export class ReceiptItemsEdit {
  @Inject(GlobalStore) private globalStore: GlobalStore;

  @Prop() public total: ReceiptItem;
  @Prop() public date: ReceiptItem;
  @Prop() public taxes: ReceiptItem[] = [];
  @Prop() public categoryItems: ReceiptItem[] = [];

  @Event() public add: EventEmitter<ReceiptItemType>;
  @Event() public update: EventEmitter<ReceiptItem>;
  @Event() public delete: EventEmitter<ReceiptItem>;
  @Event() public resetEmpty: EventEmitter<ReceiptItem>;

  @State() categoriesById: Map<number, Category>;

  componentWillLoad() {
    flyd.on(categories => this.categoriesById = categories, this.globalStore.selectCategoriesById());
  }

  render() {
    return (
      <Host>

        <app-divider />
        {this.total && <list-item label={`${this.total.label}`} amount={`${this.total.value}`} emptyLabel="Select the total on the receipt">
          <div slot="controls">
            <app-button-round size={Size.l} onPress={() => this.update.emit(this.total)}>
              <app-icon>{MaterialIcons.EDIT}</app-icon>
            </app-button-round>
            {this.total.value && <app-button-round class="margin-left-xs" size={Size.l} onPress={() => this.resetEmpty.emit(this.total)}>
              <app-icon>{MaterialIcons.DELETE}</app-icon>
            </app-button-round>}
          </div>
        </list-item> }

        <app-divider />
        {this.date && <list-item label={`${this.date.label}`} amount={`${this.date.value}`} emptyLabel="Select the date on the receipt">
          <div slot="controls">
            <app-button-round size={Size.l} onPress={() => this.update.emit(this.date)}>
              <app-icon>{MaterialIcons.EDIT}</app-icon>
            </app-button-round>
            {this.date.value && <app-button-round class="margin-left-xs" size={Size.l} onPress={() => this.resetEmpty.emit(this.date)}>
              <app-icon>{MaterialIcons.DELETE}</app-icon>
            </app-button-round>}
          </div>
        </list-item> }

        <app-divider />
        <div class="divider">
          Taxes
          <div class="fill" />
          <app-button-round size={Size.l} onPress={() => this.add.emit(ReceiptItemType.Tax)}>
            <app-icon>{MaterialIcons.ADD}</app-icon>
          </app-button-round>
        </div>

        {this.taxes
          .map(it =>
            <list-item label={`${it.label}`} amount={`${it.value}`}>
              <div slot="controls">
                <app-button-round size={Size.l} onPress={() => this.delete.emit(it)}>
                  <app-icon>{MaterialIcons.DELETE}</app-icon>
                </app-button-round>
              </div>
            </list-item>
          )
        }

        <div class="no-entries-container">
          {this.taxes.length === 0 && <p class="no-entries-text">Select taxes on the receipt</p>}
        </div>

        <div class="divider">
          Items
          <div class="fill" />
          <app-button-round size={Size.l} onPress={() => this.add.emit(ReceiptItemType.Category)}>
            <app-icon>{MaterialIcons.ADD}</app-icon>
          </app-button-round>
        </div>

        {this.categoryItems
          .map(it =>
            <list-item label={`${it.label}`} amount={`${it.value}`} category={this.categoriesById.get(it.categoryId)}>
              <div slot="controls">
                <app-button-round size={Size.l} onPress={() => this.delete.emit(it)}>
                  <app-icon>{MaterialIcons.DELETE}</app-icon>
                </app-button-round>
              </div>
            </list-item>
          )
        }

        <div class="no-entries-container">
          {this.categoryItems.length === 0 && <p class="no-entries-text">Select items on the receipt</p>}
        </div>
      </Host>
    );
  }
}
