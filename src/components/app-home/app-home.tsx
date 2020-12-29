import {Component, h} from '@stencil/core';
import {EntityStore} from "../../entity-store.service";
import {Inject} from "../../global/di/inject";
import flyd from 'flyd';
import {OpenCvService} from "../../global/opencv/opencv.service";


@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
  shadow: false,
})
export class AppHome {

  @Inject(EntityStore) private entityStore: EntityStore;

  photoInput: HTMLInputElement;
  outCanvas: HTMLCanvasElement;

  @Inject(OpenCvService) private openCvService: OpenCvService;

  componentWillLoad() {
    this.openCvService.load();
  }


  async detectEdgesAndDraw() {
    const originalBlob = this.photoInput.files[0];
    const originalBitmap = await createImageBitmap(originalBlob);

    const originalImageData = this.imageDataFromBitmap(originalBitmap);

    const scaledWidth = 600;
    const scaleRatio = originalBitmap.width / scaledWidth;
    const scaledHeight = originalBitmap.height / scaleRatio;
    const scaledBitmap = await this.scaleBitmap(scaledWidth, scaledHeight, originalBitmap);

    const detectedRectangle = await this.openCvService.edgeDetect(scaledBitmap, scaledBitmap.width, scaledBitmap.height, 0);
    const cropped = await this.openCvService.cropAndWarpByPoints(originalImageData.data, detectedRectangle.rect, originalBitmap.width, originalBitmap.height, scaleRatio);
    this.outCanvas.width = cropped.imgData.width;
    this.outCanvas.height = cropped.imgData.height;
    const ctx = this.outCanvas.getContext("2d");

    ctx.putImageData(cropped.imgData, 0, 0, 0, 0, cropped.imgData.width, cropped.imgData.height);

    this.downloadURI(this.outCanvas.toDataURL(), "cropped");
  }

  private imageDataFromBitmap(bitmap: ImageBitmap) {
    const originalCanvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const originalCanvasCtx = originalCanvas.getContext("2d");
    originalCanvasCtx.drawImage(bitmap, 0, 0);

    const original = originalCanvasCtx.getImageData(0, 0, bitmap.width, bitmap.height);
    return original;
  }

  private async scaleBitmap(scaledWidth: number, scaledHeight: number, bitmap: ImageBitmap) {
    const fakeCanvas = new OffscreenCanvas(scaledWidth, scaledHeight);
    const fakeContext2D = fakeCanvas.getContext("2d");
    fakeContext2D.drawImage(bitmap, 0, 0, scaledWidth, scaledHeight);
    const imageData: ImageData = fakeContext2D.getImageData(0, 0, scaledWidth, scaledHeight);
    const scaledBitmap = await createImageBitmap(imageData);
    return scaledBitmap;
  }

  downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  render() {
    return (
      <div>
        <div class="button button--bottom-fixed button--transparent" onClick={() => this.photoInput.click()}>Take photo</div>
        <input style={({ display: "none" })}  type="file" accept="image/*" capture="camera" onChange={() => this.detectEdgesAndDraw()} ref={(el) => this.photoInput = el} />
        <canvas ref={(el) => this.outCanvas = el} />
      </div>
    );
  }
}
