import {Component, Host, h, Prop, State, Watch, Event, EventEmitter} from '@stencil/core';

@Component({
  tag: 'dropup-controls',
  styleUrl: 'dropup-controls.scss',
  shadow: true,
})
export class DropupControls {
  @Prop() public show: boolean = false;
  @State() containerClasses: string;
  @Event() public containerShownAnimationEnd: EventEmitter<boolean>;

  viewListButtonClicked() {
    this.show = !this.show;
    this.toggleItemsVisibility();
  }

  componentWillLoad() {
    this.toggleItemsVisibility();
  }

  @Watch("show")
  showChanged() {
    this.toggleItemsVisibility();
  }

  toggleItemsVisibility() {
    this.containerClasses = `dropup ${this.show ? "open" : "closed"}`;
  }

  private emitContainerShownAnimationEnd() {
    this.containerShownAnimationEnd.emit(this.show);
  }

  render() {
    return (
      <Host>
        <div class="container">
          <div class="fill" />
          <div class="controls">
            <slot name="controls" />
          </div>
          <div class={this.containerClasses} onTransitionEnd={() => this.emitContainerShownAnimationEnd()}>
            <slot name="dropup" />
          </div>
        </div>
      </Host>
    );
  }

}
