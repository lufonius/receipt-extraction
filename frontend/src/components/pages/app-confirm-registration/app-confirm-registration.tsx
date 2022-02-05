import {Component, Host, h, State} from '@stencil/core';
import {Inject} from "../../../global/di/inject";
import {GlobalStore} from "../../../global/global-store.service";
import flyd from "flyd";
import {User} from "../../model/client";

@Component({
  tag: 'app-confirm-registration',
  styleUrl: 'app-confirm-registration.scss',
  shadow: true,
})
export class AppConfirmRegistration {

  @Inject(GlobalStore) store: GlobalStore;
  @State() currentUser: User;

  componentWillLoad() {
    flyd.on((currentUser) => {
      this.currentUser = currentUser;
    }, this.store.getCurrentUser());
  }

  render() {
    return (
      <Host>
        registration confirmation

        <br />
        current user: { this.currentUser.username }
      </Host>
    );
  }

}
