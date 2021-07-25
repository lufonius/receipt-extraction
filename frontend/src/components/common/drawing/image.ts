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

  async createFromUrl(params: {
    url: string,
    id: string
  }) {
    this.texture = PIXI.Texture.from(params.url);
    console.log(PIXI.Texture.from("kp").textureCacheIds);

    return new Promise<void>((resolve) => {
      console.log(this.texture.textureCacheIds);
      const isCached = this.texture.textureCacheIds.includes(params.url);
      if (isCached) {
        this.pixiImage = new PIXI.Sprite(this.texture);
        resolve();
      } else {
        this.texture.baseTexture.on("loaded", () => { // not being called when opened the second time
          this.pixiImage = new PIXI.Sprite(this.texture);
          resolve();
        });
      }
    });
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
