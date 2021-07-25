import {Shape} from "./shape";
import * as PIXI from 'pixi.js'
import {Drag} from "./drag";
import {Viewport} from "pixi-viewport";

export class Stage extends Drag {
  private app: PIXI.Application;
  private container: Viewport;
  private shiftPressing: boolean;

  constructor(params: {
    hostElement: HTMLElement,
    width: number,
    height: number
  }) {
    super({
      setPivotToMousePosition: true
    });

    this.app = new PIXI.Application({
      width: params.width,
      height: params.height,
      backgroundAlpha: 0,
      antialias: true
    });

    params.hostElement.appendChild(this.app.renderer.view);

    this.container = new Viewport({
      screenWidth: params.width,
      screenHeight: params.height,
      worldWidth: 838,
      worldHeight: 1674,
      passiveWheel: true,
      stopPropagation: true,
      // using this, the zooming started to work! Otherwise no events (like "mouse") were thrown
      divWheel: params.hostElement,
      interaction: this.app.renderer.plugins.interaction
    });

    this.container
      .drag({
        keyToPress: ["ShiftLeft", "ShiftRight"]
      })
      .decelerate({})
      .wheel({
        percent: 0.1,                // smooth the zooming by providing the number of frames to zoom between wheel spins
        interrupt: true,             // stop smoothing with any user input on the viewport
        reverse: false,              // reverse the direction of the scroll
        center: null,                // place this point at center during zoom instead of current mouse position
        lineHeight: 20,	            // scaling factor for non-DOM_DELTA_PIXEL scrolling events
        axis: 'all',                 // axis to zoom
      })
      .pinch()
      .fitWorld(true);

    this.app.stage.addChild(this.container);
  }

  update() {
    this.app.renderer.render(this.container);
    requestAnimationFrame(() => this.update());
  }

  addShape(shape: Shape) {
    this.container.addChild(shape.getImpl());
  }

  addShapes(shapes: Shape[]) {
    shapes.forEach((it) => this.addShape(it));
  }

  removeAllChildren() {
    this.app.stage.removeChildren();
  }

  destroy() {
    this.removeAllChildren();
    this.app.destroy(true);
  }

  isDragStartPreconditionMet(): boolean {
    return this.shiftPressing;
  }

  shapeToDrag(): PIXI.DisplayObject {
    return this.container;
  }

  setContentSize(width: number, height: number) {
    this.container.worldHeight = height;
    this.container.worldWidth = width;
  }

  fitContent() {
    this.container.fitWorld(true);
  }
}

