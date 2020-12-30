export declare type MatType = number;

export declare type Mat = {
  new(): Mat;
  new(rows: number, cols: number, type: MatType): Mat;
  ones(rows: number, cols: number, type: MatType): Mat;
  cols: number;
  rows: number;
  delete(): void;
  type(): number;
  convertTo(output: Mat, rtype: number, alpha: number, beta: number): Mat;

  data32S: Array<number>;
  data: Uint8ClampedArray;
}

export declare type MatVector = {
  new(): MatVector;
  size(): number;
  get(index: number): Mat;
};

export declare type Point = {
  new(x: number, y: number): Mat;
}

export declare type Size = {
  new(width: number, height: number): Size;
};

export declare type Rectangle = {

};

export declare type RotatedRect = {
  new(): RotatedRect;
  points(rectangle: Rectangle): RotatedRect;
} & [Point, Point, Point, Point];

export declare type Scalar = {
  new (): Scalar;
};

export declare class OpenCv {
  CV_8U: MatType;
  CV_32FC2: MatType;
  CV_8UC4: MatType;
  CV_8UC1: MatType;
  CV_8S: MatType;
  CV_32S: MatType;
  CV_16S: MatType;

  // TODO: maybe separate type?
  COLOR_RGBA2GRAY: MatType;
  BORDER_DEFAULT: MatType;
  THRESH_BINARY: MatType;
  BORDER_CONSTANT: MatType;
  RETR_CCOMP: MatType;
  CHAIN_APPROX_SIMPLE: MatType;
  COLOR_GRAY2RGBA: MatType;
  CV_8UC3: MatType;
  COLOR_RGB2RGBA: MatType;
  LINE_AA: MatType;
  ROTATE_90_CLOCKWISE: MatType;
  INTER_LINEAR: MatType;

  Mat: Mat;
  MatVector: MatVector;
  Point: Point;
  Size: Size;
  Scalar: Scalar;
  RotatedRect: RotatedRect;

  matFromArray(rows: number, cols: number, type: MatType, array: Array<number>): Mat;

  // TODO: return value?
  morphologyDefaultBorderValue();

  GaussianBlur(src: Mat, dst: Mat, ksize, sigmaX, sigmaY, borderType);

  Canny(src: Mat, dst: Mat, threshold1, threshold2);

  Laplacian(src: Mat, dst: Mat, ddepth, ksize, scale, delta, borderType);

  threshold(src: Mat, dst: Mat, thresh, maxVal, type);

  line(src: Mat, point1, point2, rgba, thickness, lineType, shift);

  dilate(src: Mat, dst: Mat, kernel, anchor, iterations, borderType, scalar);

  findContours(src: Mat, dst: MatVector, hierarchy, mode, method);

  arcLength(contour: Mat, closed);

  minAreaRect(contour: Mat): Rectangle;

  approxPolyDP(curve, approxCurve, epsilon, closed);

  cvtColor(src: Mat, dst: Mat, mode);

  getPerspectiveTransform(src: Mat, dst: Mat);

  warpPerspective(src: Mat, dst: Mat, matrix, dsize, flags, borderMode, scalar);

  rotate(src: Mat, dst: Mat, angle);
}
