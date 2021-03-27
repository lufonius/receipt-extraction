import {Shape} from "./shape";
import * as PIXI from 'pixi.js'
import {Drag} from "./drag";

export class Stage extends Drag {
  private app: PIXI.Application;
  private container: PIXI.Container;
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

    params.hostElement.appendChild(this.app.view);
    this.container = new PIXI.Container();
    this.container.interactive = true;
    this.setupZoom();
    this.app.stage.addChild(this.container);

    this.setupDrag();

    document.addEventListener('keydown', (e) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.shiftPressing = true;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        this.shiftPressing = false;
        this.onDragEnd();
      }
    });
  }

  addShape(shape: Shape) {
    this.container.addChild(shape.getImpl());
  }

  addShapes(shapes: Shape[]) {
    shapes.forEach((it) => this.addShape(it));
  }

  removeAllChildren() {
    this.container.removeChildren();
  }

  destroy() {
    this.app.destroy(true);
    this.removeAllChildren();
  }

  isDragStartPreconditionMet(): boolean {
    return this.shiftPressing;
  }

  shapeToDrag(): PIXI.DisplayObject {
    return this.container;
  }

  private setupZoom() {
    const scaleBy = 1.05;
    this.app.view.addEventListener("mousewheel", (e: WheelEvent) => {
      var oldScale = this.app.stage.scale.x;

      var pointer = this.app.renderer.plugins.interaction.mouse.global;

      var mousePointTo = {
        x: (pointer.x - this.app.stage.x) / oldScale,
        y: (pointer.y - this.app.stage.y) / oldScale,
      };

      var newScale =
        e.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      this.app.stage.scale.x = newScale;
      this.app.stage.scale.y = newScale;

      var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      this.app.stage.x = newPos.x;
      this.app.stage.y = newPos.y;
    });
  }
}

