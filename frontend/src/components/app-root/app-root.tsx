import {Component, h, Listen, State} from '@stencil/core';
import {Inject} from "../../global/di/inject";
import {GlobalStore} from "../../global/global-store.service";
import {CategoryService} from "../pages/category.service";
import {SnackbarService} from "../pages/snackbar.service";
import flyd from "flyd";
import {AuthService} from "../pages/auth.service";
import {OpenCvService} from "../../global/opencv/opencv.service";
import {Components} from "../../components";
import AppDialog = Components.AppDialog;

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
  @Inject(OpenCvService) openCvService: OpenCvService;

  private updateAppDialog: AppDialog;
  @State() private isUpdating: boolean = false;
  @State() private hasBeenUpdated: boolean = false;
  @State() private updateFailed: boolean = false;

  private installAppDialog: AppDialog;
  private installPrompt: any;

  @State() private snackbar: { message: string, type: 'success' | 'failure', show: boolean } = null;

  constructor() {
    this.showAddToHomeScreenDialog();
  }

  async componentWillLoad() {
    this.reloadOnSWUpdate();

    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.categoryService.get().then((categories) => {
        this.store.setCategories(categories);
      });
    }

    this.openCvService.loadIfNotLoadedAlready().then();

    flyd.on((message) => this.showSnackbar('success', message),this.snackbarService.successSnacks);
    flyd.on((message) => this.showSnackbar('failure', message),this.snackbarService.failureSnacks);
  }

  private reloadOnSWUpdate() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistration()
        .then(registration => {
          if (registration?.active) {
            navigator.serviceWorker.addEventListener(
              'controllerchange',
              () => {
                window.location.reload()
              }
            );
          }
        })
    }
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

  @Listen("swUpdate", { target: 'window' })
  async onServiceWorkerUpdate() {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration?.waiting) {
      return;
    }

    await this.updateAppDialog.isVisible(true);
  }

  private async forceServiceWorkerReload() {
    const registration = await navigator.serviceWorker.getRegistration();
    const sw = registration.waiting;

    this.updateFailed = false;
    this.hasBeenUpdated = false;
    sw.postMessage({ type: "SKIP_WAITING" });
    this.isUpdating = true;
    try {
      await this.waitForActivation(sw);
    } catch {
      this.isUpdating = false;
      this.updateFailed = true;
      this.snackbarService.showFailureSnack("Updating the app did not work");
    }
  }

  private async waitForActivation(sw: ServiceWorker): Promise<void> {
    return new Promise((resolve, reject) => {
      sw.addEventListener("activated", () => resolve());
      sw.addEventListener("redundant", () => reject());
    });
  }

  showAddToHomeScreenDialog() {
    if (this.authService.getCurrentUser()) {
      window.addEventListener('beforeinstallprompt', async (e: Event) => {
        e.preventDefault();
        this.installPrompt = e;

        const userSettings = await this.authService.getUserSettings();

        if (!userSettings.hideAddToHomeScreen) {
          await this.installAppDialog.isVisible(true);
        }
      });
    }
  }

  async installPwa() {
    this.installPrompt.prompt();
    await this.installPrompt.userChoice
    await this.authService.updateUserSettings({ hideAddToHomeScreen: true });
    await this.installAppDialog.isVisible(false);
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

        <app-dialog ref={(el) => this.installAppDialog = el} manuallyClosable={false}>
          <div class="dialog">
            <div class="dialog-body">
              <div class="install-app-body">
                <object data="assets/logo.svg" class="logo"></object>
                <p>Add drezip to your home screen</p>
              </div>
            </div>
            <app-divider />
            <div class="dialog-footer">
              <div class="install-app-footer">
                <app-button onPress={async () => await this.installAppDialog.isVisible(false)}>Cancel</app-button>
                <div class="fill" />
                <app-button primary onPress={() => this.installPwa()}>Install</app-button>
              </div>
            </div>
          </div>
        </app-dialog>

        <app-dialog ref={(el) => this.updateAppDialog = el} manuallyClosable={false}>
          <div class="dialog">
            <div class="dialog-header">
              <h4>update your app</h4>
            </div>
            <app-divider />
            <div class="dialog-body">
              {!this.updateFailed && <div>
                {!this.isUpdating && !this.hasBeenUpdated && <div>
                  <p class="center">An update is available!</p>
                </div>}
                {this.isUpdating && <div class="center">
                  <p>The app is updating</p>
                  <app-loader />
                </div>}
              </div>}

              {this.updateFailed && <div>
                <p>Updating the app failed. Please check your network and try again.</p>
              </div>}
            </div>
            <app-divider />
            <div class="dialog-footer">
              {!this.updateFailed && <div>
                {!this.isUpdating && !this.hasBeenUpdated && <div>
                  <app-button primary onPress={async () => await this.forceServiceWorkerReload()}>update and reload</app-button>
                </div>}
              </div>}

              {this.updateFailed && <div>
                <app-button primary onPress={() => this.forceServiceWorkerReload()}>Try again</app-button>
              </div>}
            </div>
          </div>
        </app-dialog>
      </div>
    );
  }
}
