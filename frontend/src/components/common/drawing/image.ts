import {PixiShape} from "./pixiShape";
import * as PIXI from 'pixi.js'

export class Image implements PixiShape {
  private _x: number;
  private _y: number;

  private image: PIXI.Sprite;

  createManually(params: {
    image: OffscreenCanvas,
    x: number,
    y: number,
    id: string
  }) {
    this.setImage(params.image);
    this._x = params.x;
    this._y = params.y;
  }

  crateFromUrl(params: {
    url: string,
    id: string
  }) {
    const texture = PIXI.Texture.from(params.url);
    this.image = new PIXI.Sprite(texture);
  }

  setImage(image: OffscreenCanvas) {
    const texture = PIXI.Texture.from(image.transferToImageBitmap());
    this.image.texture = texture;
  }

  setPosition(p: { x: number, y: number }) {
    this._x = p.x;
    this._y = p.y;
    this.image.x = this._x;
    this.image.y = this._y;
  }

  getImpl(): PIXI.DisplayObject {
    return this.image;
  }
}
