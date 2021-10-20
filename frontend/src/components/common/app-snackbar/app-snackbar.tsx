import {Component, Host, h, Prop} from '@stencil/core';
import {Icons} from "../../../global/icons-enum";

@Component({
  tag: 'app-snackbar',
  styleUrl: 'app-snackbar.scss',
  shadow: true,
})
export class AppSnackbar {

  @Prop() type: 'success' | 'failure' = 'success';
  @Prop() message: string;
  @Prop() show: boolean = true;

  getClasses() {
    const classes = "snackbar " + this.type;

    if (this.show) {
      return classes + " animation-in";
    } else {
      return classes + " animation-out";
    }
  }

  render() {
    return (
      <Host>
        <div class={this.getClasses()}>
          {this.type === 'success' && <app-icon icon={Icons.CHECK} />}
          {this.type === 'failure' && <app-icon icon={Icons.CLOSE} />}
          <span>{ this.message }</span>
        </div>
      </Host>
    );
  }

}
