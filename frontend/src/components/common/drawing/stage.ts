import {PixiShape} from "./pixiShape";
import * as PIXI from 'pixi.js'

export class Stage {
  private app: PIXI.Application;
  private container: PIXI.Container;
  private dragging: boolean;
  private dragData: PIXI.InteractionData;

  constructor(params: {
    hostElement: HTMLElement,
    width: number,
    height: number
  }) {
    this.app = new PIXI.Application({
      width: params.width,
      height: params.height,
      transparent: true
    });

    params.hostElement.appendChild(this.app.view);
    this.container = new PIXI.Container();
    this.container.interactive = true;
    this.setupZoom();
    this.setupDrag();
    this.app.stage.addChild(this.container);
  }

  addShape(shape: PixiShape) {
    this.container.addChild(shape.getImpl());
  }

  addShapes(shapes: PixiShape[]) {
    shapes.forEach((it) => this.addShape(it));
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

  private setupDrag() {
    this.container
      .on('pointerdown', (e) => this.onDragStart(e))
      .on('pointerup', () => this.onDragEnd())
      .on('pointerupoutside', () => this.onDragEnd())
      .on('pointermove', () => this.onDragMove());
  }

  private onDragStart(event) {
    this.dragData = event.data;
    const relativeMousePosition = this.dragData.getLocalPosition(this.container);
    this.container.pivot.set(relativeMousePosition.x, relativeMousePosition.y);
    this.container.alpha = 0.5;
    this.dragging = true;
  }

  private onDragEnd() {
    this.container.alpha = 1;
    this.dragging = false;
    this.dragData = null;
  }

  private onDragMove() {
      if (this.dragging) {
        const mousePosition = this.dragData.getLocalPosition(this.container.parent);

        this.container.x = mousePosition.x;
        this.container.y = mousePosition.y;
      }
  }
}

