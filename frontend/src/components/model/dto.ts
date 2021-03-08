export interface ReceiptDto {
  id: number;
  status: ReceiptStatusDto;
  imgUrl: string;
  angle?: number;
  lines: LineDto[];
  items: ReceiptItemDto[];
}

export interface ReceiptListElementDto {
  id: number;
  status: ReceiptStatusDto;
}

export interface LineDto {
  id: number;
  receiptId: number;
  topLeft: PointDto;
  topRight: PointDto;
  bottomRight: PointDto;
  bottomLeft: PointDto;
  text: String;
}

export class PointDto {
  id: number;
  x: number;
  y: number;
}

export enum ReceiptStatusDto {
  Uploaded = "Uploaded",
  Open = "Open",
  InProgress = "InProgress",
  Done = "Done"
}

export class ReceiptItemDto {
  id: number;
  receiptId: number;
  type: ReceiptItemTypeDto;
  label?: string;
  labelLineId?: number;
  value?: number;
  valueLineId?: number;
  categoryId?: number;
}

export enum ReceiptItemTypeDto {
  Tax = "Tax",
  Category = "Category",
  Total = "Total",
  Date = "Date"
}
