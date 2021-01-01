import Konva from "konva";
import flyd from 'flyd';
import mergeAll from 'flyd/module/mergeall';
import Stream = flyd.Stream;

let counter = 0;

export class DragableRectangle {
  private cornerLayer = new Konva.Layer();
  private lineLayer = new Konva.Layer();

  private vertices: Array<Vertice> = [];
  private edges: Array<Edge> = [];

  public dragStart: Stream<void> = flyd.stream();
  public dragEnd: Stream<void> = flyd.stream();
  public dragMove: Stream<{ x: number, y: number }> = flyd.stream();

  private magnifierScale = 1.5;

  constructor(
    private stage: Konva.Stage,
    private magnifiedStage: Konva.Stage,
    private corners: { x: number, y: number }[]
  ) {
    this.vertices = corners.map(({ x, y }) => {
      return new Vertice(x, y);
    });

    const [vertice0, vertice1, vertice2, vertice3] = this.vertices;

    this.edges = [
      new Edge(vertice0, vertice1),
      new Edge(vertice1, vertice2),
      new Edge(vertice2, vertice3),
      new Edge(vertice3, vertice0)
    ];

    this.lineLayer.add(...this.edges.map(e => e.line));
    this.cornerLayer.add(...this.vertices.map(v => v.ellipse));

    this.dragStart = mergeAll(this.vertices.map(v => v.dragStart));
    this.dragEnd = mergeAll(this.vertices.map(v => v.dragEnd));
    this.dragMove = mergeAll(this.vertices.map(v => v.dragMove));

    // when we drag around corners, we draw the magnified stage
    flyd.on(v => {
      this.stage.batchDraw();
      this.updateOffsetOfMagnifiedStage(v);
    }, this.dragMove);

    this.stage.add(this.cornerLayer);
    this.stage.add(this.lineLayer);

    this.stage.getLayers().toArray().map(l => {
      this.magnifiedStage.scale({ x: this.magnifierScale, y: this.magnifierScale });
      this.magnifiedStage.add(l.clone({ listening: false }));
    });
  }

  updateOffsetOfMagnifiedStage({ x, y }) {
    const halfMagnifiedStageWidth = this.magnifiedStage.width() / 2;
    const halfMagnifiedStageHeight = this.magnifiedStage.height() / 2;
    const offsetX = (x - (halfMagnifiedStageWidth / this.magnifierScale));
    const offsetY = (y - (halfMagnifiedStageHeight / this.magnifierScale));

    this.magnifiedStage.offsetX(offsetX);
    this.magnifiedStage.offsetY(offsetY);
    this.updateMagnified();
    this.magnifiedStage.batchDraw();
  }

  updateMagnified() {
    this.stage.getLayers().toArray().forEach(l => {
      l.children.toArray().forEach((shape) => {
        for (const mNode of this.magnifiedStage.getLayers().toArray()) {
          const ml = mNode as Konva.Layer;
          const clone: Konva.Shape = ml.findOne("." + shape.name());
          if (clone) {

            if (this.isLine(clone)) {
              clone.points(shape.points());
              ml.batchDraw();
              break;
            }

            if (this.isEllipse(clone)) {
              clone.position(shape.position());
              ml.batchDraw();
              break;
            }
          }
        }
      });
    });
  }

  isLine(shape: any): shape is Konva.Line {
    return shape instanceof Konva.Line;
  }

  isEllipse(shape: any): shape is Konva.Ellipse {
    return shape instanceof Konva.Ellipse;
  }

  getRectangle(): { x: number, y: number }[] {
    return this.vertices
      .map((vertice) => ({ x: vertice.ellipse.x(), y: vertice.ellipse.y() }));
  }
}

class Edge {
  public line: Konva.Line;

  constructor(
    public vertice1: Vertice,
    public vertice2: Vertice
  ) {
    vertice1.edges.push(this);
    vertice2.edges.push(this);

    this.line = new Konva.Line({
      points: [vertice1.initialX, vertice1.initialY, vertice2.initialX, vertice2.initialY],
      stroke: "#5851ff",
      strokeWidth: 2,
      name: `${counter++}`
    });
  }

  update() {
    this.line.points([
      this.vertice1.ellipse.x(),
      this.vertice1.ellipse.y(),
      this.vertice2.ellipse.x(),
      this.vertice2.ellipse.y()
    ]);
  }
}

class Vertice {
  public ellipse: Konva.Ellipse;
  public edges: Array<Edge> = [];
  public dragStart: Stream<void> = flyd.stream();
  public dragEnd: Stream<void> = flyd.stream();
  public dragMove: Stream<{ x: number, y: number }> = flyd.stream();

  constructor(
    public initialX: number,
    public initialY: number
  ) {
    this.ellipse = new Konva.Ellipse({
      x: initialX,
      y: initialY,
      stroke: "#5851ff",
      strokeWidth: 2,
      radiusX: 10,
      radiusY: 10,
      draggable: true,
      hitStrokeWidth: 25,
      name: `${counter++}`
    });

    this.ellipse.on("dragstart", () => {
      this.dragStart(null);
    });
    this.ellipse.on("dragend", () => this.dragEnd(null));

    this.ellipse.on("dragmove", () => {
      this.edges.forEach((edge) => edge.update());
      this.dragMove({ x: this.ellipse.x(), y: this.ellipse.y() });
    });
  }
}
