import {Component, Host, h, Prop} from '@stencil/core';
import {Inject} from "../../../global/di/inject";
import {SnackbarService} from "../snackbar.service";
import {RouterHistory} from "@stencil/router";
import {AuthService} from "../auth.service";
import {GlobalStore} from "../../../global/global-store.service";

@Component({
  tag: 'app-register',
  styleUrl: 'app-register.scss',
  shadow: true,
})
export class AppRegister {

  private HTTP_STATUS_CONFLICT = 409;

  @Prop() email: string;
  @Prop() password: string;

  @Prop() history: RouterHistory;

  @Inject(SnackbarService) snackbarService: SnackbarService;
  @Inject(AuthService) authService: AuthService;
  @Inject(GlobalStore) store: GlobalStore;

  async register() {
    const responseCode = await this.authService.registerUser(this.email, this.password);

    if (responseCode === this.HTTP_STATUS_CONFLICT) {
      this.snackbarService.showFailureSnack("Email already in use");
      return;
    }

    if (responseCode === 200) {
      const currentUser = await this.authService.getCurrentUser();
      this.store.setCurrentUser(currentUser);
      this.history.push('/confirm-registration');
    }
  }

  render() {
    return (
      <Host>
        <app-input
          type="email"
          value={this.email}
          onInputValueChange={({ detail: name }) => this.email = name}
        ></app-input>

        <br />

        <app-input
          type="password"
          value={this.password}
          onInputValueChange={({ detail: password }) => this.password = password}
        ></app-input>

        <app-button onPress={() => this.register()}>Register</app-button>
      </Host>
    );
  }

}
