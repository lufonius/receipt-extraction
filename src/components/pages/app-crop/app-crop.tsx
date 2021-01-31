import {Component, h, State} from '@stencil/core';
import {GlobalStore} from "../../../global/global-store.service";
import {Inject} from "../../../global/di/inject";
import {OpenCvService} from "../../../global/opencv/opencv.service";
import Konva from 'konva';
import {DragableRectangle} from "./dragable-rectangle";
import flyd from 'flyd';
import {CssVarsService} from "../../../global/css-vars.service";
import {makeStagePinchZoomable} from "../../common/canvas/make-stage-pinch-zoomable";
import {CropCanvasFactory} from "./crop-canvas-factory";
import {CropCanvas} from "./crop-canvas";
import {MaterialIcons} from "../../../global/material-icons-enum";

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

  @Inject(CropCanvasFactory) private cropCanvasFactory: CropCanvasFactory;

  photoInput: HTMLInputElement;
  controlsHeight: number = 50;
  magnifiedCanvas: HTMLDivElement;
  canvas: HTMLDivElement;
  canvasMarginX: number = 10;

  private cropCanvas: CropCanvas;

  @State() controlsShown: boolean = true;
  @State() takePhotoShown: boolean = true;
  @State() cropShown: boolean = true;
  @State() rotateShown: boolean = false;
  @State() uploadShown: boolean = false;
  @State() alreadyTookPhotograph: boolean = false;

  private async setupCanvas() {
    this.cropCanvas = await this.cropCanvasFactory.createCanvas({
      width: innerWidth - this.canvasMarginX * 2,
      height: innerHeight - this.controlsHeight,
      canvas: this.canvas,
      controlsHeight: this.controlsHeight,
      magnifiedCanvas: this.magnifiedCanvas
    });
  }

  async rotate90DegClockwise() {
    await this.cropCanvas.rotate90DegClockwise();
  }

  async cropByDragableRectangle() {
    await this.cropCanvas.cropByDragableRectangle();
    this.cropShown = false;
    this.uploadShown = true;
    this.rotateShown = true;
  }

  async drawImageAndDetectedRectangle() {
    await this.setupCanvas();

    const file = this.photoInput.files[0];

    if (!!file) {
      await this.cropCanvas.drawImageAndDetectedRectangle(file);

      flyd.on(() => this.controlsShown = false, this.cropCanvas.rectCornerDragStart);
      flyd.on(() => this.controlsShown = true, this.cropCanvas.rectCornerDragEnd);

      this.alreadyTookPhotograph = true;
      this.cropShown = true;
    }
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

        {this.rotateShown &&
          <app-button-round
            id="rotateButton"
            onPress={() => this.rotate90DegClockwise()}
            firstLine="rotate"
            secondLine="image"
            icon={MaterialIcons.ROTATE_90_DEGREES_CCW}
          />}

        <div
          style={({ display: !this.controlsShown ? "none" : "flex", height: `${this.controlsHeight}px` })}
          class="controls"
        >
          {this.takePhotoShown && <app-button onPress={() => this.photoInput.click()} primary>
            { this.alreadyTookPhotograph ? "Retry" : "Take photo" }
          </app-button> }


          <div class="grow"></div>
          {this.cropShown && <app-button onPress={() => this.cropByDragableRectangle()} primary>Crop</app-button>}
          {this.uploadShown && <app-button primary>Upload</app-button>}
        </div>
        <input style={({ display: "none" })}  type="file" accept="image/*" capture="camera" onChange={() => this.drawImageAndDetectedRectangle()} ref={(el) => this.photoInput = el} />
      </div>
    );
  }
}
