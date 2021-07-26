import {Component, Host, h, Event, Prop, EventEmitter, Watch, State} from '@stencil/core';
import {Line, Receipt} from "../../../model/client";
import {Inject} from "../../../../global/di/inject";
import {GlobalStore} from "../../../../global/global-store.service";
import flyd from "flyd";
import lift from "flyd/module/lift";
import filter from "flyd/module/filter";
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
  @State() public currentReceiptLines: Line[];
  @State() public currentReceiptImgUrl: string;
  private hasNotBeenDrawn: boolean = true;

  componentDidLoad() {
    const lines$ = this.globalStore.selectCurrentReceiptLines();
    const imgUrl$ = this.globalStore.selectCurrentReceiptImgUrl();
    const both$ = lift((line, imgUrl) => [line, imgUrl], lines$, imgUrl$).pipe(
      filter(([line, imgUrl]) => !!line && !!imgUrl)
    );

    flyd.on(([lines, imgUrl]: [Line[], string]) => {
      if (this.currentReceiptImgUrl !== imgUrl || this.hasNotBeenDrawn) {
        this.currentReceiptImgUrl = imgUrl;

        this.setupStage();
        this.drawImage();
      }

      this.currentReceiptLines = lines;
      this.drawLinesOntoImage();
    }, both$);
  }

  private canvas: HTMLDivElement;
  private stage: Stage;

  @Event() lineClick: EventEmitter<Line>;

  drawImage() {
    const image = new Image();
    image.createFromUrl({
      url: `/images${this.currentReceiptImgUrl}`,
      id: ""
    });
    this.stage.addImage(image);
    this.hasNotBeenDrawn = false;
  }

  private setupStage() {
    if (this.stage) {
      this.stage.destroy();
    }

    this.stage = new Stage({
      hostElement: this.canvas,
      width: innerWidth,
      height: innerHeight
    });
  }

  private drawLinesOntoImage() {
    this.stage.removeAllLines();

    this.currentReceiptLines.forEach(line => {
      const width = line.topRight.x - line.topLeft.x;
      const height = line.bottomLeft.y - line.topLeft.y;

      const box = new Rectangle({
        x: line.topLeft.x,
        y: line.topLeft.y,
        width,
        height,
        strokeWidth: 3,
        strokeColor: line.color,
        id: line.id
      });

      const clickOrTapCallback = (rectangle) => {
        const clickedLine = this.getLineById(rectangle.id);
        this.lineClick.emit(clickedLine);
      };

      box.onClickOrTap(clickOrTapCallback)

      this.stage.addLine(box);
    });
  }

  private getLineById(id: number): Line {
    return this.currentReceiptLines.find(it => it.id === id);
  }

  render() {
    return (
      <Host>
        <div class="canvas" ref={el => this.canvas = el} />
      </Host>
    );
  }
}
