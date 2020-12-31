import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;

export class DragableRectangle {
  private cornerLayer = new Konva.Layer();
  private lineLayer = new Konva.Layer();

  private vertices: Array<Vertice> = [];
  private edges: Array<Edge> = [];

  constructor(
    private stage: Konva.Stage,
    private corners: { x: number, y: number }[]
  ) {
    this.vertices = corners.map(({ x, y }) => {
      return new Vertice(this.cornerLayer, x, y);
    });

    const [vertice0, vertice1, vertice2, vertice3] = this.vertices;

    this.edges = [
      new Edge(this.lineLayer, vertice0, vertice1),
      new Edge(this.lineLayer, vertice1, vertice2),
      new Edge(this.lineLayer, vertice2, vertice3),
      new Edge(this.lineLayer, vertice3, vertice0)
    ];

    this.stage.add(this.cornerLayer);
    this.stage.add(this.lineLayer);
  }

  getRectangle(): { x: number, y: number }[] {
    return this.vertices
      .map((vertice) => ({ x: vertice.ellipse.x(), y: vertice.ellipse.y() }));
  }
}

class Edge {
  private line: Konva.Line;

  constructor(
    private layer: Konva.Layer,
    public vertice1: Vertice,
    public vertice2: Vertice
  ) {
    vertice1.edges.push(this);
    vertice2.edges.push(this);

    this.line = new Konva.Line({
      points: [vertice1.initialX, vertice1.initialY, vertice2.initialX, vertice2.initialY],
      stroke: "red",
      strokeWidth: 3
    });

    layer.add(this.line);
  }

  update() {
    this.line.points([
      this.vertice1.ellipse.x(),
      this.vertice1.ellipse.y(),
      this.vertice2.ellipse.x(),
      this.vertice2.ellipse.y()
    ]);

    this.layer.batchDraw();
  }
}

class Vertice {
  public ellipse: Konva.Ellipse;
  public edges: Array<Edge> = [];

  constructor(
    private layer: Konva.Layer,
    public initialX: number,
    public initialY: number
  ) {
    this.ellipse = new Konva.Ellipse({
      x: initialX,
      y: initialY,
      fill: "red",
      radiusX: 7,
      radiusY: 7,
      draggable: true
    });

    this.ellipse.on("dragmove", () => {
      this.edges.forEach((edge) => edge.update());
    });

    this.layer.add(this.ellipse);
  }
}
