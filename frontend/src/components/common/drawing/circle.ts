import {Drawable} from "./drawable";

export class Circle implements Drawable {
  private _x: number;
  private _y: number;

  constructor(params: {
    x: number,
    y: number,
    strokeColor: string,
    strokeWidth: number,
    radiusX: number,
    radiusY: number,
    draggable: true,
    hitStrokeWidth: number,
    id: string
  }) {
    this._x = params.x;
    this._y = params.y;
  }

  onDragMove(fn: () => void) {}

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }
}
