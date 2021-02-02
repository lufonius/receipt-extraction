import { Injectable } from "../di/injectable";
import {
  load as _load,
  detectRectangleAroundDocument as _detectRectangleAroundDocument,
  cropAndWarpByPoints as _cropAndWarpByPoints,
  rotate90DegClockwise as _rotate90DegClockwise
} from './opencv.worker';

export interface RotatedRect { corners: Array<{ x: number, y: number }> };

@Injectable
export class OpenCvService {
  async load(): Promise<void> {
    return _load();
  }

  async detectRectangleAroundDocument(
    image: ImageData,
    width: number,
    height: number,
    left: number
  ): Promise<{ imageWithRectangle: ImageData, rect: RotatedRect }> {
    return _detectRectangleAroundDocument(image, width, height, left);
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

  async rotate90DegClockwise(
    inputImage: ImageData
  ): Promise<ImageData> {
    return _rotate90DegClockwise(inputImage);
  }
}
