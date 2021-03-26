import * as PIXI from 'pixi.js'

export interface Shape {
  getImpl(): PIXI.DisplayObject;
}
