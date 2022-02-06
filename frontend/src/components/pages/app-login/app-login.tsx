import {Component, Host, h, Prop} from '@stencil/core';
import {RouterHistory} from "@stencil/router";
import {Inject} from "../../../global/di/inject";
import {SnackbarService} from "../snackbar.service";
import {AuthService} from "../auth.service";

@Component({
  tag: 'app-login',
  styleUrl: 'app-login.scss',
  shadow: true,
})
export class AppLogin {

  @Prop() email: string;
  @Prop() password: string;

  @Prop() history: RouterHistory;

  @Inject(SnackbarService) snackbarService: SnackbarService;
  @Inject(AuthService) authService: AuthService;

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.snackbarService.showSuccessSnack("Successfully logged in");
      this.history.push('/');
    } catch {
      this.snackbarService.showFailureSnack("Login did not work");
    }
  }

  render() {
    return (
      <Host>
        <div class="page-layout">
          <div class="header">
            <h1>Login</h1>
            <p>Login to your account</p>
          </div>
          <div class="body">
            <form>
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

              <app-button onPress={() => this.login()} primary>Login</app-button>
            </form>
          </div>
        </div>
      </Host>
    );
  }

}
