import {ReceiptStatus} from "./client";

export interface ReceiptDto {
  id: number;
  status: ReceiptStatusDto;
  imgUrl: string;
  angle?: number;
  total?: number;
  totalLineId?: number;
  date?: Date;
  dateLineId?: number;
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
  type: ReceiptItemType;
  label: string;
  labelLineId: number;
  amount: number;
  amountLineId: number;
  categoryId?: number;
}

export enum ReceiptItemType {
  Tax,
  Category
}