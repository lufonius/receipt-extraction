import {Component, h, Host, State, Event} from '@stencil/core';
import {Inject} from "../../../global/di/inject";
import {GlobalStore} from "../../../global/global-store.service";
import {Line, Receipt, ReceiptItem, ReceiptItemType} from "../../model/client";
import flyd from 'flyd';
import Stream = flyd.Stream;
import {ReceiptService} from "./receipt.service";
import {Size} from "../../common/size";
import {MaterialIcons} from "../../../global/material-icons-enum";
import {waitFor} from "../../../global/waitFor";
import {Mapper} from "../../model/mapper";

@Component({
  tag: 'app-receipt-extraction',
  styleUrl: 'app-receipt-extraction.scss',
  shadow: true,
})
export class AppReceiptExtraction {
  @Inject(GlobalStore) private globalStore: GlobalStore;
  @Inject(ReceiptService) private receiptService: ReceiptService;
  @Inject(Mapper) private mapper: Mapper;

  @State() public total: ReceiptItem;
  @State() public date: ReceiptItem;
  @State() public taxes: ReceiptItem[] = [];
  @State() public categoryItems: ReceiptItem[] = [];
  @State() public showDropup: boolean = false;
  @State() public showEditItems: boolean = true;
  @State() public showAddItem: boolean = false;
  @State() public currentReceiptItem: ReceiptItem;
  private currentReceiptItemType: ReceiptItemType;
  private currentReceipt: Receipt;

  public receiptItemAdd: HTMLReceiptItemAddElement;

  componentDidLoad() {
    flyd.on((hasAnyItems) => {
      this.showDropup = hasAnyItems;
    }, this.globalStore.selectHasCurrentReceiptAnyItems());

    flyd.on((receipt) => this.currentReceipt = receipt, this.globalStore.selectCurrentReceipt());
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
    this.globalStore.deleteReceiptItemOfCurrentReceipt(receiptItem.id);

    try {
      await this.receiptService.deleteReceiptItem(receiptItem.id);

      if (receiptItem.labelLineId) {
        this.globalStore.updateLine(receiptItem.labelLineId, { isLinked: false });
      }

      if (receiptItem.valueLineId) {
        this.globalStore.updateLine(receiptItem.valueLineId, { isLinked: false });
      }
    } catch (error) {
      // show snackbar
      this.globalStore.addReceiptItemOfCurrentReceipt(receiptItem);
    }
  }

  public dropUpAnimationEnd = false;
  async add(type: ReceiptItemType) {
    this.currentReceiptItemType = type;
    this.resetCurrentReceiptItem();
    this.showDropup = false;
    await waitFor(() => this.dropUpAnimationEnd === this.showDropup);

    this.showEditItems = false;
    this.showAddItem = true;
    this.showDropup = true;
  }

  async update(receiptItem: ReceiptItem) {
    console.log("update");
  }

  async hideAddItem() {
    this.showDropup = false;
    await waitFor(() => this.dropUpAnimationEnd === this.showDropup);

    this.showEditItems = true;
    this.showAddItem = false;
    this.showDropup = true;
  }

  async saveItem() {
    const dto = this.mapper.dtoFromReceiptItem(this.currentReceiptItem);
    const savedReceiptItemDto = await this.receiptService.createReceiptItem(dto);
    const savedReceiptItem = this.mapper.receiptItemFromDto(savedReceiptItemDto);
    this.globalStore.addReceiptItemOfCurrentReceipt(savedReceiptItem);

    if (savedReceiptItem.labelLineId) {
      this.globalStore.updateLine(savedReceiptItem.labelLineId, { isLinked: true });
    }

    if (savedReceiptItem.valueLineId) {
      this.globalStore.updateLine(savedReceiptItem.valueLineId, { isLinked: true });
    }
  }

  resetCurrentReceiptItem() {
    this.currentReceiptItem = {
      id: 0,
      label: null,
      labelLineId: null,
      value: null,
      valueLineId: null,
      receiptId: this.currentReceipt.id,
      type: this.currentReceiptItemType
    };
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
            <app-button-round size={Size.xxl} onPress={() => this.hideAddItem()}>
              <app-icon>{ MaterialIcons.CLOSE }</app-icon>
              <span>cancel</span>
            </app-button-round>
            <div class="fill" />
            <app-button-round size={Size.xxl} onPress={async () => { await this.saveItem(); await this.resetCurrentReceiptItem(); }}>
              <app-icon>{ MaterialIcons.NEXT_PLAN }</app-icon>
              <span>save and</span><br />
              <span>next</span>
            </app-button-round>
            <div class="spacer-xs" />
            <app-button-round size={Size.xxl} onPress={async () => { await this.saveItem(); await this.hideAddItem();}}>
              <app-icon>{ MaterialIcons.DONE }</app-icon>
              <span>save</span>
            </app-button-round>
          </div>}

          <div slot="dropup">

            {this.showAddItem && <receipt-item-add
              receiptItem={this.currentReceiptItem}
              onReceiptItemChange={({ detail }) => this.currentReceiptItem = detail}
              ref={(el) => this.receiptItemAdd = el} />}

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
