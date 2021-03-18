import {Drawable} from "./drawable";

export class Rectangle implements Drawable {
  id: number;

  constructor(params: {
    x: number,
    y: number,
    width: number,
    height: number,
    strokeWidth: 3,
    strokeColor: "red",
    id: number
  }) {
    this.id = params.id;
  }

  onClickOrTap(fn: (rect: Rectangle) => void) {}
}
