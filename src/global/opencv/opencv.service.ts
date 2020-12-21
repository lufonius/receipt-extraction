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

  setCanvas(canvas: OffscreenCanvas) {
    const msg = {
      msg: "set-canvas",
      payload: { inputImage: canvas },
    };

    this.worker.postMessage(msg, [canvas]);
  }

  async edgeDetect(
    imageData: ImageBitmap,
    width: number,
    height: number,
    left: number
  ): Promise<{ imgData?: Uint8ClampedArray, rect: RotatedRect }> {
    const msg = {
      msg: "detect-rectangle-around-document",
      payload: { inputImage: imageData, width, height, left },
    };
    this.worker.postMessage(msg);
    return new Promise((resolve) => {
      this.worker.onmessage = ({ data: { msg, img, rect } }) => {
        if (msg === "detect-rectangle-around-document") {
          resolve({ imgData: img?.data, rect });
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

  // canny() {}
  //
  // gaussianBlur() {}
  //
  // cvtColor() {}
  //
  // threshold() {}
  //
  // findBoundingRect() {}

  // processVideo(
  //   context: CanvasRenderingContext2D,
  //   video: HTMLVideoElement
  // ) {
  //   const height = video.height;
  //   let src = new cv.Mat(height, width, cv.CV_8UC4);
  //   let dst = new cv.Mat(height, width, cv.CV_8UC1);
  //
  //   let begin = Date.now();
  //   context.drawImage(video, 0, 0, video.width, video.height);
  //   src.data.set(context.getImageData(0, 0, width, height).data);
  //   cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  //   cv.imshow("canvasOutput", dst); // canvasOutput is the id of another <canvas>;
  //   // schedule next one.
  //   let delay = 1000/FPS - (Date.now() - begin);
  //   setTimeout(processVideo, delay);
  // }
}
