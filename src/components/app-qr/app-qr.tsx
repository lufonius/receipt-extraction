import {Component, Host, h, State} from '@stencil/core';
import { v4 as uuid } from 'uuid';

@Component({
  tag: 'app-qr',
  styleUrl: 'app-qr.scss',
  shadow: true,
})
export class AppQr {

  @State() image: HTMLImageElement;
  video: HTMLVideoElement;
  canvasContainer: HTMLDivElement;
  @State() scannedQrOutput: string;

  async componentDidLoad() {
    const qrCode = await this.generateQRCode(uuid());

    this.image.src = qrCode;

    // @ts-ignore
    const qrScanner = new QrScanner(this.video, result => {
      this.scannedQrOutput = result;
    });
    this.canvasContainer.appendChild(qrScanner.$canvas);
    qrScanner.start();

    console.log(qrCode);
  }

  generateQRCode(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(text, (error, url) => {
        if(error) reject(error);

        if(url) resolve(url);
      });
    });
  }

  render() {
    return (
      <Host>
        <img ref={(el) => this.image = el} />

        <video style={({ display: "none" })} ref={el => this.video = el} />
        <div ref={el => this.canvasContainer = el} />
        <p>{ this.scannedQrOutput }</p>
      </Host>
    );  }

}
