import {Component, h, Host, State, Event} from '@stencil/core';
import {Inject} from "../../../global/di/inject";
import {GlobalStore} from "../../../global/global-store.service";
import {Line, ReceiptItem, ReceiptItemType} from "../../model/client";
import flyd from 'flyd';
import Stream = flyd.Stream;
import {ReceiptService} from "./receipt.service";
import {Size} from "../../common/size";
import {MaterialIcons} from "../../../global/material-icons-enum";
import {waitFor} from "../../../global/waitFor";

@Component({
  tag: 'app-receipt-extraction',
  styleUrl: 'app-receipt-extraction.scss',
  shadow: true,
})
export class AppReceiptExtraction {
  @Inject(GlobalStore) private globalStore: GlobalStore;
  @Inject(ReceiptService) private receiptService: ReceiptService;

  @State() public total: ReceiptItem;
  @State() public date: ReceiptItem;
  @State() public taxes: ReceiptItem[] = [];
  @State() public categoryItems: ReceiptItem[] = [];
  @State() public showDropup: boolean = false;
  @State() public showEditItems: boolean = true;
  @State() public showAddItem: boolean = false;
  @State() public receiptItemTypeToAdd: ReceiptItemType;

  public receiptItemAdd: HTMLReceiptItemAddElement;

  componentDidLoad() {
    flyd.on((hasAnyItems) => {
      this.showDropup = hasAnyItems;
    }, this.globalStore.selectHasCurrentReceiptAnyItems());

    flyd.on(taxes => this.taxes = taxes, this.globalStore.selectTaxesOfCurrentReceipt());
    flyd.on(total => this.total = total, this.globalStore.selectTotalOfCurrentReceipt());
    flyd.on(date => this.date = date, this.globalStore.selectDateOfCurrentReceipt());
    flyd.on(items => this.categoryItems = items, this.globalStore.selectCategoryItemsOfCurrentReceipt());
  }

  async lineClicked(line: Line) {
    await this.receiptItemAdd.componentOnReady();
    await this.receiptItemAdd.selectLine(line);
  }

  async reset(receiptItem: ReceiptItem) {
    console.log("reset");
  }

  async delete(receiptItem: ReceiptItem) {
    console.log("delete");
  }

  public dropUpAnimationEnd = false;
  async add(type: ReceiptItemType) {
    this.receiptItemTypeToAdd = type;

    this.showDropup = false;
    await waitFor(() => this.dropUpAnimationEnd === this.showDropup);

    this.showEditItems = false;
    this.showAddItem = true;
    this.showDropup = true;
  }

  async update(receiptItem: ReceiptItem) {
    console.log("update");
  }

  render() {
    return (
      <Host>
        <dropup-controls
          show={this.showDropup}
          onContainerShownAnimationEnd={({ detail: show }) => this.dropUpAnimationEnd = show}
        >
          {this.showEditItems && <div class="controls" slot="controls">
            <app-button-round size={Size.xxl}>
              <app-icon>{ MaterialIcons.DONE_ALL }</app-icon>
              <span>done</span>
            </app-button-round>
            <div class="fill" />
            <app-button-round size={Size.xxl} onPress={() => this.showDropup = !this.showDropup}>
              <app-icon>{ MaterialIcons.VIEW_LIST }</app-icon>
              <span>entries</span>
            </app-button-round>
          </div>}

          {this.showAddItem && <div class="controls" slot="controls">
            <app-button-round size={Size.xxl}>
              <app-icon>{ MaterialIcons.CLOSE }</app-icon>
              <span>cancel</span>
            </app-button-round>
            <div class="fill" />
            <app-button-round size={Size.xxl} onPress={() => this.showDropup = !this.showDropup}>
              <app-icon>{ MaterialIcons.NEXT_PLAN }</app-icon>
              <span>save and</span><br />
              <span>next</span>
            </app-button-round>
            <div class="spacer-xs" />
            <app-button-round size={Size.xxl} onPress={() => this.showDropup = !this.showDropup}>
              <app-icon>{ MaterialIcons.DONE }</app-icon>
              <span>save</span>
            </app-button-round>
          </div>}

          <div slot="dropup">

            {this.showAddItem && <receipt-item-add ref={(el) => this.receiptItemAdd = el} />}

            {this.showEditItems && <receipt-items-edit
              total={this.total}
              date={this.date}
              taxes={this.taxes}
              categoryItems={this.categoryItems}
              onResetEmpty={(item: CustomEvent<ReceiptItem>) => this.reset(item.detail)}
              onDelete={(item: CustomEvent<ReceiptItem>) => this.delete(item.detail)}
              onUpdate={(item: CustomEvent<ReceiptItem>) => this.update(item.detail)}
              onAdd={(item: CustomEvent<ReceiptItemType>) => this.add(item.detail)}
            />}
          </div>
        </dropup-controls>

        <receipt-lines onLineClick={(event: CustomEvent<Line>) => this.lineClicked(event.detail)} />
      </Host>
    );
  }
}
