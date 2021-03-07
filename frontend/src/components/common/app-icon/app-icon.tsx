import {Component, Host, h, Prop, Watch, State} from '@stencil/core';
import {Size} from "../size";

@Component({
  tag: 'app-icon',
  styleUrl: 'app-icon.scss',
  shadow: true,
})
export class AppIcon {
  render() {
    return (<Host><i class="material-icons"><slot /></i></Host>);
  }
}
