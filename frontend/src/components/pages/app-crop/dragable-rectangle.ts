import {Stage} from "../../common/drawing/stage";
import {Line} from "../../common/drawing/line";
import {PixiShape} from "../../common/drawing/pixiShape";
import {Circle} from "../../common/drawing/circle";

let counter = 0;

export class DragableRectangle {
  private vertices: Array<Vertice> = [];
  private edges: Array<Edge> = [];

  constructor(
    private stage: Stage,
    private corners: { x: number, y: number }[],
    private color: string
  ) {
    this.vertices = corners.map(({x, y}) => {
      return new Vertice(x, y, color);
    });

    const [vertice0, vertice1, vertice2, vertice3] = this.vertices;

    this.edges = [
      new Edge(vertice0, vertice1, color),
      new Edge(vertice1, vertice2, color),
      new Edge(vertice2, vertice3, color),
      new Edge(vertice3, vertice0, color)
    ];

    this.stage.addShapes(this.edges.map(e => e.shape));
    this.stage.addShapes(this.vertices.map(v => v.shape));
  }

  getRectangle(): { x: number, y: number }[] {
    return this.vertices
      .map((vertice) => ({ x: vertice.x, y: vertice.y }));
  }

  clear() {
    // TODO: implement
  }
}

class Edge {
  private line: Line;

  constructor(
    public vertice1: Vertice,
    public vertice2: Vertice,
    private color: string
  ) {
    vertice1.edges.push(this);
    vertice2.edges.push(this);

    this.line = new Line({
      p1: { x: vertice1.initialX, y: vertice1.initialY },
      p2: { x: vertice2.initialX, y: vertice2.initialY },
      strokeColor: color,
      strokeWidth: 2,
      id: `${counter++}`
    });
  }

  update() {
    this.line.setP1({ x: this.vertice1.x, y: this.vertice1.y });
    this.line.setP2({ x: this.vertice2.x, y: this.vertice2.y });
  }

  get shape(): PixiShape {
    return this.line;
  }
}

class Vertice {
  private ellipse: Circle;
  public edges: Array<Edge> = [];

  constructor(
    public initialX: number,
    public initialY: number,
    private color: string
  ) {
    this.ellipse = new Circle({
      x: initialX,
      y: initialY,
      strokeColor: color,
      strokeWidth: 2,
      radiusX: 10,
      radiusY: 10,
      draggable: true,
      hitStrokeWidth: 25,
      id: `${counter++}`
    });

    this.ellipse.onDragMove(() => {
      this.edges.forEach((edge) => edge.update());
    });
  }

  get x(): number {
    return this.ellipse.x;
  }

  get y(): number {
    return this.ellipse.y;
  }

  get shape(): PixiShape {
    return this.ellipse;
  }
}
