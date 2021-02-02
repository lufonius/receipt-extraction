import { Component, Host, h } from '@stencil/core';
import {Inject} from "../../../global/di/inject";
import {AnalyzeResult, OcrService} from "./ocr.service";
import Konva from "konva";
import {makeStagePinchZoomable} from "../../common/canvas/make-stage-pinch-zoomable";

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

    makeStagePinchZoomable(this.stage);
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
