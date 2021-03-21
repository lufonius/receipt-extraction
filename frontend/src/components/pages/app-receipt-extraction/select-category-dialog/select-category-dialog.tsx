import {Component, Host, h, Method, Prop, Event, EventEmitter, State} from '@stencil/core';
import {Category} from "../../../model/client";
import {Inject} from "../../../../global/di/inject";
import {GlobalStore} from "../../../../global/global-store.service";
import flyd from 'flyd';

@Component({
  tag: 'select-category-dialog',
  styleUrl: 'select-category-dialog.scss',
  shadow: true,
})
export class SelectCategoryDialog {

  @Inject(GlobalStore) private store: GlobalStore;

  @Prop() selectedCategoryId?: number;
  @Event() selectedCategoryIdChange: EventEmitter<number>;
  @State() public categories: Category[] = [];

  @State() searchText: string;

  public dialog: HTMLAppDialogElement;

  componentWillLoad() {
    flyd.on((categories) => this.categories = categories, this.store.selectCategories());
  }

  @Method() async show() {
    this.dialog.showChange(true);
  }

  @Method() async hide() {
    this.dialog.showChange(false);
  }

  matchesSearchText(category: Category): boolean {
    if (!this.searchText) return true;

    const lowerCaseCategoryName = category.name.toLowerCase();
    return lowerCaseCategoryName.includes(this.searchText);
  }

  setSearchText(event) {
    this.searchText = event.target.value.toLowerCase();
  }

  setSelectedCategoryAndClose() {
    this.selectedCategoryIdChange.emit(this.selectedCategoryId);
    this.hide();
  }

  render() {
    return (
      <Host>
        <app-dialog ref={(el) => this.dialog = el}>
          <div class="dialog">
            <div class="dialog-header">
              <h1>Set a category for the receipt item</h1>
              <app-input>
                <input
                  type="text"
                  class="full-width"
                  placeholder="Search for categories"
                  onInput={(e) => this.setSearchText(e)}
                />
              </app-input>
            </div>

            <div class="dialog-body">
              {this.categories
                .filter(category => this.matchesSearchText(category))
                .map((category) => <div
                class="category-item"
                onClick={() => this.selectedCategoryId = category.id}>
                <div class="category-item-divider full-width" />
                <div class={{ "category-item-body": true, selected: this.selectedCategoryId === category.id }}>
                  <div class="category-item-body-circle" style={({ "background-color": "#" + category.color.toString(16) })}/>
                  <div class="category-item-body-name">{category.name}</div>
                </div>
              </div>)}
            </div>
          <app-button
            primary
            fullWidth
            onPress={() => this.setSelectedCategoryAndClose()}>
            set selected category
          </app-button>
          </div>
        </app-dialog>
      </Host>
    );
  }
}
