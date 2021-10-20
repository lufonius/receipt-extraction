import {Component, h, State} from '@stencil/core';
import {Inject} from "../../global/di/inject";
import {GlobalStore} from "../../global/global-store.service";
import {CategoryService} from "../pages/category.service";
import {SnackbarService} from "../pages/snackbar.service";
import flyd from "flyd";
import {cloneDeep} from "../model/cloneDeep";
import { v4 as uuid } from 'uuid';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  shadow: false,
})
export class AppRoot {

  @Inject(GlobalStore) store: GlobalStore;
  @Inject(CategoryService) categoryService: CategoryService;
  @Inject(SnackbarService) snackbarService: SnackbarService;

  @State() private snackbar: { message: string, type: 'success' | 'failure', show: boolean } = null;

  async componentWillLoad() {
    const categories = await this.categoryService.getCategories();
    this.store.setCategories(categories);

    flyd.on((message) => this.showSnackbar('success', message),this.snackbarService.successSnacks)
  }

  private showSnackbar(type: 'success' | 'failure', message: string) {
    this.snackbar = { message, type, show: false };

    setTimeout(() => {
      this.snackbar = {...this.snackbar, show: true};
    }, 20);

    setTimeout(() => {
      this.snackbar = {...this.snackbar, show: false};
    }, 2000)
  }

  addPWA() {
    if (!window.beforeInstallEvent) {
      // The deferred prompt isn't available.
      return;
    }
    // Show the install prompt.
    window.beforeInstallEvent.prompt();
    // Log the result
    window.beforeInstallEvent.userChoice.then((result) => {
      console.log('👍', 'userChoice', result);
      // Reset the deferred prompt variable, since
      // prompt() can only be called once.
    });
  }

  render() {
    return (
      <div>
        {this.snackbar && <app-snackbar message={this.snackbar.message} type={this.snackbar.type} show={this.snackbar.show} />}
        <main>
          <stencil-router>
            <stencil-route-switch scrollTopOffset={0}>
              <stencil-route url="/" component="app-receipt-lists" exact={true} />
              <stencil-route url="/category" component="app-category" />
              <stencil-route url="/profile/:name" component="app-profile" />
              <stencil-route url="/edit-image" component="app-crop" />
              <stencil-route url="/qr-generation" component="app-qr-generation" />
              <stencil-route url="/qr-scan" component="app-qr-scan" />
              <stencil-route url="/receipt-extraction" component="app-receipt-extraction" />
              <stencil-route url="/components" component="app-components" />
            </stencil-route-switch>
          </stencil-router>
        </main>
      </div>
    );
  }
}
