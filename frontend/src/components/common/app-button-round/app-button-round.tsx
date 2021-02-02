import {Component, Host, h, Prop, Event, EventEmitter} from '@stencil/core';
import {MaterialIcons} from "../../../global/material-icons-enum";

@Component({
  tag: 'app-button-round',
  styleUrl: 'app-button-round.scss',
  shadow: true,
})
export class AppButtonRound {

  @Prop() firstLine: string = "";
  @Prop() secondLine: string = "";
  @Prop() icon: MaterialIcons;
  @Event() press: EventEmitter<MouseEvent>;

  render() {
    return (
      <Host>
        <button class="btn-round" onClick={(e) => this.press.emit(e)}>
          <app-icon>{ this.icon }</app-icon>
          <span>{ this.firstLine }</span><br />
          <span>{ this.secondLine }</span>
        </button>
      </Host>
    );
  }

}
