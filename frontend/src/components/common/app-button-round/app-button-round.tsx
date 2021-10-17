import {Component, Event, EventEmitter, h, Host, Prop, State, Watch} from '@stencil/core';
import {Size} from "../size";

@Component({
  tag: 'app-button-round',
  styleUrl: 'app-button-round.scss',
  shadow: true,
})
export class AppButtonRound {

  @Event() press: EventEmitter<MouseEvent>;
  @Prop() size: Size = Size.xxl;
  @Prop() classes: string = null;
  @State() builtClasses: string = "button-round xxl"
  @Prop() label: string = null;

  componentWillLoad() {
    this.buildClasses();
  }

  @Watch("size")
  sizeChange() {
    this.buildClasses();
  }

  private buildClasses() {
    this.builtClasses = "button-round " + this.size.toString() + " " + this.classes;
  }

  render() {
    return (
      <Host>
        <button class={this.builtClasses} onClick={(e) => this.press.emit(e)}>
          <slot />
        </button>
        {this.label && <span class={"label " + this.classes}>{ this.label }</span>}
      </Host>
    );
  }
}
