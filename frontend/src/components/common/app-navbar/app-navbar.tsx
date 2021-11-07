import {Component, Host, h, Prop} from '@stencil/core';
import { RouterHistory } from '@stencil/router';
import {Size} from "../size";
import {Icons} from "../../../global/icons-enum";

@Component({
  tag: 'app-navbar',
  styleUrl: 'app-navbar.scss',
  shadow: true,
})
export class AppNavbar {
  @Prop() activeUrl: string = null;
  @Prop() history: RouterHistory;

  private photoInput: HTMLInputElement;

  private getClasses(url: string) {
    return "navbar-item" + (this.activeUrl === url ? " active" : "");
  }

  private redirectToImageEditing() {
    if (this.photoInput.files.length > 0) {
      this.history.push('/edit-image', { image: this.photoInput.files[0] });
    }
  }

  render() {
    return (
      <Host>
        <input style={({ display: "none" })}  type="file" accept="image/*" capture="camera" onChange={() => this.redirectToImageEditing()} ref={(el) => this.photoInput = el} />

        <div class="navbar">
          <stencil-route-link url="/" class={this.getClasses("/")}>
            <app-icon size={Size.m} icon={Icons.HOME} />
            <span>home</span>
          </stencil-route-link>

          <stencil-route-link url="/category" class={this.getClasses("/category")}>
            <app-icon size={Size.m} icon={Icons.LAYERS} />
            <span>categories</span>
          </stencil-route-link>

          <div class="fill" />

          <a onClick={() => this.photoInput.click()} class={this.getClasses("/crop")}>
            <app-icon size={Size.m} icon="plus-circle"/>
            <span>receipt</span>
          </a>
        </div>
      </Host>
    );
  }

}
