import type {Mat, OpenCv} from './opencv.d';
declare var cv: OpenCv;

function waitForOpencv(waitTimeMs = 30000, stepTimeMs = 100) {
  return new Promise((resolve, reject) => {
    let timeSpentMs = 0;
    if (!!cv.Mat) resolve();

    setInterval(() => {
      const limitReached = timeSpentMs > waitTimeMs
      if (cv.Mat || limitReached) {
        if (limitReached) {
          reject("loading took too long");
        } else {
          resolve();
        }
      } else {
        timeSpentMs += stepTimeMs
      }
    }, stepTimeMs);
  });
}

function imageDataFromMat(mat: Mat): ImageData {
  // convert the mat type to cv.CV_8U
  const img = new cv.Mat();
  const depth = mat.type() % 8;
  const scale =
    depth <= cv.CV_8S ? 1.0 : depth <= cv.CV_32S ? 1.0 / 256.0 : 255.0;
  const shift = depth === cv.CV_8S || depth === cv.CV_16S ? 128.0 : 0.0;
  mat.convertTo(img, cv.CV_8U, scale, shift);

  // convert the img type to cv.CV_8UC4
  switch (img.type()) {
    case cv.CV_8UC1:
      cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA)
      break
    case cv.CV_8UC3:
      cv.cvtColor(img, img, cv.COLOR_RGB2RGBA)
      break
    case cv.CV_8UC4:
      break
    default:
      throw new Error(
        'Bad number of channels (Source image must have 1, 3 or 4 channels)'
      )
  }
  const imageData = new ImageData(
    new Uint8ClampedArray(img.data),
    img.cols,
    img.rows
  );

  img.delete();

  return imageData;
}

function detectEdges(src: Mat, dst: Mat) {
  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
  cv.GaussianBlur(dst, dst, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
  cv.Canny(dst, dst, 75, 200);
  //cv.Laplacian(dst, dst, cv.CV_8U, 1, 1, 0, cv.BORDER_DEFAULT);
  cv.threshold(dst, dst, 120, 200, cv.THRESH_BINARY);
}

function makePixelsFatter(dst) {
  let M = cv.Mat.ones(1, 1, cv.CV_8U);
  let anchor = new cv.Point(-1, -1);
  cv.dilate(dst, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
}

function detectBiggestContour(dst) {
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(dst, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

  let biggestPerimeter = 0;
  let cnt;
  for (let i = 0; i < contours.size(); i++) {
    let currentPerimeter = cv.arcLength(contours.get(i), true);

    if (currentPerimeter > biggestPerimeter) {
      biggestPerimeter = currentPerimeter;
      cnt = contours.get(i);
    }
  }

  return cnt;
}

function detectRotatedRectAroundContour(contour) {
  return cv.minAreaRect(contour);
}

export async function detectRectangleAroundDocument(
  inputImage: ImageData,
  width: number,
  height: number,
  left: number
): Promise<{ imageWithRectangle: ImageData, rect: { corners:  { x: number, y: number }[]} }> {
  const original = createMatFromImageData(inputImage);

  // scaling the image down gets rid of details
  // we use this to detect the most relevant edges
  // another benefit is that it makes the processing much faster!
  // the width of 600 is just artifical and was determined by experimenting
  const scaledWidth = 600;
  const scaleRatio = inputImage.width / scaledWidth;
  const scaledHeight = inputImage.height / scaleRatio;
  const dst = new cv.Mat();
  const src = createMatFromImageData(inputImage);
  cv.resize(src, dst, new cv.Size(scaledWidth, scaledHeight), 0, 0, cv.INTER_AREA);

  detectEdges(dst, dst);
  makePixelsFatter(dst);
  let biggestContour = detectBiggestContour(dst);
  // sometimes there was no contour detected
  // TODO: check why this is a workaround
  let rectForMessage = null;
  if (!!biggestContour) {

    const perimeter = cv.arcLength(biggestContour, true);
    let approx = new cv.Mat();
    cv.approxPolyDP(biggestContour, approx, .05 * perimeter, true);

    if (approx.rows === 4) {
      rectForMessage = {
        corners: [
          {x: approx.data32S[0], y: approx.data32S[1]},
          {x: approx.data32S[2], y: approx.data32S[3]},
          {x: approx.data32S[4], y: approx.data32S[5]},
          {x: approx.data32S[6], y: approx.data32S[7]}
        ]
      };
    } else {
      let rect = detectRotatedRectAroundContour(biggestContour);
      let vertices = cv.RotatedRect.points(rect);
      rectForMessage = { corners: vertices };
    }

    rectForMessage.corners =
      rectForMessage
        .corners
        .map((point) => ({ x: point.x * scaleRatio, y: point.y * scaleRatio }));
  }

  const imageWithRectangle = imageDataFromMat(original);

  // this is important, otherwise we run into errors after a while ... the whole worker crashes
  dst.delete();
  src.delete();
  original.delete();

  return { imageWithRectangle, rect: rectForMessage };
}

function max(points, calcPrev, calcCurrent) {
  return points.reduce(function(prev, current) {
    return (calcPrev(prev) > calcCurrent(current)) ? prev : current
  });
}

function min(points, calcPrev, calcCurrent) {
  return points.reduce(function(prev, current) {
    return (calcPrev(prev) < calcCurrent(current)) ? prev : current
  });
}

export function makeBlackAndWhite(
  imageData: ImageData,
  height: number,
  width: number
): Promise<ImageData> {
  return new Promise((resolve) => {
    resolve(_makeBlackAndWhite(imageData, height, width));
  });
}

// points have an x and y value from 0 to 1
// indicating the relative position
export function cropAndWarpByPoints(
  inputImage: Uint8ClampedArray,
  rect: { corners: { x: number, y: number }[] },
  width: number,
  height: number,
  ratio: number
): Promise<ImageData> {
  return new Promise((resolve) => {
    resolve(_cropAndWarpByPoints(
      inputImage,
      rect,
      width,
      height,
      ratio
    ));
  });
}

function _cropAndWarpByPoints(
  inputImage: Uint8ClampedArray,
  rect: { corners: { x: number, y: number }[] },
  width: number,
  height: number,
  ratio: number
): ImageData {
  const cropSourceImage = new cv.Mat(height, width, cv.CV_8UC4);
  cropSourceImage.data.set(inputImage);

  // this is the rotated rectangle. we say that we want to "crop" it to a straight rectangle
  const sortedRectCorners = new Array(4);
  sortedRectCorners[0] = min(rect.corners, ({ x, y }) => x + y, ({ x, y }) => x + y);
  sortedRectCorners[2] = max(rect.corners, ({ x, y }) => x + y, ({ x, y }) => x + y);
  sortedRectCorners[1] = min(rect.corners, ({ x, y }) => y - x, ({ x, y }) => y - x);
  sortedRectCorners[3] = max(rect.corners, ({ x, y }) => y - x, ({ x, y }) => y - x);

  const cropSourcePoints = sortedRectCorners.map(point => ({
    x: point.x * ratio,
    y: point.y * ratio
  }));

  const [tl, tr, br, bl] = cropSourcePoints;

  const xDiff1 = tl.x - tr.x;
  const yDiff1 = tl.y - tr.y;
  const calculatedWidth =  Math.sqrt(xDiff1*xDiff1 + yDiff1*yDiff1);

  const xDiff2 = tr.x - br.x;
  const yDiff2 = tr.y - br.y;
  const calculatedHeight =  Math.sqrt(xDiff2*xDiff2 + yDiff2*yDiff2);

  const cropDestinationPoints = [
    0, 0,
    calculatedWidth - 1, 0,
    calculatedWidth - 1, calculatedHeight - 1,
    0, calculatedHeight - 1
  ];

  const cropSourcePointsFlat = [
    tl.x, tl.y,
    tr.x, tr.y,
    br.x, br.y,
    bl.x, bl.y
  ];

  let dst = new cv.Mat();
  let dsize = new cv.Size(calculatedWidth, calculatedHeight);
  const M = cv.getPerspectiveTransform(cv.matFromArray(4, 1, cv.CV_32FC2, cropSourcePointsFlat), cv.matFromArray(4, 1, cv.CV_32FC2, cropDestinationPoints));
  cv.warpPerspective(cropSourceImage, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

  // cv.cvtColor(dst, dst, cv.COLOR_RGBA2GRAY);

  if (dst.cols > dst.rows) {
    cv.rotate(dst, dst, cv.ROTATE_90_CLOCKWISE)
  }

  const imageData = imageDataFromMat(dst);

  cropSourceImage.delete();
  dst.delete();

  return imageData;
}

function _makeBlackAndWhite(
  imageData: ImageData,
  height: number,
  width: number
): ImageData {
  const image = createMatFromImageData(imageData);

  cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY);

  const blackAndWhiteImageData = imageDataFromMat(image);
  image.delete();

  return blackAndWhiteImageData;
}

export async function rotate90DegClockwise(image: ImageData): Promise<ImageData> {
  return new Promise((resolve) => {
    const src = createMatFromImageData(image);
    const dst = new cv.Mat();

    cv.rotate(src, dst, cv.ROTATE_90_CLOCKWISE);

    const rotatedImage = imageDataFromMat(dst);
    dst.delete();
    src.delete();

    resolve(rotatedImage);
  });
}

function createMatFromImageData(src: ImageData): Mat {
  const dst = new cv.Mat(src.height, src.width, cv.CV_8UC4);
  dst.data.set(src.data);

  return dst;
}

export async function load() {
  // @ts-ignore
  self.importScripts('../lib/opencv.js');
  await waitForOpencv();
}
