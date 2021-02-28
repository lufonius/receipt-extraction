import {Component, h} from '@stencil/core';
import {GlobalStore} from "../../../global/global-store.service";
import {Inject} from "../../../global/di/inject";
import flyd from 'flyd';
import {OpenCvService} from "../../../global/opencv/opencv.service";


@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
  shadow: false,
})
export class AppHome {
  render() {
    return (
      <div>
        <stencil-route-link url="/">Home</stencil-route-link><br />
        <stencil-route-link url="/crop">Crop image</stencil-route-link><br />
        <stencil-route-link url="/qr-generation">Qr generation</stencil-route-link><br />
        <stencil-route-link url="/qr-scan">Qr scanning</stencil-route-link><br />
        <stencil-route-link url="/receipt-extraction">Receipt extraction</stencil-route-link><br />
        <stencil-route-link url="/components">All components</stencil-route-link>
        <stencil-route-link url="/list-receipts">list receipts</stencil-route-link>
      </div>
    );
  }
}
