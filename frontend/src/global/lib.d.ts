import {Container} from "./di/container";
import type QrScanner from 'qr-scanner';
import {Constructable} from "./di/constructable";

declare global {
  interface Window {
    container: Container;
    beforeInstallEvent: any;
  }

  const QRCode: any; // this lib has no types.
  const QrScanner: QrScanner;
}
