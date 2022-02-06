import {Component, Host, h, State} from '@stencil/core';
import {Inject} from "../../../global/di/inject";
import {AuthService} from "../auth.service";
import {User} from "../../model/client";

@Component({
  tag: 'app-registration-confirmation-sent',
  styleUrl: 'app-registration-confirmation-sent.scss',
  shadow: true,
})
export class AppRegistrationConfirmationSent {

  @Inject(AuthService) authService: AuthService;
  @State() currentUser: User;

  componentWillLoad() {
    this.currentUser = this.authService.getCurrentUser();
  }

  render() {
    return (
      <Host>
        <div>Please activate your account by clicking the link sent to { this.currentUser.sub }.</div>
      </Host>
    );
  }

}
