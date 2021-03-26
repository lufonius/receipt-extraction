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
    id: number
  }) {
    this.id = params.id;
    this.createImpl();
  }

  private createImpl() {
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(this.params.strokeWidth, this.params.strokeColor);

    graphics.drawRect(
      this.params.x,
      this.params.y,
      this.params.width,
      this.params.height
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
  }

  getImpl(): PIXI.DisplayObject {
    return this.pixiRectangle;
  }
}
