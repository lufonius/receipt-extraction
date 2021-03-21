import {Component, h, Host, State} from '@stencil/core';
import {Inject} from "../../../global/di/inject";
import {GlobalStore} from "../../../global/global-store.service";
import {Category, Line, Receipt, ReceiptItem, ReceiptItemType} from "../../model/client";
import flyd from 'flyd';
import {ReceiptItemService} from "./receipt-item.service";
import {Size} from "../../common/size";
import {MaterialIcons} from "../../../global/material-icons-enum";
import {waitFor} from "../../../global/waitFor";
import {Mapper} from "../../model/mapper";
import {cloneDeep} from "../../model/cloneDeep";

@Component({
  tag: 'app-receipt-extraction',
  styleUrl: 'app-receipt-extraction.scss',
  shadow: true,
})
export class AppReceiptExtraction {
  @Inject(GlobalStore) private globalStore: GlobalStore;
  @Inject(ReceiptItemService) private receiptItemService: ReceiptItemService;
  @Inject(Mapper) private mapper: Mapper;

  @State() public total: ReceiptItem;
  @State() public date: ReceiptItem;
  @State() public taxes: ReceiptItem[] = [];
  @State() public categoryItems: ReceiptItem[] = [];
  @State() public showDropup: boolean = false;
  @State() public showEditItems: boolean = true;
  @State() public showAddItem: boolean = false;
  public receiptItemBeforeUpdate: ReceiptItem;
  @State() public currentReceiptItem: ReceiptItem;
  private currentReceiptItemType: ReceiptItemType;
  private currentReceipt: Receipt;
  public receiptItemAdd: HTMLReceiptItemAddElement;
  private categories: Category[];

  componentWillLoad() {
    flyd.on((hasAnyItems) => {
      this.showDropup = hasAnyItems;
    }, this.globalStore.selectHasCurrentReceiptAnyItems());

    flyd.on((categories) => this.categories = categories, this.globalStore.selectCategories());

    // TODO: currently, the problem is only with the receipt items. until we do not have a distinct select, let's just clone depp
    flyd.on((receipt) => this.currentReceipt = cloneDeep(receipt), this.globalStore.selectCurrentReceipt());
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
    const clonedReceiptItem = cloneDeep(receiptItem);
    clonedReceiptItem.valueLineId = null;
    clonedReceiptItem.value = null;
    clonedReceiptItem.labelLineId = null;
    clonedReceiptItem.label = null;

    try {
      this.globalStore.updateReceiptItemOfCurrentReceipt(clonedReceiptItem.id, clonedReceiptItem);
      const dto = this.mapper.dtoFromReceiptItem(clonedReceiptItem);
      await this.receiptItemService.updateReceiptItem(clonedReceiptItem.id, dto);
      this.updateLinesColor(receiptItem, 0x696969);
    } catch(error) {
      // show snackbar
      this.globalStore.updateReceiptItemOfCurrentReceipt(receiptItem.id, receiptItem);
      this.updateLinesColor(receiptItem);
    }
  }

  async delete(receiptItem: ReceiptItem) {
    this.globalStore.deleteReceiptItemOfCurrentReceipt(receiptItem.id);

    try {
      await this.receiptItemService.deleteReceiptItem(receiptItem.id);
      this.updateLinesColor(receiptItem, 0x696969);
    } catch (error) {
      // show snackbar
      this.globalStore.addReceiptItemOfCurrentReceipt(receiptItem);
      this.updateLinesColor(receiptItem);
    }
  }

  public dropUpAnimationEnd = false;
  async add(type: ReceiptItemType) {
    this.currentReceiptItemType = type;
    this.resetCurrentReceiptItem();
    await this.hideOverviewAndShowAddItems();
  }

  async update(receiptItem: ReceiptItem) {
    // open add items with prefilled texts of inputs ... easy peasy
    this.receiptItemBeforeUpdate = cloneDeep(receiptItem);
    this.currentReceiptItem = cloneDeep(receiptItem);
    await this.hideOverviewAndShowAddItems();
  }

  // TODO: consider renamings
  async hideOverviewAndShowAddItems() {
    this.showDropup = false;
    await waitFor(() => this.dropUpAnimationEnd === this.showDropup);

    this.showEditItems = false;
    this.showAddItem = true;
    this.showDropup = true;
  }

  async hideAddItem() {
    this.showDropup = false;
    await waitFor(() => this.dropUpAnimationEnd === this.showDropup);

    this.showEditItems = true;
    this.showAddItem = false;
    this.showDropup = true;
  }

  async saveItem() {
    if (this.currentReceiptItem.id === 0) {
      await this.createItem();
    } else {
      await this.updateItem();
    }
  }

  private async createItem() {
    const dto = this.mapper.dtoFromReceiptItem(this.currentReceiptItem);
    const savedReceiptItemDto = await this.receiptItemService.createReceiptItem(dto);
    const savedReceiptItem = this.mapper.receiptItemFromDto(savedReceiptItemDto);
    this.globalStore.addReceiptItemOfCurrentReceipt(savedReceiptItem);
    this.updateLinesColor(savedReceiptItem);
  }

  private async updateItem() {
    this.updateLinesColor(this.receiptItemBeforeUpdate, 0x696969);

    try {
      this.globalStore.updateReceiptItemOfCurrentReceipt(this.currentReceiptItem.id, this.currentReceiptItem);
      const dto = this.mapper.dtoFromReceiptItem(this.currentReceiptItem);
      await this.receiptItemService.updateReceiptItem(this.currentReceiptItem.id, dto);
      this.updateLinesColor(this.currentReceiptItem, 0x03b700);
    } catch(error) {
      // show snackbar
      this.globalStore.updateReceiptItemOfCurrentReceipt(this.receiptItemBeforeUpdate.id, this.receiptItemBeforeUpdate);
      this.updateLinesColor(this.receiptItemBeforeUpdate, 0x696969);
    }
  }

  private updateLinesColor(receiptItem: ReceiptItem, color: number = null) {
    if (!color) {
      color = this.categories.find(it => it.id === receiptItem.categoryId).color;
    }

    if (receiptItem.labelLineId) {
      this.globalStore.updateLine(receiptItem.labelLineId, { color });
    }

    if (receiptItem.valueLineId) {
      this.globalStore.updateLine(receiptItem.valueLineId, { color });
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

  isTaxOrCategory() {
    return this.currentReceiptItem.type === ReceiptItemType.Tax
      || this.currentReceiptItem.type === ReceiptItemType.Category;
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
            {this.isTaxOrCategory() && <app-button-round size={Size.xxl} onPress={async () => { await this.saveItem(); await this.resetCurrentReceiptItem(); }}>
              <app-icon>{ MaterialIcons.NEXT_PLAN }</app-icon>
              <span>save and</span><br />
              <span>next</span>
            </app-button-round>}
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
