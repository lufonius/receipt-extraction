import {Component, Host, h, State} from '@stencil/core';

@Component({
  tag: 'app-qr-scan',
  styleUrl: 'app-qr-scan.scss',
  shadow: false,
})
export class AppQrScan {

  private video: HTMLVideoElement;
  private canvasContainer: HTMLDivElement;
  @State() private canvasContainerHeight: number = 0;

  async componentDidLoad() {
    // @ts-ignore
    const qrScanner = new QrScanner(this.video, result => {
      console.log(result);
    });
    const canvas = qrScanner.$canvas;
    canvas.id = "canvas";
    this.resizeCanvas(canvas);
    this.canvasContainer.appendChild(canvas);
    qrScanner.start();
  }

  private resizeCanvas(canvas: HTMLCanvasElement) {
    const widthOfContainer = this.canvasContainer.clientWidth - 6;
    const widthOfOriginalCanvas = parseInt(canvas.getAttribute("width"));
    const scale = widthOfContainer / widthOfOriginalCanvas;

    const heightOfOriginalCanvas = parseInt(canvas.getAttribute("height"));
    this.canvasContainerHeight = heightOfOriginalCanvas * scale;

    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
  }

  render() {
    return (
      <Host>
        <app-layout-vertical-split>
          <header slot="top">
            <app-logo />
          </header>
          <main class="center" slot="bottom">
            <p class="center-text">scan the qr code to start uploading photos.</p>
            <video style={({ display: "none" })} ref={el => this.video = el} />
            <div class="qr-scanner-display" style={({ height: `${this.canvasContainerHeight}px` })} ref={el => this.canvasContainer = el} />
          </main>
        </app-layout-vertical-split>
      </Host>
    );
  }

}
