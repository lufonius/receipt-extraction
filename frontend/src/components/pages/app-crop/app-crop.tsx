import {Component, h, Prop, State} from '@stencil/core';
import { RouterHistory } from '@stencil/router';
import {Inject} from "../../../global/di/inject";
import {CropCanvasFactory} from "./crop-canvas-factory";
import {CropCanvas} from "./crop-canvas";
import {Icons} from "../../../global/icons-enum";
import {InitReceiptService} from "./init-receipt.service";
import {GlobalStore} from "../../../global/global-store.service";
import {Mapper} from "../../model/mapper";
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
  @Inject(GlobalStore) private globalStore: GlobalStore;
  @Inject(Mapper) private mapper: Mapper;
  @Inject(ReceiptService) private receiptService: ReceiptService;

  @Prop() history: RouterHistory;

  photoInput: HTMLInputElement;
  controlsHeight: number = 60;
  magnifiedCanvas: HTMLDivElement;
  canvas: HTMLDivElement;
  canvasMarginX: number = 10;

  private cropCanvas: CropCanvas;

  @State() hasActiveImage: boolean = false;
  @State() alreadyTookPhotograph: boolean = false;
  @State() dialog: HTMLAppDialogElement;
  @State() isUploading: boolean = true;

  private currentReceipt: Receipt;

  async componentDidLoad() {
    if (this.history.location.state.image instanceof File) {
      const file: File = this.history.location.state.image;
      await this.drawImage(file);
      this.initCropRectangle();
      this.hasActiveImage = true;
    } else {
      this.history.push('/');
    }
  }

  private async drawImage(file: File) {
    await this.setupCanvas();

    if (!!file) {
      await this.cropCanvas.fitAndDrawImageBlob(file);
    }
  }

  async rotate90DegClockwise() {
    await this.cropCanvas.rotate90DegClockwise();
  }

  async cropByDragableRectangle() {
    await this.cropCanvas.cropByDragableRectangle();
  }

  async detectEdges() {
    await this.cropCanvas.detectRectangle();
  }

  initCropRectangle() {
    this.cropCanvas.initCropRectangle();
  }

  async retryTakingImage() {
    if (this.photoInput.files.length > 0) {
      if (this.hasActiveImage) {
        this.cropCanvas.destroy();
      }

      await this.setupCanvas();

      const file: File = this.photoInput.files[0];

      if (!!file) {
        await this.cropCanvas.fitAndDrawImageBlob(file);
        this.hasActiveImage = true;
        this.initCropRectangle();
      }
    }
  }

  private async setupCanvas() {
    this.cropCanvas = await this.cropCanvasFactory.createCanvas({
      width: innerWidth - this.canvasMarginX * 2,
      height: innerHeight - this.controlsHeight,
      canvas: this.canvas,
      controlsHeight: this.controlsHeight
    });
  }

  // TODO: add another upload only, and make initing the receipt a separate step
  async initReceiptAndShowDialog() {
    this.dialog.isVisible(true);
    try {
      this.isUploading = true;
      const jpegAsBlob = await this.cropCanvas.imageAsPngBlob
      const receiptDto = await this.initReceiptService.initReceipt(jpegAsBlob)
      const categories = this.globalStore.selectCategories()();
      const receipt = this.mapper.receiptFromDto(receiptDto, categories);
      this.isUploading = false;
      this.currentReceipt = receipt;
      this.globalStore.setCurrentReceipt(receipt);
    } catch (error) {
      // retry?
      this.dialog.isVisible(false);
      this.isUploading = false;
    }
  }

  async takeNextImage() {
    this.cropCanvas.destroy();
    await this.dialog.isVisible(false);

    this.hasActiveImage = false;
    this.isUploading = false;

    this.photoInput.click();
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

        {this.hasActiveImage && <div style={({ height: `${this.controlsHeight}px` })} class="controls">
          <app-button onPress={() => this.photoInput.click()}>Retry</app-button>
          <div class="grow" />
          <app-button onPress={() => this.initReceiptAndShowDialog()} primary>Upload</app-button>
        </div>}

        {!this.hasActiveImage && <div style={({ height: `${this.controlsHeight}px` })} class="controls">
          <app-button onPress={() => this.photoInput.click()}>Take photo</app-button>
        </div>}

        {this.hasActiveImage && <div class="image-editing-controls">
          <app-button-round
            label="crop"
            classes="button-round--primary"
            onPress={() => this.cropByDragableRectangle()}
          >
            <app-icon icon={Icons.CROP} />
          </app-button-round>

          <app-button-round
            label="detect edges"
            classes="button-round--primary"
            onPress={() => this.detectEdges()}
          >
            <app-icon icon={Icons.EYE} />
          </app-button-round>

          <app-button-round
            label="rotate"
            classes="button-round--primary"
            onPress={() => this.rotate90DegClockwise()}
          >
            <app-icon icon={Icons.ROTATE_CCW} />
          </app-button-round>
        </div>}

        <input style={({ display: "none" })} type="file" accept="image/*" capture="camera" onChange={() => this.retryTakingImage()} ref={(el) => this.photoInput = el} />

        <app-dialog ref={(el) => this.dialog = el} manuallyClosable={false}>
          <div class="dialog">
            <div class="dialog-header">
              <h4>Uploading image</h4>
            </div>
            <app-divider />
            <div class="dialog-body">
              {this.isUploading && <app-loader />}
              {!this.isUploading && <h4>Upload succeeded</h4>}
            </div>
            <app-divider />
            <div class="dialog-footer">
              <app-button onPress={() => this.takeNextImage()}>Upload next</app-button>
              <div class="grow" />
              <app-button primary disabled={this.isUploading} onPress={() => this.startExtraction()}>Extract infos</app-button>
            </div>
          </div>
        </app-dialog>
      </div>
    );
  }
}
