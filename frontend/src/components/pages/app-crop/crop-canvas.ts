import {OpenCvService} from "../../../global/opencv/opencv.service";
import Konva from "konva";
import {DragableRectangle} from "./dragable-rectangle";
import {makeStagePinchZoomable} from "../../common/canvas/make-stage-pinch-zoomable";
import flyd from "flyd";
import Stream = flyd.Stream;

enum Orientation {
  Landscape,
  Portrait
}

export class CropCanvas {
  private canvasMarginX: number = 10;
  private canvasWidth: number;
  private canvasHeight: number;
  private canvasOrientation: Orientation;
  private canvasAspectRatio: number;

  private stage: Konva.Stage;
  private magnifiedStage: Konva.Stage;
  private image: Konva.Image;
  private imageLayer: Konva.Layer;
  private rectangle: DragableRectangle;

  private imageData: ImageData;
  private imageMarginXY: { x: number, y: number };
  private imageScaleRatio: number;

  constructor(
    private openCvService: OpenCvService,
    private width: number,
    private height: number,
    private controlsHeight: number,
    private canvas: HTMLDivElement,
    private magnifiedCanvas: HTMLDivElement,
    private primaryColor: string
  ) {
    this.setupCanvas();
    this.setupMagnifiedCanvas();
  }

  get rectCornerDragStart(): Stream<void> {
    return this.rectangle.dragStart;
  }

  get rectCornerDragEnd(): Stream<void> {
    return this.rectangle.dragEnd;
  }

  get imageAsPngBlob(): Promise<Blob> {
    const offscreenCanvas = new OffscreenCanvas(this.imageData.width, this.imageData.height)
    offscreenCanvas.getContext("2d").putImageData(this.imageData, 0, 0)
    return offscreenCanvas.convertToBlob({
      type: "image/jpeg",
      quality: 1
    })
  }

  private setupCanvas() {
    this.canvasWidth = innerWidth - this.canvasMarginX * 2;
    this.canvasHeight = innerHeight - this.controlsHeight;
    this.canvasOrientation = this.determineOrientation(this.canvasWidth, this.canvasHeight);
    this.canvasAspectRatio = this.calculateAspectRatio(this.canvasWidth, this.canvasHeight);

    this.stage = new Konva.Stage({
      container: this.canvas,
      width: this.canvasWidth,
      height: this.canvasHeight,
    });

    makeStagePinchZoomable(this.stage);

    this.stage.draw();
  }

  private setupMagnifiedCanvas() {
    this.magnifiedStage = new Konva.Stage({
      container: this.magnifiedCanvas,
      width: innerWidth,
      height: this.controlsHeight
    });
  }

  async drawImageAndDetectedRectangle(imageBlob: File) {
    this.stage.clear();
    this.stage.draw();
    const imageBitmap = await createImageBitmap(imageBlob);
    this.imageData = this.convertBitmapToImageData(imageBitmap);

    let imageOrientation = this.determineOrientation(this.imageData.width, this.imageData.height);

    if (imageOrientation !== this.canvasOrientation) {
      this.imageData = await this.openCvService.rotate90DegClockwise(this.imageData);
    }

    await this.fitOnScreen();
    this.drawImage();

    const detectedRectangle = await this.openCvService.detectRectangleAroundDocument(this.imageData, this.imageData.width, this.imageData.height, 0);

    // we have to adjust the rectangle to the drawing on the canvas.

    const points = detectedRectangle.rect.corners.map((corner) => ({
      x: (corner.x * this.imageScaleRatio) + this.imageMarginXY.x,
      y: (corner.y * this.imageScaleRatio) + this.imageMarginXY.y
    }));

    this.rectangle = new DragableRectangle(this.stage, this.magnifiedStage, points, this.primaryColor);

    this.stage.draw();
  }

  private determineOrientation(width: number, height: number): Orientation {
    if (width > height) {
      return Orientation.Landscape;
    } else {
      return Orientation.Portrait;
    }
  }

  private calculateAspectRatio(width: number, height: number): number {
    return height / width;
  }

  async rotate90DegClockwise() {
    this.imageData = await this.openCvService.rotate90DegClockwise(this.imageData);
    await this.fitOnScreen();
    this.drawImage();
  }

  async cropByDragableRectangle() {
    const rectangle = this.rectangle.getRectangle().map((point) => {
      return {
        x: (point.x - this.imageMarginXY.x) / this.imageScaleRatio,
        y: (point.y - this.imageMarginXY.y) / this.imageScaleRatio
      };
    });

    const cropped = await this.openCvService.cropAndWarpByPoints(this.imageData.data, { corners: rectangle }, this.imageData.width, this.imageData.height, 1);
    this.imageData = cropped;

    await this.fitOnScreen();
    this.drawImage();
    this.rectangle.clear();
  }

  async fitOnScreen() {
    let imageAspectRatio = this.calculateAspectRatio(this.imageData.width, this.imageData.height);

    // we need this step to ensure that the image is shown in full size without overlap
    if (imageAspectRatio < this.canvasAspectRatio) {
      // we set the scale ratio so that the width will be exactly as big as the width of the canvas.
      // (we want the width to be 100%)
      this.imageScaleRatio = this.canvasWidth / this.imageData.width;
      const scaledHeight = this.imageData.height * this.imageScaleRatio;
      this.imageMarginXY = { x: 0, y: (this.canvasHeight - scaledHeight) / 2 };
    } else {
      // we set the scale ratio so that the height will be exactly as big as the height of the canvas.
      // (we want the height to be 100%)
      this.imageScaleRatio = this.canvasHeight / this.imageData.height;
      const scaledWidth = this.imageData.width * this.imageScaleRatio;
      this.imageMarginXY = { x: (this.canvasWidth - scaledWidth) / 2, y: 0 };
    }
  }

  drawImage() {
    // scale here so that image is always shown full size
    const canvas = new OffscreenCanvas(this.imageData.width, this.imageData.height);
    const ctx = canvas.getContext("2d");
    ctx.putImageData(this.imageData, 0, 0, 0, 0, this.imageData.width, this.imageData.height);

    const smallCanvas = new OffscreenCanvas(this.imageData.width * this.imageScaleRatio, this.imageData.height * this.imageScaleRatio);
    const smallCtx = smallCanvas.getContext("2d");
    smallCtx.scale(this.imageScaleRatio, this.imageScaleRatio);
    smallCtx.drawImage(canvas, 0, 0);


    if (!this.image) {
      this.image = new Konva.Image({
        image: smallCanvas,
        x: this.imageMarginXY.x,
        y: this.imageMarginXY.y,
        id: "image"
      });

      this.imageLayer = new Konva.Layer();
      this.imageLayer.add(this.image);
      this.stage.add(this.imageLayer);
    } else {
      this.image.image(smallCanvas);
      this.image.x(this.imageMarginXY.x);
      this.image.y(this.imageMarginXY.y);

      this.imageLayer.batchDraw();
    }
  }

  private convertBitmapToImageData(bitmap: ImageBitmap): ImageData {
    const offscreenCanvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = offscreenCanvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);

    return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  }
}
