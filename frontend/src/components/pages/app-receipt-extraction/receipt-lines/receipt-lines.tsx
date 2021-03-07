import {Component, Host, h, Event, Prop, EventEmitter, Watch, State} from '@stencil/core';
import {Line, Receipt} from "../../../model/client";
import Konva from "konva";
import {makeStagePinchZoomable} from "../../../common/canvas/make-stage-pinch-zoomable";
import KonvaEventObject = Konva.KonvaEventObject;
import {makeStageZoomable} from "../../../common/canvas/make-stage-zoomable";
import {Inject} from "../../../../global/di/inject";
import {GlobalStore} from "../../../../global/global-store.service";
import flyd from "flyd";

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
  private stage: Konva.Stage;

  @Event() lineClick: EventEmitter<Line>;

  async drawImage(): Promise<void> {
    const layer = new Konva.Layer();
    return new Promise((resolve) => {
      Konva.Image.fromURL(this.currentReceipt.imgUrl, (img) => {
        layer.add(img);
        this.stage.add(layer);
        this.stage.batchDraw();
        resolve();
      });
    });
  }

  private setupStage() {
    Konva.hitOnDragEnabled = true;

    this.stage = new Konva.Stage({
      container: this.canvas,
      width: innerWidth,
      height: innerHeight,
      draggable: true
    });

    makeStagePinchZoomable(this.stage);
    makeStageZoomable(this.stage);
  }

  private drawLinesOntoImage() {
    const layer = new Konva.Layer();
    this.currentReceipt.lines.forEach(line => {
      const width = line.topRight.x - line.topLeft.x;
      const height = line.bottomLeft.y - line.topLeft.y;

      const box = new Konva.Rect({
        x: line.topLeft.x,
        y: line.topLeft.y,
        width,
        height,
        strokeWidth: 3,
        stroke: "red",
        id: line.id.toString()
      });

      const clickOrTapCallback = (e: KonvaEventObject<any>) => {
        const clickedLine = this.getLineById(parseInt(e.target.id()));
        this.lineClick.emit(clickedLine);
      };

      box.on("click",  clickOrTapCallback);
      box.on("tap", clickOrTapCallback);

      layer.add(box);
    });

    this.stage.add(layer);
    this.stage.batchDraw();
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
