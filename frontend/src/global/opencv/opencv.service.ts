import { Injectable } from "../di/injectable";
import {
  load as _load,
  detectRectangleAroundDocument as _detectRectangleAroundDocument,
  cropAndWarpByPoints as _cropAndWarpByPoints,
  rotate90DegClockwise as _rotate90DegClockwise,
  makeBlackAndWhite as _makeBlackAndWhite
} from './opencv.worker';

export interface RotatedRect { corners: Array<{ x: number, y: number }> };

@Injectable
export class OpenCvService {
  private hasBeenLoaded: boolean = false;
  private loading: Promise<void>;

  async loadIfNotLoadedAlready() {
    if (!this.hasBeenLoaded && !this.loading) {
      this.loading = _load();
      await this.loading;
      this.hasBeenLoaded = true;
    } else if(!this.hasBeenLoaded && this.loading) {
      await this.loading;
    }
  }

  async detectRectangleAroundDocument(
    image: ImageData,
    width: number,
    height: number,
    left: number
  ): Promise<{ imageWithRectangle: ImageData, rect: RotatedRect }> {
    await this.loadIfNotLoadedAlready();
    return _detectRectangleAroundDocument(image, width, height, left);
  }

  async makeBlackAndWhite(
    image: ImageData
  ) {
    await this.loadIfNotLoadedAlready();
    return _makeBlackAndWhite(
      image,
      image.height,
      image.width
    );
  }

  async cropAndWarpByPoints(
    inputImage: Uint8ClampedArray,
    rect: RotatedRect,
    width: number,
    height: number,
    ratio: number
  ): Promise<ImageData> {
    await this.loadIfNotLoadedAlready();
    return _cropAndWarpByPoints(inputImage, rect, width, height, ratio);
  }

  async rotate90DegClockwise(
    inputImage: ImageData
  ): Promise<ImageData> {
    await this.loadIfNotLoadedAlready();
    return _rotate90DegClockwise(inputImage);
  }
}
