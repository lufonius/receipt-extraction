import {Component, Prop, h, Host, State} from '@stencil/core';
import {RouterHistory} from '@stencil/router';
import {AuthService} from "../auth.service";
import {Inject} from "../../../global/di/inject";
import {User} from "../../model/client";

@Component({
  tag: 'app-profile',
  styleUrl: 'app-profile.scss',
  shadow: true,
})
export class AppProfile {

  @Prop() history: RouterHistory;
  @Inject(AuthService) authService: AuthService;
  @State() currentUser: User;

  componentWillLoad() {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout() {
    document.cookie = "";
    this.history.push("/login");
  }

  render() {
    return (
      <Host>
        <div class="page-layout">
          <div class="header">
            <h1>Your profile</h1>
            <p>See your profile details here</p>
          </div>
          <div class="body">
            <p>Username: <b>{ this.currentUser.sub }</b></p>
            <app-button onPress={() => this.logout()} primary>Logout</app-button>
          </div>
        </div>
        <app-navbar activeUrl="/profile" history={this.history} />
      </Host>
    );
  }
}
