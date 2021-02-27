import {Component, Host, h, Event, Prop, EventEmitter, Watch} from '@stencil/core';
import {Line, Receipt} from "../../../model/client";
import Konva from "konva";
import {makeStagePinchZoomable} from "../../../common/canvas/make-stage-pinch-zoomable";
import KonvaEventObject = Konva.KonvaEventObject;

// TODO: rename to start with app
@Component({
  tag: 'receipt-lines',
  styleUrl: 'receipt-lines.scss',
  shadow: true,
})
export class ReceiptLines {
  @Prop() receipt: Receipt;

  @Watch('receipt')
  receiptChanged() {
    this.setupStage();
    this.drawImage();
    this.drawLinesOntoImage();
  }

  private canvas: HTMLDivElement;
  private stage: Konva.Stage;

  @Event() lineClick: EventEmitter<Line>;

  drawImage() {
    const layer = new Konva.Layer();
    Konva.Image.fromURL(this.receipt.imgUrl, (img) => {
      layer.add(img);
      this.stage.add(layer);
      this.stage.batchDraw();
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
  }

  private drawLinesOntoImage() {
    const layer = new Konva.Layer();
    this.receipt.lines.forEach(line => {
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
    return this.receipt.lines.find(it => it.id === id);
  }

  render() {
    return (
      <Host>
        <div ref={el => this.canvas = el} />
      </Host>
    );
  }
}
