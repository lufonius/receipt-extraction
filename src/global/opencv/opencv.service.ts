import { Injectable } from "../di/injectable";
import {
  load as _load,
  detectRectangleAroundDocument as _detectRectangleAroundDocument,
  cropAndWarpByPoints as _cropAndWarpByPoints
} from './opencv.worker';

export interface RotatedRect { corners: Array<{ x: number, y: number }> };

@Injectable
export class OpenCvService {
  async load(): Promise<void> {
    return _load();
  }

  async detectRectangleAroundDocument(
    imageBitmap: ImageBitmap,
    width: number,
    height: number,
    left: number
  ): Promise<{ imageWithRectangle: ImageData, rect: RotatedRect }> {
    return _detectRectangleAroundDocument(imageBitmap, width, height, left);
  }

  async cropAndWarpByPoints(
    inputImage: Uint8ClampedArray,
    rect: RotatedRect,
    width: number,
    height: number,
    ratio: number
  ): Promise<ImageData> {
    return _cropAndWarpByPoints(inputImage, rect, width, height, ratio);
  }
}
