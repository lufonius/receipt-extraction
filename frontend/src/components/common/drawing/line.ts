import {Shape} from "./shape";
import * as PIXI from 'pixi.js'

export class Line implements Shape {
  private p1:  { x: number, y: number };
  private p2:  { x: number, y: number };
  private strokeColor: number;
  private strokeWidth: number;
  private id: string;

  private pixiGraphics: PIXI.Graphics;

  constructor(private params: {
    p1: { x: number, y: number },
    p2: { x: number, y: number },
    strokeColor: number,
    strokeWidth: number,
    id: string
  }) {
    this.p1 = params.p1;
    this.p2 = params.p2;
    this.strokeColor = params.strokeColor;
    this.strokeWidth = params.strokeWidth;
    this.id = params.id;

    this.createImpl();
  }

  private createImpl() {
    this.pixiGraphics = new PIXI.Graphics();
    this.updateImpl();
  }

  private updateImpl() {
    this.pixiGraphics.clear();
    this.pixiGraphics.lineStyle(this.strokeWidth, this.strokeColor);
    this.pixiGraphics.moveTo(this.p1.x, this.p1.y);
    this.pixiGraphics.lineTo(this.p2.x, this.p2.y);

    this.pixiGraphics.endFill();
  }

  setP1(p: { x: number, y: number }) {
    this.p1 = p;
    this.updateImpl();
  }

  setP2(p: { x: number, y: number }) {
    this.p2 = p;
    this.updateImpl();
  }

  getImpl(): PIXI.DisplayObject {
    return this.pixiGraphics;
  }

  destroy() {
    this.pixiGraphics.destroy();
  }
}
