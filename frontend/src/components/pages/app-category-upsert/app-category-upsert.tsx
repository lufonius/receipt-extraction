import {Component, Host, h, Prop, State} from '@stencil/core';
import {Inject} from "../../../global/di/inject";
import {GlobalStore} from "../../../global/global-store.service";
import {Category} from "../../model/client";
import flyd from "flyd";
import {Icons} from "../../../global/icons-enum";
import {RouterHistory} from "@stencil/router";
import {Size} from "../../common/size";

@Component({
  tag: 'app-category-upsert',
  styleUrl: 'app-category-upsert.scss',
  shadow: true,
})
export class AppCategoryUpsert {

  @Prop() match: any;
  @Prop() history: RouterHistory;

  private id: number;
  @Prop() mode: 'insert' | 'update';
  @Inject(GlobalStore) store: GlobalStore;
  @State() private category: Category;

  componentDidLoad() {
    this.mode = this.match.params.id ? 'update' : 'insert';
    this.id = parseInt(this.match.params.id);

    if (this.mode === "update") {
      flyd.on((categories) => {
        this.category = categories.get(this.id);
      }, this.store.selectCategoriesById());
    }
  }

  render() {
    return (
      <Host>
        <div class="page-layout">
          <div class="fill" />
          <div class="edit-container">
            <div class="category-color-container">
              <span class="category-color-label">Color</span>
              <div class="category-color" style={({ background: this.category ? "#" + this.category?.color.toString(16) : null })}/>
            </div>
            <div class="spacer" />
            <app-input value={this.category?.name} label="Category name" />
          </div>
          <div class="controls-container">
            <app-button-round classes="button-round--primary" label="back">
              <app-icon
                icon={Icons.ARROW_LEFT}
                size={Size.m} />
            </app-button-round>

            <div class="fill" />

            <app-button-round classes="button-round--primary" label="save">
              <app-icon
                icon={Icons.SAVE}
                size={Size.m} />
            </app-button-round>
          </div>
        </div>

        <app-navbar activeUrl="/category" history={this.history} />
      </Host>
    );
  }

}
