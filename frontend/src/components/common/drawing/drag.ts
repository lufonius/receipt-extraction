import * as PIXI from "pixi.js";

export abstract class Drag {
  private setPivotToMousePosition: boolean;
  constructor(params: { setPivotToMousePosition: boolean }) {
    this.setPivotToMousePosition = params.setPivotToMousePosition;
  }

  private dragData: PIXI.InteractionData;
  private dragging: boolean;

  protected abstract shapeToDrag(): PIXI.DisplayObject;
  protected abstract isDragStartPreconditionMet(): boolean;
  protected onMove(): void {}

  protected setupDrag() {
    this.shapeToDrag()
      .on('pointerdown', (e) => this.onDragStart(e))
      .on('pointerup', () => this.onDragEnd())
      .on('pointerupoutside', () => this.onDragEnd())
      .on('pointermove', () => this.onDragMove());
  }

  protected onDragStart(event) {
    if (this.isDragStartPreconditionMet()) {
      const shapeToDrag = this.shapeToDrag();

      this.dragging = true;
      this.dragData = event.data;
      const relativeMousePosition = this.dragData.getLocalPosition(shapeToDrag);

      if (this.setPivotToMousePosition) {
        shapeToDrag.pivot.set(relativeMousePosition.x, relativeMousePosition.y);
      }

      shapeToDrag.alpha = 0.5;
    }
  }

  protected onDragEnd() {
    this.shapeToDrag().alpha = 1;
    this.dragging = false;
    this.dragData = null;
  }

  private onDragMove() {
    if (this.dragging  && this.isDragStartPreconditionMet()) {
      const shapeToDrag = this.shapeToDrag();
      const mousePosition = this.dragData.getLocalPosition(shapeToDrag.parent);

      this.onMove();

      shapeToDrag.x = mousePosition.x;
      shapeToDrag.y = mousePosition.y;
    }
  }
}
