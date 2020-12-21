import {Component, h, State} from '@stencil/core';
import {EntityStore, Receipt} from "../../entity-store.service";
import {Inject} from "../../global/di/inject";
import flyd from 'flyd';
import {OpenCvService, RotatedRect} from "../../global/opencv/opencv.service";


@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
  shadow: false,
})
export class AppHome {

  @Inject(EntityStore) private entityStore: EntityStore;
  @State() receipts: Array<Receipt> = [];
  receiptId: string = "";

  screenWidth = screen.width;
  screenHeight = screen.height;

  @State() maxCameraWidth = 0;
  @State() maxCameraHeight = 0;

  @State() scaledWidth = 0;
  @State() scaledHeight = 0;

  @State() left: number = 0;

  rotatedRect: RotatedRect;
  ratio: number = 0;

  maxResolutionStream: MediaStream;

  videoElement: HTMLVideoElement;

  fakeCanvas: OffscreenCanvas;
  fakeContext2D: OffscreenCanvasRenderingContext2D;

  set outCanvas(elem: HTMLCanvasElement) {
    this.outcontext2D = elem.getContext("2d");
  }
  outcontext2D: CanvasRenderingContext2D;

  photoCanvas: HTMLCanvasElement;


  @Inject(OpenCvService) private openCvService: OpenCvService;

  componentWillLoad() {
    flyd.on(receipts => this.receipts = receipts, this.entityStore.selectReceipts());

    this.init();
  }

  async init() {
    const video = await this.initVideo();
    await video.play();
    await this.openCvService.load();


    this.fakeCanvas = new OffscreenCanvas(this.scaledWidth, this.scaledHeight);
    this.fakeContext2D = this.fakeCanvas.getContext("2d");
    this.openCvService.setCanvas(new OffscreenCanvas(this.scaledWidth, this.scaledHeight));

    // position the canvas in the middle
    this.left = -(this.scaledWidth - this.screenWidth) / 2;

    await this.setModifiedVideo();
  }

  async setModifiedVideo() {
    const FPS = 30;
    let begin = Date.now();

    const stream = this.videoElement.srcObject as MediaStream;
    const track = stream.getVideoTracks()[0];
    const capture = new ImageCapture(track);
    const bitmap = await capture.grabFrame();

    const newImageData = await this.openCvService.edgeDetect(
      bitmap,
      this.screenWidth,
      this.screenHeight,
      this.left * -1
    );

    if(!!newImageData) {
      const imgData = new ImageData(newImageData.imgData, this.screenWidth, this.screenHeight);
      this.rotatedRect = newImageData.rect;
      this.outcontext2D.putImageData(imgData, this.left * -1, 0, 0, 0, this.screenWidth, this.screenHeight);
    }
    let delay = 1000/FPS - (Date.now() - begin);
    setTimeout(async () => { await this.setModifiedVideo(); }, delay);
  }

  async initVideo(): Promise<HTMLVideoElement> {
    const stream = await this.getCameraStream();
    this.videoElement.srcObject = stream;

    return new Promise((resolve) => {
      this.videoElement.onloadedmetadata = () => {
        resolve(this.videoElement);
      };
    });
  }

  async getCameraStream(): Promise<MediaStream> {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'environment',
          width: { ideal: 100000 },
          height: { ideal: 100000 }
        },
      });

      this.maxResolutionStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: 'environment',
          width: { ideal: 100000 },
          height: { ideal: 100000 }
        },
      });

      // it might be possible that the camera does not support that resolution
      const { width, height } = stream.getVideoTracks()[0].getSettings();
      this.maxCameraWidth = width;
      this.maxCameraHeight = height;

      this.scaledHeight = this.screenHeight;
      this.ratio = this.maxCameraHeight / this.scaledHeight;
      this.scaledWidth = this.maxCameraWidth / this.ratio;

      return stream;
    }
  }

  addReceipt() {
    this.entityStore.addReceipt({ id: this.receiptId, total: 5.67, date: new Date(), imgUrl: "" });
    this.receiptId = "";
  }

  // TODO: move offscreenCanvas to worker
  async takePhoto() {
    const photoCanvasContext = this.photoCanvas.getContext("2d");

    const ratio = this.maxCameraHeight / this.screenHeight;
    const imageWidth = this.screenWidth * ratio;
    const imageHeight = this.maxCameraHeight;
    console.log("calculated", imageWidth, imageHeight);
    console.log("screen", this.screenWidth, this.screenHeight, ratio);
    photoCanvasContext.drawImage(
      this.videoElement,
      this.left * ratio * -1,
      0,
      imageWidth,
      imageHeight,
      0,
      0,
      imageWidth,
      imageHeight
    );

    const image = photoCanvasContext.getImageData(0, 0, imageWidth, imageHeight);

    const document = await this.openCvService.cropAndWarpByPoints(
      image.data,
      this.rotatedRect, // contains data about the
      imageWidth,
      imageHeight,
      ratio
    );

    // the spliting between what calculations to do here in the component and which ones to do in the worker is not
    // quite clean yet ... poc
    this.photoCanvas.width = document.imgData.width;
    this.photoCanvas.height = document.imgData.height;
    photoCanvasContext.putImageData(document.imgData, 0, 0);

    this.downloadURI(this.photoCanvas.toDataURL(), "photo");
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
        <div class="button button--bottom-fixed button--transparent" onClick={() => this.takePhoto()}>Take photo</div>
        <video style={({ display: "none" })} width={this.maxCameraWidth} height={this.maxCameraHeight} ref={(element) => this.videoElement = element}/>
        <canvas style={({ left: `${this.left}px` })} id="output" width={this.scaledWidth} height={this.scaledHeight} ref={(el) => this.outCanvas = el} />
        <canvas style={({ display: "none" })} width={this.maxCameraWidth} height={this.maxCameraHeight} ref={(el) => this.photoCanvas = el} />
      </div>
    );
  }
}
