import {Component, Host, h, Prop} from '@stencil/core';
import {Category} from "../../../../model/client";

@Component({
  tag: 'list-item',
  styleUrl: 'list-item.scss',
  shadow: true,
})
export class ListItem {

  @Prop() label: string;
  @Prop() amount: string;
  @Prop() emptyLabel: string = "Please select the values on the receipt";
  @Prop() category: Category;

  hasAnyValueSet() {
    return (this.label !== "null" || this.amount !== "null") && (!!this.label || !!this.amount);
  }

  render() {
    return (
      <Host>
        <div class="edit-item">
          {this.hasAnyValueSet() &&
          <div class="edit-item-label">
              {!!this.category && <div class="category">
                <div class="category-circle" style={({ "background-color": "#" + this.category.color.toString(16) })} />
                <span>{ this.category.name }</span>
              </div>}
              <span class="edit-item-label-title">{this.label}</span>
              <span class="edit-item-label-amount">{this.amount} CHF</span>
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
