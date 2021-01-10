import {Component, h, State} from '@stencil/core';
import {GlobalStore} from "../../../global/global-store.service";
import {Inject} from "../../../global/di/inject";
import {OpenCvService} from "../../../global/opencv/opencv.service";
import Konva from 'konva';
import {DragableRectangle} from "./dragable-rectangle";
import flyd from 'flyd';
import {CssVarsService} from "../../../global/css-vars.service";

enum Orientation {
  Landscape,
  Portrait
}

@Component({
  tag: 'app-crop',
  styleUrl: 'app-crop.scss',
  shadow: false,
})
export class AppCrop {

  @Inject(GlobalStore) private entityStore: GlobalStore;
  @Inject(OpenCvService) private openCvService: OpenCvService;
  @Inject(CssVarsService) private cssVarsStore: CssVarsService;

  photoInput: HTMLInputElement;
  controlsHeight: number = 50;
  magnifiedCanvas: HTMLDivElement;
  canvas: HTMLDivElement;
  canvasMarginX: number = 10;
  canvasWidth: number;
  canvasHeight: number;
  canvasOrientation: Orientation;
  canvasAspectRatio: number;

  stage: Konva.Stage;
  magnifiedStage: Konva.Stage;
  image: Konva.Image;
  rectangle: DragableRectangle;

  imageData: ImageData;

  imageMarginXY: { x: number, y: number };
  imageScaleRatio: number;

  @State() controlsShown: boolean = true;

  componentWillLoad() {
    this.openCvService.load();
  }

  componentDidLoad() {
    this.setupCanvas();
    this.setupMagnifiedCanvas();
  }

  setupMagnifiedCanvas() {
    this.magnifiedStage = new Konva.Stage({
      container: this.magnifiedCanvas,
      width: innerWidth,
      height: this.controlsHeight
    });
  }

  setupCanvas() {
    this.canvasWidth = innerWidth - this.canvasMarginX * 2;
    this.canvasHeight = innerHeight - this.controlsHeight;
    this.canvasOrientation = this.determineOrientation(this.canvasWidth, this.canvasHeight);
    this.canvasAspectRatio = this.calculateAspectRatio(this.canvasWidth, this.canvasHeight);

    this.stage = new Konva.Stage({
      container: this.canvas,
      width: this.canvasWidth,
      height: this.canvasHeight,
    });

    this.stage.draw();
  }

  private determineOrientation(width: number, height: number): Orientation {
    if (width > height) {
      return Orientation.Landscape;
    } else {
      return Orientation.Portrait;
    }
  }

  // width = 1
  // height = return value
  // 1 : <return value>
  private calculateAspectRatio(width: number, height: number): number {
    return height / width;
  }

  async detectEdgesAndDraw() {
    this.stage.clear();
    this.stage.draw();
    const imageBlob = this.photoInput.files[0];
    const imageBitmap = await createImageBitmap(imageBlob);
    this.imageData = this.convertBitmapToImageData(imageBitmap);

    let imageOrientation = this.determineOrientation(this.imageData.width, this.imageData.height);

    if (imageOrientation !== this.canvasOrientation) {
      this.imageData = await this.openCvService.rotate90DegClockwise(this.imageData);
    }

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

    // scale here so that image is always shown full size
    const canvas = new OffscreenCanvas(this.imageData.width, this.imageData.height);
    const ctx = canvas.getContext("2d");
    ctx.putImageData(this.imageData, 0, 0, 0, 0, this.imageData.width, this.imageData.height);

    const smallCanvas = new OffscreenCanvas(this.imageData.width * this.imageScaleRatio, this.imageData.height * this.imageScaleRatio);
    const smallCtx = smallCanvas.getContext("2d");
    smallCtx.scale(this.imageScaleRatio, this.imageScaleRatio);
    smallCtx.drawImage(canvas, 0, 0);

    this.image = new Konva.Image({
      image: smallCanvas,
      x: this.imageMarginXY.x,
      y: this.imageMarginXY.y,
      id: "image"
    });

    const imageLayer = new Konva.Layer();
    imageLayer.add(this.image);

    const detectedRectangle = await this.openCvService.detectRectangleAroundDocument(this.imageData, this.imageData.width, this.imageData.height, 0);

    // we have to adjust the rectangle to the drawing on the canvas.

    const points = detectedRectangle.rect.corners.map((corner) => ({
      x: (corner.x * this.imageScaleRatio) + this.imageMarginXY.x,
      y: (corner.y * this.imageScaleRatio) + this.imageMarginXY.y
    }));

    this.stage.add(imageLayer);
    const primaryColor = this.cssVarsStore.primaryColor;
    this.rectangle = new DragableRectangle(this.stage, this.magnifiedStage, points, primaryColor);

    flyd.on(() => {
      this.controlsShown = false;
    }, this.rectangle.dragStart);
    flyd.on(() => this.controlsShown = true, this.rectangle.dragEnd);

    this.stage.draw();
  }

  private outCanvas: HTMLCanvasElement;
  async crop() {
    const rectangle = this.rectangle.getRectangle().map((point) => {
      return {
        x: (point.x - this.imageMarginXY.x) / this.imageScaleRatio,
        y: (point.y - this.imageMarginXY.y) / this.imageScaleRatio
      };
    });

    const cropped = await this.openCvService.cropAndWarpByPoints(this.imageData.data, { corners: rectangle }, this.imageData.width, this.imageData.height, 1);
    this.outCanvas.width = cropped.width;
    this.outCanvas.height = cropped.height;
    this.outCanvas.getContext("2d").putImageData(cropped, 0, 0);
    this.downloadURI(this.outCanvas.toDataURL(), "cropped");
  }

  downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private convertBitmapToImageData(bitmap: ImageBitmap): ImageData {
    const offscreenCanvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = offscreenCanvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);

    return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  }

  render() {
    return (
      <div class="background">
        <div
          class="canvas"
          style={({ height: `${innerHeight - this.controlsHeight}px`, "margin-left": `${this.canvasMarginX}px`, })}
          ref={(el) => this.canvas = el}
        />
        <div
          class="magnified-canvas"
          style={({ height: `${this.controlsHeight}px`, display: this.controlsShown ? "none" : "block" })}
          ref={(el) => this.magnifiedCanvas = el}
        />
        <div
          style={({ display: !this.controlsShown ? "none" : "flex" })}
          class="controls"
        >
          <div
            style={({ height: `${this.controlsHeight}px` })}
            class="button button--primary"
            onClick={() => this.photoInput.click()}
          >
            Take photo
          </div>
          <div
            style={({ height: `${this.controlsHeight}px` })}
            class="button button--primary"
            onClick={() => this.crop()}
          >
            Crop
          </div>
        </div>
        <input style={({ display: "none" })}  type="file" accept="image/*" capture="camera" onChange={() => this.detectEdgesAndDraw()} ref={(el) => this.photoInput = el} />
        <canvas style={({ display: "none" })}  ref={(el) => this.outCanvas = el} />
      </div>
    );
  }
}
