import {Injectable} from "../../../global/di/injectable";
import {OpenCvService} from "../../../global/opencv/opencv.service";
import {CropCanvas} from "./crop-canvas";
import {CssVarsService} from "../../../global/css-vars.service";

@Injectable
export class CropCanvasFactory {
  constructor(
    private openCvService: OpenCvService,
    private cssVarsService: CssVarsService
  ) {}

  async createCanvas(config: {
    width: number,
    height: number,
    controlsHeight: number,
    canvas: HTMLDivElement,
    magnifiedCanvas: HTMLDivElement
  }) {
    await this.openCvService.load();

    const { width, height, controlsHeight, canvas, magnifiedCanvas } = config;
    return new CropCanvas(
      this.openCvService,
      width,
      height,
      controlsHeight,
      canvas,
      this.cssVarsService.primaryColor
    );
  }
}
