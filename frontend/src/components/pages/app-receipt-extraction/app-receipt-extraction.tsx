import {Component, h, Host, Prop, State} from '@stencil/core';
import {Inject} from "../../../global/di/inject";
import {GlobalStore} from "../../../global/global-store.service";
import {Category, Line, Receipt, ReceiptItem} from "../../model/client";
import flyd from 'flyd';
import {ReceiptItemService} from "./receipt-item.service";
import {Size} from "../../common/size";
import {Icons} from "../../../global/icons-enum";
import {waitFor} from "../../../global/waitFor";
import {Mapper} from "../../model/mapper";
import {cloneDeep} from "../../model/cloneDeep";
import {ReceiptService} from "../receipt.service";
import {RouterHistory} from "@stencil/router";
import {SnackbarService} from "../snackbar.service";
import {Components} from "../../../components";
import SelectCategoryDialog = Components.SelectCategoryDialog;

@Component({
  tag: 'app-receipt-extraction',
  styleUrl: 'app-receipt-extraction.scss',
  shadow: true,
})
export class AppReceiptExtraction {
  @Inject(GlobalStore) private globalStore: GlobalStore;
  @Inject(ReceiptItemService) private receiptItemService: ReceiptItemService;
  @Inject(Mapper) private mapper: Mapper;
  @Inject(ReceiptService) private receiptService: ReceiptService;
  @Inject(SnackbarService) private snackbarService: SnackbarService;

  @Prop() history: RouterHistory;

  @State() public total: number;
  @State() public date: string;
  @State() public items: ReceiptItem[] = [];
  @State() public showDropup: boolean = false;
  @State() public showEditItemsPanel: boolean = true;
  @State() public showAddItemPanel: boolean = false;
  @State() public showEditTotalPanel: boolean = false;
  @State() public showEditDatePanel: boolean = false;
  @State() public showEditItemCategoryDialog: boolean = false;
  public receiptItemBeforeUpdate: ReceiptItem;
  @State() public currentReceiptItem: ReceiptItem;
  @State() submitted: boolean = false;
  @State() valid: boolean = false;
  private currentReceipt: Receipt;
  public receiptItemAdd: HTMLReceiptItemAddElement;
  private categories: Category[];
  private selectCategoryDialog: SelectCategoryDialog;

  componentWillLoad() {
    flyd.on((hasAnyItems) => {
      this.showDropup = hasAnyItems;
    }, this.globalStore.selectHasCurrentReceiptAnyItems());

    flyd.on((categories) => this.categories = categories, this.globalStore.selectCategories());

    // TODO: currently, the problem is only with the receipt items. until we do not have a distinct select, let's just clone depp
    flyd.on((receipt) => this.currentReceipt = cloneDeep(receipt), this.globalStore.selectCurrentReceipt());
    flyd.on(total => this.total = total, this.globalStore.selectTotalOfCurrentReceipt());
    flyd.on(date => this.date = date, this.globalStore.selectDateOfCurrentReceipt());
    flyd.on(items => this.items = cloneDeep(items), this.globalStore.selectCategoryItemsOfCurrentReceipt());
  }

  async lineClicked(line: Line) {
    if (this.showAddItemPanel) {
      await this.receiptItemAdd.componentOnReady();
      await this.receiptItemAdd.selectLine(line);
    }
  }

  async delete(receiptItem: ReceiptItem) {
    this.globalStore.deleteReceiptItemOfCurrentReceipt(receiptItem.id);

    try {
      await this.receiptItemService.deleteReceiptItem(receiptItem.id);
      this.updateLinesColor(receiptItem, 0x696969);
      this.snackbarService.showSuccessSnack("deleted");
    } catch (error) {
      this.globalStore.addReceiptItemOfCurrentReceipt(receiptItem);
      this.updateLinesColor(receiptItem);
      this.snackbarService.showFailureSnack("failure");
    }
  }

  public dropUpAnimationEnd = false;
  async showAddItem() {
    this.resetCurrentReceiptItem();
    await this.hideDropupAndExecuteFn(true, () => this.showAddItemPanel = true);
  }

  async showUpdateItem(receiptItem: ReceiptItem) {
    // clonedeep, as we would mutate the state directly, and immer.js does not like that
    // (it's also bad practice)
    this.receiptItemBeforeUpdate = cloneDeep(receiptItem);
    this.currentReceiptItem = cloneDeep(receiptItem);
    await this.hideDropupAndExecuteFn(true, () => this.showAddItemPanel = true);
  }

  async showEditTotal() {
    await this.hideDropupAndExecuteFn(true, () => this.showEditTotalPanel = true);
  }

  async showEditDate() {
    await this.hideDropupAndExecuteFn(true, () => this.showEditDatePanel = true);
  }

  async hideDropupAndExecuteFn(ignoreValidity: boolean, fn: () => void) {
    if (this.valid || ignoreValidity) {
      this.showDropup = false;
      await waitFor(() => this.dropUpAnimationEnd === this.showDropup);

      this.showEditItemsPanel = false;
      fn();
      this.showDropup = true;
    }
  }

  async closeAddItem(ignoreValidity: boolean) {
      this.hideDropupAndExecuteFn(ignoreValidity, () => {
        this.showEditItemsPanel = true;
        this.showAddItemPanel = false;
        this.submitted = false;
      });
  }

  async closeEditTotal(ignoreValidity: boolean) {
    this.hideDropupAndExecuteFn(ignoreValidity, () => {
      this.showEditItemsPanel = true;
      this.showEditTotalPanel = false;
      this.submitted = false;
    });
  }

  async closeEditDate(ignoreValidity: boolean) {
    this.hideDropupAndExecuteFn(ignoreValidity, () => {
      this.showEditItemsPanel = true;
      this.showEditDatePanel = false;
      this.submitted = false;
    });
  }

  async saveItem() {
    if (this.currentReceiptItem.id === 0) {
      await this.createItem();
    } else {
      await this.updateItem();
      await this.hideDropupAndExecuteFn(false, () => {
        this.showAddItemPanel = false;
        this.showEditItemsPanel = true;
      });
    }
  }

  private async createItem() {
    try {
      const dto = this.mapper.dtoFromReceiptItem(this.currentReceiptItem);
      const savedReceiptItemDto = await this.receiptItemService.createReceiptItem(dto);
      const savedReceiptItem = this.mapper.receiptItemFromDto(savedReceiptItemDto);
      this.globalStore.addReceiptItemOfCurrentReceipt(savedReceiptItem);
      this.updateLinesColor(savedReceiptItem);
      this.snackbarService.showSuccessSnack("Saved");
    } catch {
      this.snackbarService.showFailureSnack("Failed");
    }
  }

  private showSelectItemCategoryDialog(receiptItem: ReceiptItem) {
    this.receiptItemBeforeUpdate = cloneDeep(receiptItem);
    this.currentReceiptItem = cloneDeep(receiptItem);
    this.selectCategoryDialog.show();
  }

  private async updateItem() {
    this.updateLinesColor(this.receiptItemBeforeUpdate, 0x696969);

    try {
      this.globalStore.updateReceiptItemOfCurrentReceipt(this.currentReceiptItem.id, this.currentReceiptItem);
      const dto = this.mapper.dtoFromReceiptItem(this.currentReceiptItem);
      await this.receiptItemService.updateReceiptItem(this.currentReceiptItem.id, dto);
      this.updateLinesColor(this.currentReceiptItem, null);
      this.snackbarService.showSuccessSnack("updated");
    } catch(error) {
      this.globalStore.updateReceiptItemOfCurrentReceipt(this.receiptItemBeforeUpdate.id, this.receiptItemBeforeUpdate);
      this.updateLinesColor(this.receiptItemBeforeUpdate, 0x696969);
      this.snackbarService.showFailureSnack("failure");
    }
  }

  private updateLinesColor(receiptItem: ReceiptItem, color: number = null) {
    if (!color) {
      color = this.categories.find(it => it.id === receiptItem.categoryId)?.color;

      if(!color) {
        color = 0x696969;
      }
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
        price: null,
        valueLineId: null,
        receiptId: this.currentReceipt.id,
        categoryId: this.currentReceiptItem?.categoryId
      };
  }

  async saveItemAndNext() {
    this.submitted = true;

    if (this.valid) {
      await this.saveItem();
      this.resetCurrentReceiptItem();
      this.submitted = false;
    }
  }

  async saveReceiptAndClose() {
    try {
      this.currentReceipt.transactionTotal = this.total;
      this.currentReceipt.transactionDate = this.date;

      const dto = this.mapper.receiptDtoFromReceipt(this.currentReceipt);
      await this.receiptService.update(this.currentReceipt.id, dto);
      this.globalStore.setCurrentReceipt(this.currentReceipt);
      this.currentReceipt = cloneDeep(this.currentReceipt);
      this.snackbarService.showSuccessSnack("Saved");
      this.closeEditTotal(true);
      this.closeEditDate(true);
    } catch {
      this.snackbarService.showFailureSnack("Failure");
    }
  }


  async endExtraction() {
    try {
      this.showDropup = false;
      await waitFor(() => this.dropUpAnimationEnd === this.showDropup);

      await this.receiptService.endExtraction(this.currentReceipt.id);
      this.history.push("/");
      this.snackbarService.showSuccessSnack("done")
    } catch (error) {
      this.snackbarService.showFailureSnack("error completing extraction")
    }
  }

  render() {
    return (
      <Host>
        <dropup-controls
          show={this.showDropup}
          onContainerShownAnimationEnd={({ detail: show }) => this.dropUpAnimationEnd = show}
        >
          {this.showEditItemsPanel && <div class="controls" slot="controls">
            <app-button-round size={Size.xl} onPress={() => this.history.goBack()} classes="button-round--primary" class="back-button" label="back">
              <app-icon icon={Icons.ARROW_LEFT} />
            </app-button-round>
            <app-button-round size={Size.xl} onPress={() => this.showDropup = !this.showDropup} classes="button-round--primary" label="entries">
              <app-icon icon={Icons.CHEVRONS_DOWN} />
            </app-button-round>
            <div class="fill" />
            <app-button-round size={Size.xl} onPress={() => this.endExtraction()} classes="button-round--primary" label="done">
              <app-icon icon={Icons.CHECK_CIRCLE} />
            </app-button-round>
          </div>}

          {this.showAddItemPanel && <div class="controls" slot="controls">
            <app-button-round size={Size.xl} onPress={() => this.closeAddItem(true)} classes="button-round--primary" label="close">
              <app-icon icon={Icons.CLOSE} />
            </app-button-round>
            <div class="fill" />
            <div class="spacer-xs" />
            <app-button-round size={Size.xl} onPress={async () => { await this.saveItemAndNext(); }} classes="button-round--primary" label="save">
              <app-icon icon={Icons.SAVE} />
            </app-button-round>
          </div>}

          {this.showEditTotalPanel && <div class="controls" slot="controls">
            <app-button-round size={Size.xl} onPress={() => this.closeEditTotal(true)} classes="button-round--primary" label="close">
              <app-icon icon={Icons.CLOSE} />
            </app-button-round>
            <div class="fill" />
            <div class="spacer-xs" />
            <app-button-round size={Size.xl} onPress={async () => { await this.saveReceiptAndClose(); }} classes="button-round--primary" label="save">
              <app-icon icon={Icons.SAVE} />
            </app-button-round>
          </div>}

          {this.showEditDatePanel && <div class="controls" slot="controls">
            <app-button-round size={Size.xl} onPress={() => this.closeEditDate(true)} classes="button-round--primary" label="close">
              <app-icon icon={Icons.CLOSE} />
            </app-button-round>
            <div class="fill" />
            <div class="spacer-xs" />
            <app-button-round size={Size.xl} onPress={async () => {
              if (this.valid) { await this.saveReceiptAndClose(); }
              this.submitted = true;
            }} classes="button-round--primary" label="save">
              <app-icon icon={Icons.SAVE} />
            </app-button-round>
          </div>}

          <div slot="dropup">
            {this.showEditTotalPanel && <receipt-total-edit
              total={this.currentReceipt.transactionTotal}
              onTotalChange={({detail: total}) => this.total = total}
              submitted={this.submitted}
            />}

            {this.showEditDatePanel && <receipt-date-edit
              date={this.currentReceipt.transactionDate}
              onDateChange={({ detail: date }) => this.date = date}
              submitted={this.submitted}
              onValidChange={({ detail: valid }) => this.valid = valid}
            />}

            {this.showAddItemPanel && <receipt-item-add
              receiptItem={this.currentReceiptItem}
              submitted={this.submitted}
              onFormValidChange={({ detail: valid }) => this.valid = valid}
              onReceiptItemChange={({ detail }) => this.currentReceiptItem = detail}
              categories={this.categories}
              ref={(el) => this.receiptItemAdd = el} />}

            {this.showEditItemsPanel && <receipt-items-edit
              total={this.total}
              date={this.date}
              items={this.items}
              onDeleteItem={(item: CustomEvent<ReceiptItem>) => this.delete(item.detail)}
              onShowUpdateItem={(item: CustomEvent<ReceiptItem>) => this.showUpdateItem(item.detail)}
              onShowAddItem={() => this.showAddItem()}
              onShowUpdateTotal={() => this.showEditTotal()}
              onShowUpdateDate={() => this.showEditDate()}
              onShowUpdateItemCategory={({ detail: receiptItem }) => this.showSelectItemCategoryDialog(receiptItem)}
            />}
          </div>
        </dropup-controls>

        <receipt-lines onLineClick={(event: CustomEvent<Line>) => this.lineClicked(event.detail)} />

        <select-category-dialog
          ref={(el) => this.selectCategoryDialog = el}
          selectedCategoryId={this.currentReceiptItem?.categoryId}
          onSelectedCategoryIdChange={async ({ detail: categoryId }) => {
            this.currentReceiptItem.categoryId = categoryId;
            await this.updateItem();
            await this.selectCategoryDialog.hide();
          }}
        />
      </Host>
    );
  }
}
