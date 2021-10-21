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
    flyd.on((categories) => this.categories = categories, this.store.selectCategories(false));
  }

  @Method() async show() {
    await this.dialog.isVisible(true);
  }

  @Method() async hide() {
    await this.dialog.isVisible(false);
  }

  matchesSearchText(category: Category): boolean {
    if (!this.searchText) return true;

    const lowerCaseCategoryName = category.name.toLowerCase();
    return lowerCaseCategoryName.includes(this.searchText);
  }

  setSearchText(text) {
    this.searchText = text.toLowerCase();
  }

  setSelectedCategoryAndClose() {
    this.selectedCategoryIdChange.emit(this.selectedCategoryId);
    this.hide();
  }

  setSelectedCategory(category: Category) {
    this.selectedCategoryId = category.id
    this.setSelectedCategoryAndClose();
  }

  render() {
    return (
      <Host>
        <app-dialog ref={(el) => this.dialog = el}>
          <div class="dialog">
            <div class="dialog-header">
              <div>
                <h1>Set a category for the receipt item</h1>
                <app-input
                  focused={true}
                  placeholder="Search for categories"
                  onInputValueChange={({ detail: text }) => this.setSearchText(text)}
                />
              </div>
            </div>
            <div class="dialog-body">
              {this.categories
                .filter(category => this.matchesSearchText(category))
                .map((category) => <div
                class="category-item"
                onClick={() => this.setSelectedCategory(category)}>
                <app-divider />
                <div class={{ "category-item-body": true, selected: this.selectedCategoryId === category.id }}>
                  <div class="category-item-body-circle" style={({ "background-color": "#" + category.color.toString(16) })}/>
                  <div class="category-item-body-name">{category.name}</div>
                </div>
              </div>)}
            </div>
            </div>
        </app-dialog>
      </Host>
    );
  }
}
