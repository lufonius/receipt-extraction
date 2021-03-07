import {Component, Host, h, Prop} from '@stencil/core';

@Component({
  tag: 'list-item',
  styleUrl: 'list-item.scss',
  shadow: true,
})
export class ListItem {

  @Prop() label: string;
  @Prop() amount: string;

  render() {
    return (
      <Host>
        <div class="edit-item">
          <div class="edit-item-label">
            <span class="edit-item-label-title">{this.label}</span>
            <span class="edit-item-label-amount">{this.amount} CHF</span>
          </div>
          <div class="fill" />
          <div class="edit-item-controls">
            <slot name="controls" />
          </div>
        </div>
      </Host>
    );
  }

}
