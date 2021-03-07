import {Component, h, Host, Prop, State, Watch} from '@stencil/core';
import {MaterialIcons} from "../../../../global/material-icons-enum";
import {Size} from "../../../common/size";
import {Receipt, ReceiptItemType} from "../../../model/client";
import {Inject} from "../../../../global/di/inject";
import {GlobalStore} from "../../../../global/global-store.service";
import flyd from "flyd";

@Component({
  tag: 'receipt-items-edit',
  styleUrl: 'receipt-items-edit.scss',
  shadow: true,
})
export class ReceiptItemsEdit {
  @Inject(GlobalStore) private globalStore: GlobalStore;
  @State() public currentReceipt: Receipt;

  @State() public show: boolean = false;
  @State() editContainerClasses: string;

  componentDidLoad() {
    flyd.on((receipt) => {
      this.currentReceipt = receipt;
      this.show = this.currentReceipt.items.length > 0;
      this.toggleItemsVisibility();
    }, this.globalStore.selectCurrentReceipt());
  }

  @Watch("show")
  showChanged() {
    this.toggleItemsVisibility();
  }

  toggleItemsVisibility() {
    this.editContainerClasses = `edit-container ${this.show ? "open" : "closed"}`;
  }

  viewListButtonClicked() {
    this.show = !this.show;
    this.toggleItemsVisibility();
  }

  render() {
    return (
      <Host>
        {this.currentReceipt && <div>
          <div class="backdrop-container">
            <div class="fill" />
            <div class="edit-controls">
              <app-button-round size={Size.xxl}>
                <app-icon>{ MaterialIcons.DONE_ALL }</app-icon>
                <span>done</span>
              </app-button-round>
              <div class="fill" />
              <app-button-round size={Size.xxl} onPress={() => this.viewListButtonClicked()}>
                <app-icon>{ MaterialIcons.VIEW_LIST }</app-icon>
                <span>entries</span>
              </app-button-round>
            </div>
            <div class={this.editContainerClasses}>
              <list-item label="Total" amount={`${this.currentReceipt.total.toString(2)}`}>
                <div slot="controls">
                  <app-button-round size={Size.l}>
                    <app-icon>{MaterialIcons.EDIT}</app-icon>
                  </app-button-round>
                  <div class="spacer-xs" />
                  <app-button-round size={Size.l}>
                    <app-icon>{MaterialIcons.DELETE}</app-icon>
                  </app-button-round>
                </div>
              </list-item>
`
              <list-item label="Date" amount={`${this.currentReceipt.date}`}>
                <div slot="controls">
                  <app-button-round size={Size.l}>
                    <app-icon>{MaterialIcons.EDIT}</app-icon>
                  </app-button-round>
                  <div class="spacer-xs" />
                  <app-button-round size={Size.l}>
                    <app-icon>{MaterialIcons.DELETE}</app-icon>
                  </app-button-round>
                </div>
              </list-item>

              <div class="divider">
                Taxes
                <div class="fill" />
                <app-button-round size={Size.l}>
                  <app-icon>{MaterialIcons.ADD}</app-icon>
                </app-button-round>
              </div>

              {this.currentReceipt.items
                .filter(it => it.type === ReceiptItemType.Tax)
                .map(it =>
                  <list-item label={`${it.label}`} amount={`${it.amount}`}>
                  <div slot="controls">
                  <app-button-round size={Size.l}>
                  <app-icon>{MaterialIcons.DELETE}</app-icon>
                  </app-button-round>
                  </div>
                  </list-item>
                )
              }

              <div class="divider">
                Items
                <div class="fill" />
                <app-button-round size={Size.l}>
                  <app-icon>{MaterialIcons.ADD}</app-icon>
                </app-button-round>
              </div>

              {this.currentReceipt.items
                .filter(it => it.type === ReceiptItemType.Category)
                .map(it =>
                  <list-item label={`${it.label}`} amount={`${it.amount}`}>
                    <div slot="controls">
                      <app-button-round size={Size.l}>
                        <app-icon>{MaterialIcons.DELETE}</app-icon>
                      </app-button-round>
                    </div>
                  </list-item>
                )
              }
            </div>
          </div>
          <app-backdrop show={this.show} withAnimation={true} />
        </div> }
      </Host>
    );
  }

}
