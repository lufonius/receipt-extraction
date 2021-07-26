import {Stage} from "../../common/drawing/stage";
import {Line} from "../../common/drawing/line";
import {Shape} from "../../common/drawing/shape";
import {Circle} from "../../common/drawing/circle";

let counter = 0;

export class DragableRectangle {
  private corners: Array<Corner> = [];
  private sides: Array<Side> = [];

  constructor(
    private stage: Stage,
    corners: { x: number, y: number }[],
    private color: string
  ) {
    this.corners = corners.map(({x, y}) => new Corner(x, y, color));

    const [vertice0, vertice1, vertice2, vertice3] = this.corners;

    this.sides = [
      new Side(vertice0, vertice1, color),
      new Side(vertice1, vertice2, color),
      new Side(vertice2, vertice3, color),
      new Side(vertice3, vertice0, color)
    ];

    this.stage.addLines(this.corners.map(v => v.shape));
    this.stage.addLines(this.sides.map(e => e.shape));
  }

  getRectangle(): { x: number, y: number }[] {
    return this.corners
      .map((vertice) => ({ x: vertice.x, y: vertice.y }));
  }

  clear() {
    this.corners.forEach(it => it.destroy());
    this.sides.forEach(it => it.destroy());
  }
}

class Side {
  private line: Line;

  constructor(
    public corner1: Corner,
    public corner2: Corner,
    private color: string
  ) {
    corner1.sides.push(this);
    corner2.sides.push(this);

    this.line = new Line({
      p1: { x: corner1.initialX, y: corner1.initialY },
      p2: { x: corner2.initialX, y: corner2.initialY },
      strokeColor: 0x000000,
      strokeWidth: 2,
      id: `${counter++}`
    });
  }

  update() {
    this.line.setP1({ x: this.corner1.x, y: this.corner1.y });
    this.line.setP2({ x: this.corner2.x, y: this.corner2.y });
  }

  get shape(): Shape {
    return this.line;
  }

  destroy() {
    this.line.destroy();
  }
}

class Corner {
  private ellipse: Circle;
  public sides: Array<Side> = [];

  constructor(
    public initialX: number,
    public initialY: number,
    private color: string
  ) {
    this.ellipse = new Circle({
      x: initialX,
      y: initialY,
      strokeColor: 0x000000,
      strokeWidth: 2,
      radius: 10,
      draggable: true,
      hitStrokeWidth: 25,
      id: `${counter++}`,
      onMove: () => this.sides.forEach((side) => side.update())
    });
  }

  get x(): number {
    return this.ellipse.x;
  }

  get y(): number {
    return this.ellipse.y;
  }

  destroy() {
    this.ellipse.destroy();
  }

  get shape(): Shape {
    return this.ellipse;
  }
}
