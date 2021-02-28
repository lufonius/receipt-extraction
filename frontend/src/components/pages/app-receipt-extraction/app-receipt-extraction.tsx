import {Component, Host, h, State} from '@stencil/core';
import {Inject} from "../../../global/di/inject";
import {GlobalStore} from "../../../global/global-store.service";
import {Line, Receipt} from "../../model/client";
import flyd from 'flyd';

@Component({
  tag: 'app-receipt-extraction',
  styleUrl: 'app-receipt-extraction.css',
  shadow: true,
})
export class AppReceiptExtraction {

  @Inject(GlobalStore) private globalStore: GlobalStore;
  @State() public currentReceipt: Receipt;

  componentDidLoad() {
    flyd.on((receipt) => {
      this.currentReceipt = receipt;
    }, this.globalStore.selectCurrentReceipt())
  }

  lineClicked(line: Line) {
    alert(line.text);
  }

  render() {
    return (
      <Host>
        <receipt-lines
          receipt={this.currentReceipt}
          onLineClick={(event: CustomEvent<Line>) => this.lineClicked(event.detail)}
        />
      </Host>
    );
  }
}
