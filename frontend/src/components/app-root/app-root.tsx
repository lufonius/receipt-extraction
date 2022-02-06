import {Component, h, State} from '@stencil/core';
import {Inject} from "../../global/di/inject";
import {GlobalStore} from "../../global/global-store.service";
import {CategoryService} from "../pages/category.service";
import {SnackbarService} from "../pages/snackbar.service";
import flyd from "flyd";
import {AuthService} from "../pages/auth.service";

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  shadow: false,
})
export class AppRoot {

  @Inject(GlobalStore) store: GlobalStore;
  @Inject(CategoryService) categoryService: CategoryService;
  @Inject(AuthService) authService: AuthService;
  @Inject(SnackbarService) snackbarService: SnackbarService;


  @State() private snackbar: { message: string, type: 'success' | 'failure', show: boolean } = null;

  async componentWillLoad() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const categories = await this.categoryService.get();
      this.store.setCategories(categories);
    }

    flyd.on((message) => this.showSnackbar('success', message),this.snackbarService.successSnacks);
    flyd.on((message) => this.showSnackbar('failure', message),this.snackbarService.failureSnacks);
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

  private PrivateRoute = ({ component, ...props}: { [key: string]: any}) => {
    const Component = component;

    return (
      <stencil-route {...props} routeRender={
        (props: { [key: string]: any}) => {
          const currentUser = this.authService.getCurrentUser();
          if (currentUser && currentUser.registrationConfirmed) {
            return <Component {...props} {...props.componentProps}></Component>;
          } else if (currentUser && !currentUser.registrationConfirmed) {
            return <stencil-router-redirect url="/registration-confirmation-sent"></stencil-router-redirect>
          } else {
            return <stencil-router-redirect url="/login"></stencil-router-redirect>
          }
        }
      }/>
    );
  }

  render() {
    return (
      <div>
        {this.snackbar && <app-snackbar message={this.snackbar.message} type={this.snackbar.type} show={this.snackbar.show} />}
        <main>
          <stencil-router>
            <stencil-route-switch scrollTopOffset={0}>
              <this.PrivateRoute url="/" component="app-receipt-lists" exact={true} />
              <this.PrivateRoute url="/category" component="app-category" />
              <this.PrivateRoute url="/category-upsert/:id" component="app-category-upsert" />
              <this.PrivateRoute url="/category-upsert" component="app-category-upsert" />
              <this.PrivateRoute url="/edit-image" component="app-crop" />
              <this.PrivateRoute url="/qr-generation" component="app-qr-generation" />
              <this.PrivateRoute url="/qr-scan" component="app-qr-scan" />
              <this.PrivateRoute url="/receipt-extraction" component="app-receipt-extraction" />
              <this.PrivateRoute url="/profile" component="app-profile" />
              <stencil-route url="/register" component="app-register" />
              <stencil-route url="/confirm-registration/:activationCode" component="app-confirm-registration" />
              <stencil-route url="/login" component="app-login" />
              <stencil-route url="/registration-confirmation-sent" component="app-registration-confirmation-sent" />
              <stencil-route url="/components" component="app-components" />
            </stencil-route-switch>
          </stencil-router>
        </main>
      </div>
    );
  }
}
