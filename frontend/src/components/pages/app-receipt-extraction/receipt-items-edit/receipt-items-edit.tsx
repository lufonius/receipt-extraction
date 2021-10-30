import {Component, Event, EventEmitter, h, Host, Prop, State} from '@stencil/core';
import {Icons} from "../../../../global/icons-enum";
import {Size} from "../../../common/size";
import {Category, ReceiptItem} from "../../../model/client";
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

  @Prop() public total: number;
  @Prop() public date: string;
  @Prop() public items: ReceiptItem[] = [];

  @Event() public showAddItem: EventEmitter<void>;
  @Event() public showUpdateItem: EventEmitter<ReceiptItem>;
  @Event() public showUpdateTotal: EventEmitter<number>;
  @Event() public showUpdateDate: EventEmitter<string>;

  @Event() public deleteItem: EventEmitter<ReceiptItem>;
  @Event() public deleteTotal: EventEmitter<void>;
  @Event() public deleteDate: EventEmitter<void>;

  @State() categoriesById: Map<number, Category>;

  componentWillLoad() {
    flyd.on(categories => this.categoriesById = categories, this.globalStore.selectCategoriesById());
  }

  getFormattedDate(): string {
    const months = [
      null,
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    const dateObj = new Date(this.date);
    return dateObj.getDate() + " " + months[dateObj.getMonth()] + " " + dateObj.getFullYear();
  }

  render() {
    return (
      <Host>

        <app-divider />
        <div class="date-or-total-container">
          <div>
            {this.total && <span class="label">Total</span>}
            {this.total && <span class="value">{this.total} CHF</span>}
            {!this.total && <span class="value">Select the total</span>}
          </div>
          <div class="fill"/>
          <app-button-round size={Size.l} onPress={() => this.showUpdateTotal.emit(this.total)}>
            <app-icon size={Size.sm} icon={Icons.EDIT}/>
          </app-button-round>
          {this.total &&
          <app-button-round class="margin-left-xs" size={Size.l} onPress={() => this.deleteTotal.emit()}>
            <app-icon size={Size.sm} icon={Icons.DELETE}/>
          </app-button-round>}
        </div>

        <app-divider />
        <div class="date-or-total-container">
          <div>
            {this.date && <span class="label">Date</span>}
            {this.date && <span class="value">{ this.getFormattedDate() }</span>}
            {!this.date && <span class="value">Select the date</span>}
          </div>
          <div class="fill" />
          <app-button-round size={Size.l} onPress={() => this.showUpdateDate.emit(this.date)}>
            <app-icon size={Size.sm} icon={Icons.EDIT} />
          </app-button-round>
          {this.date && <app-button-round class="margin-left-xs" size={Size.l} onPress={() => this.deleteDate.emit()}>
            <app-icon size={Size.sm} icon={Icons.DELETE} />
          </app-button-round>}
        </div>

        <app-divider />
        <div class="divider">
          Items
          <div class="fill" />
          <app-button-round size={Size.l} onPress={() => this.showAddItem.emit()}>
            <app-icon size={Size.sm} icon={Icons.ADD} />
          </app-button-round>
        </div>

        {this.items
          .map(it =>
            <list-item label={`${it.label}`} amount={`${it.price.toFixed(2)}`} category={this.categoriesById.get(it.categoryId)}>
              <div slot="controls">
                <app-button-round size={Size.l} onPress={() => this.deleteItem.emit(it)}>
                  <app-icon size={Size.sm} icon={Icons.DELETE} />
                </app-button-round>
              </div>
            </list-item>
          )
        }

        {this.items.length === 0 && <div class="no-entries-container">
          <span class="no-entries-text">Select items on the receipt</span>
        </div>}
      </Host>
    );
  }
}
