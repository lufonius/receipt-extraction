import {Component, Host, h, Prop, State} from '@stencil/core';
import {Inject} from "../../../global/di/inject";
import {SnackbarService} from "../snackbar.service";
import {RouterHistory} from "@stencil/router";
import {AuthService} from "../auth.service";
import {GlobalStore} from "../../../global/global-store.service";
import {emailValidator, requiredValidator} from "../../common/validator";

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

  @State() submitted: boolean = false;

  @Inject(SnackbarService) snackbarService: SnackbarService;
  @Inject(AuthService) authService: AuthService;

  async register() {
    this.submitted = true;
    const responseCode = await this.authService.registerUser(this.email, this.password);

    if (responseCode === this.HTTP_STATUS_CONFLICT) {
      this.snackbarService.showFailureSnack("Email already in use");
      return;
    }

    if (responseCode === 200) {
      const currentUser = this.authService.getCurrentUser();
      this.history.push('/registration-confirmation-sent');
    }
  }

  render() {
    return (
      <Host>
        <div class="page-layout">
          <div class="header">
            <h1>Register</h1>
            <p>Register here to be able to use drezip</p>
          </div>
          <div class="body">
            <form>
              <app-input
                label="Email address"
                type="email"
                value={this.email}
                onInputValueChange={({ detail: name }) => this.email = name}
                validators={[requiredValidator, emailValidator]}
                showErrors={this.submitted}
              ></app-input>

              <br />

              <app-input
                label="Password"
                type="password"
                value={this.password}
                onInputValueChange={({ detail: password }) => this.password = password}
                validators={[requiredValidator]}
                showErrors={this.submitted}
              ></app-input>

              <app-button onPress={() => this.register()} primary>Register</app-button>
            </form>
          </div>
        </div>
      </Host>
    );
  }

}
