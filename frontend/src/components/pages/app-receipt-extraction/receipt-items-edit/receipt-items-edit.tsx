import {Component, Event, EventEmitter, h, Host, Prop, State} from '@stencil/core';
import {Icons} from "../../../../global/icons-enum";
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
        <div class="date-or-total-container">
          <div>
            {this.total.label && <span class="label">{this.total.label}</span>}
            {!this.total.label && this.total.value && <span class="label">Total</span>}
            {this.total.value && <span class="value">{this.total.value} CHF</span>}
            {!this.total.label && <span class="value">Select the total</span>}
          </div>
          <div class="fill"/>
          <app-button-round size={Size.l} onPress={() => this.update.emit(this.total)}>
            <app-icon size={Size.sm} icon={Icons.EDIT}/>
          </app-button-round>
          {this.total.value &&
          <app-button-round class="margin-left-xs" size={Size.l} onPress={() => this.resetEmpty.emit(this.total)}>
            <app-icon size={Size.sm} icon={Icons.DELETE}/>
          </app-button-round>}
        </div>

        <app-divider />
        <div class="date-or-total-container">
          <div>
            {this.date.label && <span class="label">{ this.date.label }</span>}
            {!this.date.label && this.date.value && <span class="label">Date</span>}
            {this.date.value && <span class="value">{ this.date.value }</span>}
            {!this.date.value && <span class="value">Select the date</span>}
          </div>
          <div class="fill" />
          <app-button-round size={Size.l} onPress={() => this.update.emit(this.date)}>
            <app-icon size={Size.sm} icon={Icons.EDIT} />
          </app-button-round>
          {this.date.value && <app-button-round class="margin-left-xs" size={Size.l} onPress={() => this.resetEmpty.emit(this.date)}>
            <app-icon size={Size.sm} icon={Icons.DELETE} />
          </app-button-round>}
        </div>

        <app-divider />
        <div class="divider">
          Items
          <div class="fill" />
          <app-button-round size={Size.l} onPress={() => this.add.emit(ReceiptItemType.Category)}>
            <app-icon size={Size.sm} icon={Icons.ADD} />
          </app-button-round>
        </div>

        {this.categoryItems
          .map(it =>
            <list-item label={`${it.label}`} amount={`${it.value}`} category={this.categoriesById.get(it.categoryId)}>
              <div slot="controls">
                <app-button-round size={Size.l} onPress={() => this.delete.emit(it)}>
                  <app-icon size={Size.sm} icon={Icons.DELETE} />
                </app-button-round>
              </div>
            </list-item>
          )
        }

        {this.categoryItems.length === 0 && <div class="no-entries-container">
          <span class="no-entries-text">Select items on the receipt</span>
        </div>}
      </Host>
    );
  }
}
