import * as PIXI from 'pixi.js'

export interface PixiShape {
  getImpl(): PIXI.DisplayObject;
}
