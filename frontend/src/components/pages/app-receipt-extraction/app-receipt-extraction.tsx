import {Component, h, Host, State, Event} from '@stencil/core';
import {Inject} from "../../../global/di/inject";
import {GlobalStore} from "../../../global/global-store.service";
import {Line, ReceiptItem, ReceiptItemType} from "../../model/client";
import flyd from 'flyd';
import {ReceiptService} from "./receipt.service";

@Component({
  tag: 'app-receipt-extraction',
  styleUrl: 'app-receipt-extraction.css',
  shadow: true,
})
export class AppReceiptExtraction {
  @Inject(GlobalStore) private globalStore: GlobalStore;
  @Inject(ReceiptService) private receiptService: ReceiptService;

  @State() public total: ReceiptItem;
  @State() public date: ReceiptItem;
  @State() public taxes: ReceiptItem[] = [];
  @State() public categoryItems: ReceiptItem[] = [];
  @State() public hasAnyItems: boolean = false;

  componentDidLoad() {
    flyd.on((hasAnyItems) => {
      this.hasAnyItems = hasAnyItems;
    }, this.globalStore.selectHasCurrentReceiptAnyItems());

    flyd.on(taxes => this.taxes = taxes, this.globalStore.selectTaxesOfCurrentReceipt());
    flyd.on(total => this.total = total, this.globalStore.selectTotalOfCurrentReceipt());
    flyd.on(date => this.date = date, this.globalStore.selectDateOfCurrentReceipt());
    flyd.on(items => this.categoryItems = items, this.globalStore.selectCategoryItemsOfCurrentReceipt());
  }

  lineClicked(line: Line) {
    alert(line.text + " / " + line.id);
  }

  async reset(receiptItem: ReceiptItem) {
    console.log("reset");
  }

  async delete(receiptItem: ReceiptItem) {
    console.log("delete");
  }

  async add(type: ReceiptItemType) {
    console.log("add");
  }

  async update(receiptItem: ReceiptItem) {
    console.log("update");
  }

  render() {
    return (
      <Host>
        <receipt-items-edit
          show={this.hasAnyItems}
          total={this.total}
          date={this.date}
          taxes={this.taxes}
          categoryItems={this.categoryItems}
          onResetEmpty={(item: CustomEvent<ReceiptItem>) => this.reset(item.detail)}
          onDelete={(item: CustomEvent<ReceiptItem>) => this.delete(item.detail)}
          onUpdate={(item: CustomEvent<ReceiptItem>) => this.update(item.detail)}
          onAdd={(item: CustomEvent<ReceiptItemType>) => this.add(item.detail)}
        />
        <receipt-lines onLineClick={(event: CustomEvent<Line>) => this.lineClicked(event.detail)} />
      </Host>
    );
  }
}
