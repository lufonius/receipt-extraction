import {OpenCvService} from "../../../global/opencv/opencv.service";
import {DragableRectangle} from "./dragable-rectangle";
import {Stage} from "../../common/drawing/stage";
import {Image} from "../../common/drawing/image";

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

  private stage: Stage;
  private image: Image;
  private rectangle: DragableRectangle;

  private imageData: ImageData;
  private imageMarginXY: { x: number, y: number };
  private imageScaleRatio: number;

  constructor(
    private openCvService: OpenCvService,
    private width: number,
    private height: number,
    private controlsHeight: number,
    private hostElement: HTMLDivElement,
    private primaryColor: string
  ) {
    this.setupCanvas();
  }

  get imageAsPngBlob(): Promise<Blob> {
    const offscreenCanvas = new OffscreenCanvas(this.imageData.width, this.imageData.height)
    offscreenCanvas.getContext("2d").putImageData(this.imageData, 0, 0)
    return offscreenCanvas.convertToBlob({
      type: "image/jpeg",
      quality: 1
    })
  }

  destroy() {
    this.stage.destroy();
  }

  private setupCanvas() {
    this.canvasWidth = innerWidth - this.canvasMarginX * 2;
    this.canvasHeight = innerHeight - this.controlsHeight;
    this.canvasOrientation = this.determineOrientation(this.canvasWidth, this.canvasHeight);
    this.canvasAspectRatio = this.calculateAspectRatio(this.canvasWidth, this.canvasHeight);

    this.stage = new Stage({
      hostElement: this.hostElement,
      width: this.canvasWidth,
      height: this.canvasHeight,
    });
  }

  async detectRectangle() {
    if (this.rectangle) {
      this.rectangle.clear();
    }

    const detectedRectangle = await this.openCvService.detectRectangleAroundDocument(this.imageData, this.imageData.width, this.imageData.height, 0);

    // we have to adjust the rectangle to the drawing on the canvas.
    const points = detectedRectangle.rect.corners.map((corner) => ({
      x: (corner.x * this.imageScaleRatio) + this.imageMarginXY.x,
      y: (corner.y * this.imageScaleRatio) + this.imageMarginXY.y
    }));

    this.rectangle = new DragableRectangle(this.stage, points, this.primaryColor);
  }

  initCropRectangle() {
    if (this.rectangle) {
      this.rectangle.clear();
    }

    const points = [
      {
        x: 0,
        y: this.imageMarginXY.y
      },
      {
        x: (this.imageData.width * this.imageScaleRatio) + this.imageMarginXY.x,
        y: this.imageMarginXY.y
      },
      {
        x: (this.imageData.width  * this.imageScaleRatio) + this.imageMarginXY.x,
        y: (this.imageData.height * this.imageScaleRatio) + this.imageMarginXY.y
      },
      {
        x: 0,
        y: (this.imageData.height * this.imageScaleRatio) + this.imageMarginXY.y
      }
    ];

    this.rectangle = new DragableRectangle(this.stage, points, this.primaryColor);
  }

  async fitAndDrawImageBlob(imageBlob: File) {
    const imageBitmap = await createImageBitmap(imageBlob);
    this.imageData = this.convertBitmapToImageData(imageBitmap);
    await this.makeBlackAndWhite();

    let imageOrientation = this.determineOrientation(this.imageData.width, this.imageData.height);

    if (imageOrientation !== this.canvasOrientation) {
      this.imageData = await this.openCvService.rotate90DegClockwise(this.imageData);
    }

    await this.fitOnScreen();
    this.drawImage();
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

  async makeBlackAndWhite() {
    this.imageData = await this.openCvService.makeBlackAndWhite(this.imageData);
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
    this.initCropRectangle();
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
    } else {      // we set the scale ratio so that the height will be exactly as big as the height of the canvas.
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
      this.image = new Image();
      this.image.createManually({
        image: smallCanvas,
        x: this.imageMarginXY.x,
        y: this.imageMarginXY.y,
        id: "image"
      });

      this.stage.addLine(this.image);
    } else {
      this.image.setImage(smallCanvas);
      this.image.setPosition(this.imageMarginXY);
    }
  }

  private convertBitmapToImageData(bitmap: ImageBitmap): ImageData {
    const offscreenCanvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = offscreenCanvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);

    return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  }
}
