import {Component, Host, h, Prop} from '@stencil/core';

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
