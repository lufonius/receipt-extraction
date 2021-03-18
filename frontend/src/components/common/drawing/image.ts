import {Drawable} from "./drawable";

export class Image implements Drawable {
  private _x: number;
  private _y: number;

  constructor(params: {
    image: CanvasImageSource,
    x: number,
    y: number,
    id: string
  }) {
    this._x = params.x;
    this._y = params.y;
  }

  setImage(image: CanvasImageSource) {

  }

  setPosition(p: { x: number, y: number }) {
    this._x = p.x;
    this._y = p.y;
  }

  static fromUrl(url: string): Promise<Image> {
    throw Error();
  }
}
