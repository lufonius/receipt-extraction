import { Component, Host, h } from '@stencil/core';
import {Inject} from "../../../global/di/inject";
import {AnalyzeResult, OcrService} from "./ocr.service";
import Konva from "konva";

@Component({
  tag: 'app-receipt-extraction',
  styleUrl: 'app-receipt-extraction.css',
  shadow: true,
})
export class AppReceiptExtraction {

  @Inject(OcrService) private ocrService: OcrService;

  private canvas: HTMLDivElement;
  private stage: Konva.Stage;

  private analyzeResult: AnalyzeResult;

  componentDidLoad() {
    this.setupStage();
    this.setStagePinchZoomable();
    this.drawImage();
    this.detectText();
  }

  private setupStage() {
    Konva.hitOnDragEnabled = true;

    this.stage = new Konva.Stage({
      container: this.canvas,
      width: innerWidth,
      height: innerHeight,
      draggable: true
    });
  }

  private setStagePinchZoomable() {
    function getDistance(p1, p2) {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    function getCenter(p1, p2) {
      return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      };
    }
    var lastCenter = null;
    var lastDist = 0;

    this.stage.on('touchmove', (e) => {
      e.evt.preventDefault();
      var touch1 = e.evt.touches[0];
      var touch2 = e.evt.touches[1];

      if (touch1 && touch2) {
        // if the stage was under Konva's drag&drop
        // we need to stop it, and implement our own pan logic with two pointers
        if (this.stage.isDragging()) {
          this.stage.stopDrag();
        }

        var p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        };
        var p2 = {
          x: touch2.clientX,
          y: touch2.clientY,
        };

        if (!lastCenter) {
          lastCenter = getCenter(p1, p2);
          return;
        }
        var newCenter = getCenter(p1, p2);

        var dist = getDistance(p1, p2);

        if (!lastDist) {
          lastDist = dist;
        }

        // local coordinates of center point
        var pointTo = {
          x: (newCenter.x - this.stage.x()) / this.stage.scaleX(),
          y: (newCenter.y - this.stage.y()) / this.stage.scaleX(),
        };

        var scale = this.stage.scaleX() * (dist / lastDist);

        this.stage.scaleX(scale);
        this.stage.scaleY(scale);

        // calculate new position of the stage
        var dx = newCenter.x - lastCenter.x;
        var dy = newCenter.y - lastCenter.y;

        var newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        };

        this.stage.position(newPos);
        this.stage.batchDraw();

        lastDist = dist;
        lastCenter = newCenter;
      }
    });

    this.stage.on('touchend', function () {
      lastDist = 0;
      lastCenter = null;
    });
  }

  drawImage() {
    const layer = new Konva.Layer();
    Konva.Image.fromURL("https://firebasestorage.googleapis.com/v0/b/foenschi.appspot.com/o/receipt_hm.png?alt=media&token=41d77222-5c1c-41ff-83f5-078491882f08", (img) => {
      layer.add(img);
      this.stage.add(layer);
      this.stage.batchDraw();
    });
  }

  async detectText() {
    const result = await this.ocrService.detectText("https://firebasestorage.googleapis.com/v0/b/foenschi.appspot.com/o/receipt_hm.png?alt=media&token=41d77222-5c1c-41ff-83f5-078491882f08");
    this.analyzeResult = result;

    const layer = new Konva.Layer();
    result.analyzeResult.readResults.forEach(result => {
      result.lines.forEach(line => {
        const width = line.boundingBox[2] - line.boundingBox[0];
        const height = line.boundingBox[5] - line.boundingBox[1];

        const box = new Konva.Rect({
          x: line.boundingBox[0],
          y: line.boundingBox[1],
          width,
          height,
          strokeWidth: 3,
          stroke: "red",
          id: line.id
        });

        box.on("click", (e) => {
          alert("clicked box with text: " + this.getById(e.target.id()));
        });

        box.on("tap", (e) => {
          alert("clicked box with text: " + this.getById(e.target.id()));
        });

        layer.add(box);
      });
    });

    this.stage.add(layer);
    this.stage.batchDraw();
  }

  private getById(id: string): string {
    let line = null;
    this.analyzeResult.analyzeResult.readResults.forEach(result => {
        line = result.lines.filter(line => line.id === id)[0].text;
    });

    return line;
  }

  render() {
    return (
      <Host>
        <div ref={el => this.canvas = el} />
        <button onClick={() => this.detectText()}>detect text</button>
      </Host>
    );
  }
}
