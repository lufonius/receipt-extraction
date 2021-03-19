import {Component, Host, h, Prop} from '@stencil/core';
import {MaterialIcons} from "../../../../../global/material-icons-enum";

@Component({
  tag: 'list-item',
  styleUrl: 'list-item.scss',
  shadow: true,
})
export class ListItem {

  @Prop() label: string;
  @Prop() amount: string;

  hasAnyValueSet() {
    return this.label !== "null" && this.amount !== "null";
  }

  render() {
    return (
      <Host>
        <div class="edit-item">
          {this.hasAnyValueSet() && <div class="edit-item-label">
              <span class="edit-item-label-title">{this.label}</span>
              <span class="edit-item-label-amount">{this.amount} CHF</span>
          </div>}

          {!this.hasAnyValueSet() && <div class="edit-item-label">
            <span class="edit-item-label-novalue">Please select the total</span>
          </div>}
          <div class="fill" />
          <div class="edit-item-controls">
            <slot name="controls" />
          </div>
        </div>
      </Host>
    );
  }

}
