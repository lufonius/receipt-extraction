import {Component, Host, h, State} from '@stencil/core';
import { v4 as uuid } from 'uuid';
import {Inject} from "../../../global/di/inject";
import {CssVarsService} from "../../../global/css-vars.service";

@Component({
  tag: 'app-qr-generation',
  styleUrl: 'app-qr-generation.scss',
  shadow: false,
})
export class AppQrGeneration {

  @Inject(CssVarsService) private cssVarsService: CssVarsService;
  @State() image: HTMLImageElement;

  async componentDidLoad() {
    const qrCode = await this.generateQRCode(uuid());
    this.image.src = qrCode;
  }

  generateQRCode(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      QRCode.toDataURL(text, {
        color: {
          light: this.cssVarsService.backgroundColor
        }
      }, (error, url) => {
        if(error) reject(error);

        if(url) resolve(url);
      });
    });
  }

  render() {
    return (
      <Host>
        <app-layout-vertical-split>
          <header slot="top">
            <app-logo />
          </header>
          <main class="center" slot="bottom">
            <p class="center-text">scan the qr code to upload files photos from your mobile device.</p>
            <img ref={(el) => this.image = el} />
          </main>
        </app-layout-vertical-split>
      </Host>
    );  }

}
