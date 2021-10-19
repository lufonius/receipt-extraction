import {Component, Host, h, Prop, State} from '@stencil/core';
import {RouterHistory} from "@stencil/router";
import {Inject} from "../../../global/di/inject";
import {GlobalStore} from "../../../global/global-store.service";
import {Category} from "../../model/client";
import * as flyd from "flyd";
import {Icons} from "../../../global/icons-enum";
import {Size} from "../../common/size";

@Component({
  tag: 'app-category',
  styleUrl: 'app-category.scss',
  shadow: true,
})
export class AppCategory {

  @Prop() history: RouterHistory;

  @Inject(GlobalStore) store: GlobalStore;
  @State() categories: Array<Category> = [];

  componentDidLoad() {
    flyd.on((categories: Array<Category>) => this.categories = categories, this.store.selectCategories());
  }

  render() {
    return (
      <Host>
        <div class="page-layout">
          <div class="header">
            <h4>Categories</h4>
            <p>Manage categories here</p>
          </div>
          <div class="body">
            {this.categories.map(it =>
              <div>
                <div class="category-item">
                  <span>{ it.name }</span>

                  <div class="fill" />
                  <div class="category-controls">
                    <app-button-round size={Size.l}>
                      <app-icon icon={Icons.EDIT} size={Size.sm} />
                    </app-button-round>
                    <app-button-round size={Size.l}>
                      <app-icon icon={Icons.DELETE} size={Size.sm} />
                    </app-button-round>
                  </div>
                </div>

                <app-divider />
              </div>
            )}
          </div>
        </div>

        <app-navbar activeUrl="/category" history={this.history} />
      </Host>
    );
  }
}
