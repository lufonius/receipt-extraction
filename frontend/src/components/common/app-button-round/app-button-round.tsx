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
  @State() classes: string = "btn-round xxl"

  componentDidLoad() {
    this.buildClasses();
  }

  @Watch("size")
  sizeChange() {
    this.buildClasses();
  }

  private buildClasses() {
    this.classes = "btn-round " + this.size.toString();
  }

  render() {
    return (
      <Host>
        <button class={this.classes} onClick={(e) => this.press.emit(e)}>
          <slot />
        </button>
      </Host>
    );
  }
}
