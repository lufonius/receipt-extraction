import {Component, Host, h, Prop} from '@stencil/core';
import {Size} from "../size";

@Component({
  tag: 'app-navbar',
  styleUrl: 'app-navbar.scss',
  shadow: true,
})
export class AppNavbar {
  @Prop() activeUrl: string = null;

  private getClasses(url: string) {
    return "navbar-item" + (this.activeUrl === url ? " active" : "");
  }

  render() {
    return (
      <Host>
        <div class="navbar">
          <stencil-route-link url="/" class={this.getClasses("/")}>
            <app-icon size={Size.m} icon="home"/>
            <span>home</span>
          </stencil-route-link>

          <stencil-route-link url="/categories" class={this.getClasses("/categories")}>
            <app-icon size={Size.m} icon="layers"/>
            <span>categories</span>
          </stencil-route-link>

          <div class="fill" />

          <stencil-route-link url="/crop" class={this.getClasses("/crop")}>
            <app-icon size={Size.m} icon="plus-circle"/>
            <span>receipt</span>
          </stencil-route-link>
        </div>
      </Host>
    );
  }

}
