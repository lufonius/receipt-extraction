import {Shape} from "./shape";
import * as PIXI from 'pixi.js'
import {Drag} from "./drag";
import {Viewport} from "pixi-viewport";

export class Stage extends Drag {
  private app: PIXI.Application;
  private viewport: Viewport;
  private linesContainer: PIXI.Container;
  private imageContainer: PIXI.Container;
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

    this.viewport = new Viewport({
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

    this.viewport
      .drag({ keyToPress: ["ShiftLeft", "ShiftRight"] })
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

    this.linesContainer = new PIXI.Container();
    this.imageContainer = new PIXI.Container();

    this.viewport.addChild(this.linesContainer,this.imageContainer);
    this.viewport.sortableChildren = true;
    this.linesContainer.zIndex = 5;
    this.imageContainer.zIndex = 4;
    this.viewport.sortChildren();
    this.app.stage.addChild(this.viewport);
  }

  update() {
    this.app.renderer.render(this.viewport);
    requestAnimationFrame(() => this.update());
  }

  addLine(line: Shape) {
    this.linesContainer.addChild(line.getImpl());
  }

  addImage(line: Shape) {
    this.viewport.addChild(line.getImpl());
  }

  addLines(shapes: Shape[]) {
    shapes.forEach((it) => this.addLine(it));
  }

  removeAllChildren() {
    this.app.stage.removeChildren();
  }

  removeAllLines() {
    this.linesContainer.removeChildren();
  }

  destroy() {
    this.removeAllChildren();
    this.app.destroy(true);
  }

  isDragStartPreconditionMet(): boolean {
    return this.shiftPressing;
  }

  shapeToDrag(): PIXI.DisplayObject {
    return this.viewport;
  }

  setContentSize(width: number, height: number) {
    this.viewport.worldHeight = height;
    this.viewport.worldWidth = width;
  }

  fitContent() {
    this.viewport.fitWorld(true);
  }
}

