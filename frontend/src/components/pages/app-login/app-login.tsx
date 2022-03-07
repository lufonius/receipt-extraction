import {Component, Host, h, Prop, State} from '@stencil/core';
import {RouterHistory} from "@stencil/router";
import {Inject} from "../../../global/di/inject";
import {SnackbarService} from "../snackbar.service";
import {AuthService} from "../auth.service";
import {emailValidator, requiredValidator} from "../../common/validator";

@Component({
  tag: 'app-login',
  styleUrl: 'app-login.scss',
  shadow: true,
})
export class AppLogin {

  @Prop() email: string;
  @Prop() password: string;

  @Prop() history: RouterHistory;
  @State() submitted: boolean = false;

  @Inject(SnackbarService) snackbarService: SnackbarService;
  @Inject(AuthService) authService: AuthService;

  async login() {
    this.submitted = true;
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
            <form onSubmit={() => this.login()}>
              <app-input
                type="email"
                label="Email address"
                value={this.email}
                onInputValueChange={({ detail: name }) => this.email = name}
                validators={[requiredValidator, emailValidator]}
                showErrors={this.submitted}
              ></app-input>

              <br />

              <app-input
                type="password"
                label="Password"
                value={this.password}
                onInputValueChange={({ detail: password }) => this.password = password}
                validators={[requiredValidator]}
                showErrors={this.submitted}
              ></app-input>

              <app-button onPress={async () => await this.login()} primary>Login</app-button>
            </form>

            <br />

            <p>Not yet registered? <stencil-route-link url="/register">register</stencil-route-link></p>
          </div>
        </div>
      </Host>
    );
  }

}
