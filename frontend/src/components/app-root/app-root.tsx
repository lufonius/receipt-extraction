import { Component, h } from '@stencil/core';
import {Inject} from "../../global/di/inject";
import {GlobalStore} from "../../global/global-store.service";
import {CategoryService} from "../pages/category.service";

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  shadow: false,
})
export class AppRoot {

  @Inject(GlobalStore) store: GlobalStore;
  @Inject(CategoryService) categoryService: CategoryService;

  async componentDidLoad() {
    const categories = await this.categoryService.getCategories();
    this.store.setCategories(categories);
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
