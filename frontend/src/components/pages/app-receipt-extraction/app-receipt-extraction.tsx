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

  lineClicked(line: Line) {
    alert(line.text + " / " + line.id);
  }

  render() {
    return (
      <Host>
        <receipt-items-edit />
        <receipt-lines onLineClick={(event: CustomEvent<Line>) => this.lineClicked(event.detail)} />
      </Host>
    );
  }
}
