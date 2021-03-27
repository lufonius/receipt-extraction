import {Component, h, Prop, State} from '@stencil/core';
import { RouterHistory } from '@stencil/router';
import {Inject} from "../../../global/di/inject";
import {CropCanvasFactory} from "./crop-canvas-factory";
import {CropCanvas} from "./crop-canvas";
import {MaterialIcons} from "../../../global/material-icons-enum";
import {InitReceiptService} from "./init-receipt.service";
import {GlobalStore} from "../../../global/global-store.service";
import {Mapper} from "../../model/mapper";
import {CategoryService} from "../category.service";
import {ReceiptService} from "../receipt.service";
import {Receipt} from "../../model/client";

@Component({
  tag: 'app-crop',
  styleUrl: 'app-crop.scss',
  shadow: false,
})
export class AppCrop {
  @Inject(CropCanvasFactory) private cropCanvasFactory: CropCanvasFactory;
  @Inject(InitReceiptService) private initReceiptService: InitReceiptService;
  @Inject(CategoryService) private categoryService: CategoryService;
  @Inject(GlobalStore) private globalStore: GlobalStore;
  @Inject(Mapper) private mapper: Mapper;
  @Inject(ReceiptService) private receiptService: ReceiptService;

  @Prop() history: RouterHistory;

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
  @State() dialog: HTMLAppDialogElement;
  @State() isUploading: boolean = false;

  private currentReceipt: Receipt;

  private async setupCanvas() {
    this.cropCanvas = await this.cropCanvasFactory.createCanvas({
      width: innerWidth - this.canvasMarginX * 2,
      height: innerHeight - this.controlsHeight,
      canvas: this.canvas,
      controlsHeight: this.controlsHeight
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

    const file: File = this.photoInput.files[0];

    if (!!file) {
      await this.cropCanvas.drawImageAndDetectedRectangle(file);

      this.alreadyTookPhotograph = true;
      this.cropShown = true;
    }
  }

  async initReceiptAndShowDialog() {
    this.dialog.isVisible(true);
    try {
      this.isUploading = true;
      const jpegAsBlob = await this.cropCanvas.imageAsPngBlob
      const receiptDto = await this.initReceiptService.initReceipt(jpegAsBlob)
      const categories = await this.categoryService.getCategories();
      const receipt = this.mapper.receiptFromDto(receiptDto, categories);
      this.isUploading = false;
      this.currentReceipt = receipt;
      this.globalStore.setCurrentReceipt(receipt);
      this.globalStore.setCategories(categories);
    } catch (error) {
      // retry?
      this.dialog.isVisible(false);
      this.isUploading = false;
    }
  }

  async reset() {

  }

  async startExtraction() {
    try {
      await this.receiptService.startExtraction(this.currentReceipt.id);
      this.history.push('/receipt-extraction');
    } catch (error) {
      // wat do? wen hop?
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
          >
            <app-icon>{MaterialIcons.ROTATE_90_DEGREES_CCW}</app-icon>
            <span>rotate</span><br />
            <span>image</span>
          </app-button-round>
        }

        <div
          style={({ display: !this.controlsShown ? "none" : "flex", height: `${this.controlsHeight}px` })}
          class="controls"
        >
          {this.takePhotoShown && <app-button onPress={() => this.photoInput.click()} primary>
            { this.alreadyTookPhotograph ? "Retry" : "Take photo" }
          </app-button> }


          <div class="grow" />
          {this.cropShown && <app-button onPress={() => this.cropByDragableRectangle()} primary>Crop</app-button>}
          {this.uploadShown && <app-button onPress={() => this.initReceiptAndShowDialog()} primary>Upload</app-button>}
        </div>
        <input style={({ display: "none" })}  type="file" accept="image/*" capture="camera" onChange={() => this.drawImageAndDetectedRectangle()} ref={(el) => this.photoInput = el} />

        <app-dialog ref={(el) => this.dialog = el} manuallyClosable={false}>
          <div class="dialog-body">
            {this.isUploading && <div>
              <app-loader />
              <p>Uploading image and extracting text</p>
            </div>}
            {!this.isUploading && <div>
              <app-icon>{MaterialIcons.DONE}</app-icon>
              <p>Upload done!</p>
            </div>}
          </div>
          <div class="dialog-footer">
            <app-button primary onPress={() => this.reset()}>Meanwhile, upload next</app-button>
            <app-button primary disabled={this.isUploading} onPress={() => this.startExtraction()}>Extract values</app-button>
          </div>
        </app-dialog>
      </div>
    );
  }
}
