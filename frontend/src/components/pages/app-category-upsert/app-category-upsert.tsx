import {Component, Host, h, Prop, State} from '@stencil/core';
import {Inject} from "../../../global/di/inject";
import {GlobalStore} from "../../../global/global-store.service";
import {Category} from "../../model/client";
import flyd from "flyd";
import {Icons} from "../../../global/icons-enum";
import {RouterHistory} from "@stencil/router";
import {Size} from "../../common/size";
import {Components} from "../../../components";
import AppDialog = Components.AppDialog;
import hsl from 'hsl-to-hex';
import {CategoryService} from "../category.service";
import {SnackbarService} from "../snackbar.service";

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
  @Inject(CategoryService) categoryService: CategoryService;
  @Inject(SnackbarService) snackbarService: SnackbarService;
  @State() private category: Category;

  private dialog: AppDialog;
  @State() private colors: Array<Array<string>> = [];

  componentDidLoad() {
    this.mode = this.match.params.id ? 'update' : 'insert';
    this.id = parseInt(this.match.params.id);

    if (this.mode === "update") {
      flyd.on((categories) => {
        this.category = {...categories.get(this.id)};
      }, this.store.selectCategoriesById());
    } else {
      this.category = {
        id: 0,
        name: "",
        color: parseInt("3D66C3", 16),
        avatarUrl: "",
        deleted: false
      };
    }

    this.colors = this.generateColors();
  }

  generateColors(): Array<Array<string>> {
    const result = [];

    for (let h = 360; h > 0; h -= 40) {
      const line = [];

      for (let sl = 100; sl > 40; sl -= 10) {
        line.push(hsl(h, sl, 20 + (sl / 2)));
      }

      result.push(line);
    }

    return result;
  }

  setColorAndCloseDialog(color: string) {
    const decimalColor = this.convertColorStringToDecimal(color);
    this.category = {...this.category, color: decimalColor};
    this.dialog.isVisible(false);
  }

  convertColorStringToDecimal(hex: string): number {
    const withoutHashtag = hex.substring(1);
    return parseInt(withoutHashtag, 16);
  }

  async save() {
    try {
      if (this.mode === 'update') {
       await this.categoryService.update(this.id, this.category);
       this.store.updateCategory(this.category);
       this.snackbarService.showSuccessSnack("Updated");
      } else {
        this.category = await this.categoryService.insert(this.category);
        console.log(this.category);
        this.store.addCategory(this.category);
        this.snackbarService.showSuccessSnack("Added")
      }

      this.back();
    } catch {
      this.snackbarService.showFailureSnack("Failed");
    }
  }

  back() {
    this.history.goBack();
  }

  render() {
    return (
      <Host>
        <div class="page-layout">
          <div class="fill" />
          <div class="edit-container">
            <div class="category-color-container">
              <span class="category-color-label">Color</span>
              <div
                class="category-color"
                style={({ background: this.category ? "#" + this.category?.color.toString(16) : null })}
                onClick={() => this.dialog.isVisible(true)}
              />
            </div>
            <div class="spacer" />
            <app-input
              value={this.category?.name}
              onInputValueChange={({ detail: name }) => this.category = {...this.category, name}}
              label="Category name"

            />
          </div>
          <div class="controls-container">
            <app-button-round
              classes="button-round--primary"
              label="back"
              onPress={() => this.back()}
            >
              <app-icon
                icon={Icons.ARROW_LEFT}
                size={Size.m} />
            </app-button-round>

            <div class="fill" />

            <app-button-round
              classes="button-round--primary"
              label="save"
              onPress={() => this.save()}
            >
              <app-icon
                icon={Icons.SAVE}
                size={Size.m} />
            </app-button-round>
          </div>
        </div>

        <app-dialog ref={(el) => this.dialog = el}>
          <div class="dialog">
            <div class="dialog-header">
              <h4>choose color</h4>
            </div>
            <app-divider />
            <div class="dialog-body">
              {this.colors.map(it => <div class="category-color-line">
                {it.map(color => <div
                  class="category-color"
                  style={({ background: color })}
                  onClick={() => this.setColorAndCloseDialog(color)}
                />)}
              </div>)}
            </div>
          </div>
        </app-dialog>

        <app-navbar activeUrl="/category" history={this.history} />
      </Host>
    );
  }

}
