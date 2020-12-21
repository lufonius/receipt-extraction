import {Injectable} from "../di/injectable";

export interface RotatedRect { corners: Array<{ x: number, y: number }>, size: { width: number, height: number } };

@Injectable
export class OpenCvService {

  private _status = {};
  private worker: Worker;

  private dispatch(event) {
    const { msg } = event
    this._status[msg] = ['loading']
    this.worker.postMessage(event)
    return new Promise((res, rej) => {
      let interval = setInterval(() => {
        const status = this._status[msg]
        if (status[0] === 'done') res(status[1])
        if (status[0] === 'error') rej(status[1])
        if (status[0] !== 'loading') {
          delete this._status[msg]
          clearInterval(interval)
        }
      }, 50)
    })
  }

  async load() {
    this._status = {}
    this.worker = new Worker('./lib/opencv.worker.js') // load worker

    // Capture events and save [status, event] inside the _status object
    this.worker.onmessage = (e: any) => {
      console.log(e);
      this._status[e.data.msg] = ['done', e];
    };
    this.worker.onerror = (e: any) => {
      this._status[e.data.msg] = ['error', e];
    };
    return await this.dispatch({ msg: 'load' });
  }

  async edgeDetect(
    imageData: ImageBitmap,
    width: number,
    height: number,
    left: number
  ): Promise<{ imgData?: ImageData, rect: RotatedRect }> {
    const msg = {
      msg: "detect-rectangle-around-document",
      payload: { inputImage: imageData, width, height, left },
    };
    this.worker.postMessage(msg);
    return new Promise((resolve) => {
      this.worker.onmessage = ({ data: { msg, img, rect } }) => {
        if (msg === "detect-rectangle-around-document") {
          resolve({ imgData: img, rect });
        }
      }
    });
  }

  async cropAndWarpByPoints(
    inputImage: Uint8ClampedArray,
    rect: RotatedRect,
    width: number,
    height: number,
    ratio: number
  ): Promise<{ imgData: ImageData }> {
    const msg = {
      msg: "crop-and-warp-by-points",
      payload: {
        inputImage,
        rect,
        width,
        height,
        ratio
      }
    };

    this.worker.postMessage(msg);
    return new Promise((resolve) => {
      this.worker.onmessage = ({ data: { msg, img } }) => {
        if (msg === "crop-and-warp-by-points") {
          resolve({ imgData: img });
        }
      }
    });
  }
}
