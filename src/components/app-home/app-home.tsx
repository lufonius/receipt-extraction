import {Component, h} from '@stencil/core';
import {EntityStore} from "../../entity-store.service";
import {Inject} from "../../global/di/inject";
import flyd from 'flyd';
import {OpenCvService} from "../../global/opencv/opencv.service";


@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss',
  shadow: false,
})
export class AppHome {
  render() {
    return (
      <div>
        <stencil-route-link url="/">Home</stencil-route-link>
        <stencil-route-link url="/crop">Crop image</stencil-route-link>
      </div>
    );
  }
}
