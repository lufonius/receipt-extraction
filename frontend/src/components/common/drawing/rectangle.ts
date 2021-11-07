import {Shape} from "./shape";
import * as PIXI from 'pixi.js'

export class Rectangle implements Shape {
  id: number;

  private pixiRectangle: PIXI.Graphics;

  constructor(private params: {
    x: number,
    y: number,
    width: number,
    height: number,
    strokeWidth: number,
    strokeColor: number,
    padding: number,
    rounded: number,
    id: number
  }) {
    this.id = params.id;
    this.createImpl();
  }

  private createImpl() {
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(this.params.strokeWidth, this.params.strokeColor);
    graphics.beginFill(this.params.strokeColor, 0.15);

    graphics.drawRoundedRect(
      this.params.x - this.params.padding,
      this.params.y - this.params.padding,
      this.params.width + 2 * this.params.padding,
      this.params.height + 2 *  + this.params.padding,
      this.params.rounded
    );

    graphics.hitArea = new PIXI.Rectangle(
      this.params.x,
      this.params.y,
      this.params.width,
      this.params.height
    );

    graphics.interactive = true;
    graphics.buttonMode = true;

    graphics.endFill();

    this.pixiRectangle = graphics;
  }

  onClickOrTap(fn: (rect: Rectangle) => void) {
    this.pixiRectangle.on('mousedown', () => fn(this));
    this.pixiRectangle.on('touchstart', () => fn(this));
  }

  getImpl(): PIXI.DisplayObject {
    return this.pixiRectangle;
  }
}
