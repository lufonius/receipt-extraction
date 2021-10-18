import {Component, h, Prop, State} from '@stencil/core';
import { RouterHistory } from '@stencil/router';
import {Inject} from "../../../global/di/inject";
import {CropCanvasFactory} from "./crop-canvas-factory";
import {CropCanvas} from "./crop-canvas";
import {Icons} from "../../../global/icons-enum";
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
  controlsHeight: number = 60;
  magnifiedCanvas: HTMLDivElement;
  canvas: HTMLDivElement;
  canvasMarginX: number = 10;

  private cropCanvas: CropCanvas;

  @State() hasActiveImage: boolean = false;
  @State() alreadyTookPhotograph: boolean = false;
  @State() dialog: HTMLAppDialogElement;
  @State() isUploading: boolean = false;

  private currentReceipt: Receipt;

  async componentDidLoad() {
    if (this.history.location.state.image instanceof File) {
      const file: File = this.history.location.state.image;
      await this.drawImage(file);
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

  async takeNextImage() {
    this.cropCanvas.destroy();
    await this.dialog.isVisible(false);

    this.hasActiveImage = false;
    this.isUploading = false;

    this.photoInput.click();
  }

  /*
  * {this.rotateShown &&
          <app-button-round
            id="rotateButton"
            label="rotate image"
            classes="button-round--primary"
            onPress={() => this.rotate90DegClockwise()}
          >
            <app-icon icon={Icons.ROTATE_CCW} />
          </app-button-round>
        }
  * */

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

        <input style={({ display: "none" })} type="file" accept="image/*" capture="camera" onChange={() => this.retryTakingImage()} ref={(el) => this.photoInput = el} />

        <app-dialog ref={(el) => this.dialog = el} manuallyClosable={false}>
          <div class="dialog-body">
            {this.isUploading && <div>
              <app-loader />
              <p>Uploading image and extracting text</p>
            </div>}
            {!this.isUploading && <div>
              <app-icon icon={Icons.DONE} />
              <p>Upload done!</p>
            </div>}
          </div>
          <div class="dialog-footer">
            <app-button primary fullWidth onPress={() => this.takeNextImage()}>Meanwhile, upload next</app-button>
            <app-button primary fullWidth disabled={this.isUploading} onPress={() => this.startExtraction()}>Extract values</app-button>
          </div>
        </app-dialog>
      </div>
    );
  }
}
