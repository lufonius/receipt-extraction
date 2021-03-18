import {Drawable} from "./drawable";

export class Stage {
  constructor(params: {
    hostElement: HTMLElement,
    width: number,
    height: number
  }) {
    // setup stage, add event listeners, draw and drop, zoom
  }

  addShape(shape: Drawable) {}

  addShapes(shapes: Drawable[]) {}
}
