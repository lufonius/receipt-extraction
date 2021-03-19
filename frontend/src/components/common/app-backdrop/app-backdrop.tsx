import {Component, Host, h, Prop, State, Watch, Method} from '@stencil/core';

@Component({
  tag: 'app-backdrop',
  styleUrl: 'app-backdrop.scss',
  shadow: true,
})
export class AppBackdrop {

  @Prop() public show: boolean;
  @Prop() public withAnimation: boolean = true;
  @State() public classes: string = "backdrop closed";

  @Method() async showChange(show: boolean) {
    this.show = show;
    this.buildClasses();
  }

  @Watch("withAnimation")
  withAnimationChange() {
    this.buildClasses();
  }

  private buildClasses() {
    let classes = "backdrop ";
    if (this.withAnimation) classes += "animation ";
    classes += this.show ? "open" : "closed";

    this.classes = classes;
  }

  render() {
    return (
      <Host>
        <div class={this.classes}>
          {this.show && <slot />}
        </div>
      </Host>
    );
  }

}
