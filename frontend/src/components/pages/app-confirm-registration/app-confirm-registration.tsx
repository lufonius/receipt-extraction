import {Component, Host, h, State, Prop} from '@stencil/core';
import {Inject} from "../../../global/di/inject";
import {MatchResults} from "@stencil/router";
import {AuthService} from "../auth.service";
import {SnackbarService} from "../snackbar.service";

@Component({
  tag: 'app-confirm-registration',
  styleUrl: 'app-confirm-registration.scss',
  shadow: true,
})
export class AppConfirmRegistration {

  @Inject(AuthService) authService: AuthService;
  @Inject(SnackbarService) snackbarService: SnackbarService;
  @Prop() match: MatchResults;
  @State() message: string;

  async componentWillLoad() {
    const activationCode = this.match.params.activationCode;

    const response = await this.authService.confirmRegistration(activationCode);

    if (response && "message" in response) {
      this.message = response.message;
      this.snackbarService.showFailureSnack("Activation failed!")
    } else {
      this.message = "You successfully activated your account!";
      this.snackbarService.showSuccessSnack("Activation successfull!");
    }
  }

  render() {
    return (
      <Host>{this.message}</Host>
    );
  }

}
