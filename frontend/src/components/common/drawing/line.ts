import {Drawable} from "./drawable";

export class Line implements Drawable {
  private p1:  { x: number, y: number };
  private p2:  { x: number, y: number };
  private strokeColor: string;
  private strokeWidth: number;
  private id: string;

  constructor(private params: {
    p1: { x: number, y: number },
    p2: { x: number, y: number },
    strokeColor: string,
    strokeWidth: number,
    id: string
  }) {
    this.p1 = params.p1;
    this.p2 = params.p2;
    this.strokeColor = params.strokeColor;
    this.strokeWidth = params.strokeWidth;
    this.id = params.id;
  }

  // update drawing
  setP1(p: { x: number, y: number }) {
    this.p1 = p;
  }

  // upate drawing
  setP2(p: { x: number, y: number }) {
    this.p2 = p;
  }
}
