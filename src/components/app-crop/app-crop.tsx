import {Component, h} from '@stencil/core';
import {EntityStore} from "../../entity-store.service";
import {Inject} from "../../global/di/inject";
import flyd from 'flyd';
import {OpenCvService} from "../../global/opencv/opencv.service";

@Component({
  tag: 'app-crop',
  styleUrl: 'app-crop.scss',
  shadow: false,
})
export class AppCrop {

  @Inject(EntityStore) private entityStore: EntityStore;

  photoInput: HTMLInputElement;
  outCanvas: HTMLCanvasElement;
  img: HTMLImageElement;

  @Inject(OpenCvService) private openCvService: OpenCvService;

  componentWillLoad() {
    this.openCvService.load();
  }

  async detectEdgesAndDraw() {
    const originalBlob = this.photoInput.files[0];
    const originalBitmap = await createImageBitmap(originalBlob);

    const detectedRectangle = await this.openCvService.detectRectangleAroundDocument(originalBitmap, originalBitmap.width, originalBitmap.height, 0);

    console.log(detectedRectangle);

    const ctx = this.outCanvas.getContext("2d");

    const originalImageData = this.imageDataFromBitmap(originalBitmap);
    this.outCanvas.width = originalImageData.width;
    this.outCanvas.height = originalImageData.height;

    ctx.putImageData(
      originalImageData,
      0,
      0,
      0,
      0,
      originalImageData.width,
      originalImageData.height
    );

    this.img.src = this.outCanvas.toDataURL();

    this.downloadURI(this.outCanvas.toDataURL(), "cropped");
  }

  private imageDataFromBitmap(bitmap: ImageBitmap) {
    const originalCanvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const originalCanvasCtx = originalCanvas.getContext("2d");
    originalCanvasCtx.drawImage(bitmap, 0, 0);

    const original = originalCanvasCtx.getImageData(0, 0, bitmap.width, bitmap.height);
    return original;
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
      <div class="background">
        <div class="button button--bottom-fixed" onClick={() => this.photoInput.click()}>Take photo</div>
        <input style={({ display: "none" })}  type="file" accept="image/*" capture="camera" onChange={() => this.detectEdgesAndDraw()} ref={(el) => this.photoInput = el} />
        <canvas style={({ display: "none" })} ref={(el) => this.outCanvas = el} />
        <div class="outimage outimage--center">
          <img class="outimage__image" ref={(el) => this.img = el}/>
        </div>
      </div>
    );
  }
}
