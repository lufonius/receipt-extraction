import {Shape} from "./shape";
import * as PIXI from 'pixi.js'

export class Image implements Shape {
  private _x: number;
  private _y: number;

  private pixiImage: PIXI.Sprite;

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
    this.pixiImage = new PIXI.Sprite(texture);
  }

  setImage(image: OffscreenCanvas) {
    const texture = PIXI.Texture.from(image.transferToImageBitmap());

    if (this.pixiImage) {
      this.pixiImage.texture = texture;
    } else {
      this.pixiImage = new PIXI.Sprite(texture);
    }
  }

  setPosition(p: { x: number, y: number }) {
    this._x = p.x;
    this._y = p.y;
    this.pixiImage.x = this._x;
    this.pixiImage.y = this._y;
  }

  getImpl(): PIXI.DisplayObject {
    return this.pixiImage;
  }
}
