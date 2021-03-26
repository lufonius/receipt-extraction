import {Shape} from "./shape";
import * as PIXI from 'pixi.js'
import {Drag} from "./drag";

export class Circle extends Drag implements Shape {
  private _x: number;
  private _y: number;

  private pixiGraphics: PIXI.Graphics;

  constructor(private params: {
    x: number,
    y: number,
    strokeColor: number,
    strokeWidth: number,
    radius: number,
    draggable: true,
    hitStrokeWidth: number,
    onMove: () => void,
    id: string
  }) {
    super({ setPivotToMousePosition: false });

    this._x = params.x;
    this._y = params.y;

    this.createImpl();
    this.setupDrag();
  }

  private createImpl() {
    this.pixiGraphics = new PIXI.Graphics();
    this.pixiGraphics.lineStyle(this.params.strokeWidth, this.params.strokeColor);

    this.pixiGraphics.x = this._x;
    this.pixiGraphics.y = this._y;

    this.pixiGraphics.drawCircle(
      0,
      0,
      this.params.radius
    );

    this.pixiGraphics.hitArea = new PIXI.Circle(0, 0, this.params.radius + (this.params.hitStrokeWidth / 2));

    this.pixiGraphics.interactive = true;
    this.pixiGraphics.buttonMode = true;

    this.pixiGraphics.endFill();
  }

  protected onMove() {
    this.params.onMove();
  }

  protected shapeToDrag(): PIXI.DisplayObject {
    return this.pixiGraphics;
  }

  protected isDragStartPreconditionMet(): boolean {
    return true;
  }

  get x(): number {
    return this.pixiGraphics.x;
  }

  get y(): number {
    return this.pixiGraphics.y;
  }

  getImpl(): PIXI.DisplayObject {
    return this.pixiGraphics;
  }

  destroy() {
    this.pixiGraphics.destroy();
  }
}
