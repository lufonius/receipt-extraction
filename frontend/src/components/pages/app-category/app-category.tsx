import {Component, Host, h, Prop, State} from '@stencil/core';
import {RouterHistory} from "@stencil/router";
import {Inject} from "../../../global/di/inject";
import {GlobalStore} from "../../../global/global-store.service";
import {Category} from "../../model/client";
import * as flyd from "flyd";
import {Icons} from "../../../global/icons-enum";
import {Size} from "../../common/size";
import {CategoryService} from "../category.service";
import {SnackbarService} from "../snackbar.service";

@Component({
  tag: 'app-category',
  styleUrl: 'app-category.scss',
  shadow: true,
})
export class AppCategory {

  @Prop() history: RouterHistory;

  @Inject(GlobalStore) store: GlobalStore;
  @Inject(CategoryService) categoryService: CategoryService;
  @Inject(SnackbarService) snackbarService: SnackbarService;
  @State() categories: Array<Category> = [];

  componentDidLoad() {
    flyd.on((categories: Array<Category>) => this.categories = categories, this.store.selectCategories(false));
  }

  async deleteCategory(category: Category) {
    try {
      this.store.deleteCategory(category.id);
      await this.categoryService.delete(category.id);
      this.snackbarService.showSuccessSnack("Deleted")
    } catch {
      this.store.addCategory(category);
      this.snackbarService.showFailureSnack("Failure");
    }
  }

  redirectToUpsertPage(id?: number) {
    const link = id ? `/category-upsert/${id}` : "/category-upsert";
    this.history.push(link);
  }

  render() {
    return (
      <Host>
        <div class="page-layout">
          <div class="header">
            <h1>Categories</h1>
            <p>Manage categories here</p>
          </div>
          <div class="body">
            {this.categories.map(it =>
              <div>
                <div class="category-item">
                  <div class="category-color" style={({ background: "#" + it.color.toString(16) })} />
                  <span>{ it.name }</span>

                  <div class="fill" />
                  <div class="category-controls">
                    <app-button-round size={Size.l} onPress={() => this.redirectToUpsertPage(it.id)}>
                      <app-icon icon={Icons.EDIT} size={Size.sm} />
                    </app-button-round>
                    <app-button-round size={Size.l} onPress={() => this.deleteCategory(it)}>
                      <app-icon icon={Icons.DELETE} size={Size.sm} />
                    </app-button-round>
                  </div>
                </div>

                <app-divider />
              </div>
            )}

            <div class="new-button">
              <app-button-round
                classes="button-round--primary"
                size={Size.xl}
                label="new"
                onPress={() => this.redirectToUpsertPage(null)}
              >
                <app-icon icon={Icons.ADD} />
              </app-button-round>
            </div>
          </div>
        </div>

        <app-navbar activeUrl="/category" history={this.history} />
      </Host>
    );
  }
}
