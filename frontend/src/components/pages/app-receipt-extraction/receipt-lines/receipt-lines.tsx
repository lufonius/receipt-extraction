import {Component, Host, h, Event, Prop, EventEmitter, Watch, State} from '@stencil/core';
import {Line, Receipt} from "../../../model/client";
import {Inject} from "../../../../global/di/inject";
import {GlobalStore} from "../../../../global/global-store.service";
import flyd from "flyd";
import {Image} from "../../../common/drawing/image";
import {Stage} from "../../../common/drawing/stage";
import {Rectangle} from "../../../common/drawing/rectangle";

// TODO: rename to start with app
@Component({
  tag: 'receipt-lines',
  styleUrl: 'receipt-lines.scss',
  shadow: true,
})
export class ReceiptLines {
  @Inject(GlobalStore) private globalStore: GlobalStore;
  @State() public currentReceipt: Receipt;

  componentDidLoad() {
    flyd.on(async (receipt) => {
      this.currentReceipt = receipt;
      await this.receiptChanged();
    }, this.globalStore.selectCurrentReceipt());
  }

  async receiptChanged() {
    this.setupStage();
    await this.drawImage();
    this.drawLinesOntoImage();
  }

  private canvas: HTMLDivElement;
  private stage: Stage;

  @Event() lineClick: EventEmitter<Line>;

  async drawImage(): Promise<void> {
    const image = await Image.fromUrl(this.currentReceipt.imgUrl);
    this.stage.addShape(image);
  }

  private setupStage() {
    this.stage = new Stage({
      hostElement: this.canvas,
      width: innerWidth,
      height: innerHeight
    });
  }

  private drawLinesOntoImage() {
    this.currentReceipt.lines.forEach(line => {
      const width = line.topRight.x - line.topLeft.x;
      const height = line.bottomLeft.y - line.topLeft.y;

      const box = new Rectangle({
        x: line.topLeft.x,
        y: line.topLeft.y,
        width,
        height,
        strokeWidth: 3,
        strokeColor: "red",
        id: line.id
      });

      const clickOrTapCallback = (rectangle) => {
        const clickedLine = this.getLineById(rectangle.id);
        this.lineClick.emit(clickedLine);
      };

      box.onClickOrTap(clickOrTapCallback)

      this.stage.addShape(box);
    });
  }

  private getLineById(id: number): Line {
    return this.currentReceipt.lines.find(it => it.id === id);
  }

  render() {
    return (
      <Host>
        <div class="canvas" ref={el => this.canvas = el} />
      </Host>
    );
  }
}
