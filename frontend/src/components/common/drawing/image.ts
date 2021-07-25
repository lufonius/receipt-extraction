import {Shape} from "./shape";
import * as PIXI from 'pixi.js'

export class Image implements Shape {
  private _x: number;
  private _y: number;

  private pixiImage: PIXI.Sprite;
  private texture: PIXI.Texture;

  createManually(params: {
    image: OffscreenCanvas,
    x: number,
    y: number,
    id: string
  }) {
    this._x = params.x;
    this._y = params.y;
    this.setImage(params.image);
  }

  createFromUrl(params: {
    url: string,
    id: string
  }) {
    this.texture = PIXI.Texture.from(params.url);
    this.pixiImage = new PIXI.Sprite(this.texture);
  }

  setImage(image: OffscreenCanvas) {
    this.texture = PIXI.Texture.from(image.transferToImageBitmap());

    if (this.pixiImage) {
      this.pixiImage.texture = this.texture;
    } else {
      this.pixiImage = new PIXI.Sprite(this.texture);
    }

    this.pixiImage.x = this._x;
    this.pixiImage.y = this._y;
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
