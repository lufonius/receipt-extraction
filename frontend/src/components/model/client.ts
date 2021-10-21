export interface Receipt {
  id: number;
  status: ReceiptStatus;
  imgUrl: string;
  angle?: number;
  lines: Line[];
  items: ReceiptItem[];
}

export interface ReceiptItem {
  id: number;
  receiptId: number;
  type: ReceiptItemType;
  label: string;
  labelLineId: number;
  value?: string;
  valueLineId?: number;
  categoryId?: number;
}

export enum ReceiptItemType {
  Category = "Category",
  Tax = "Tax",
  Total = "Total",
  Date = "Date"
}

export enum ReceiptStatus {
  Uploaded = "Uploaded",
  Open = "Open",
  InProgress = "InProgress",
  Done = "Done"
}

export interface Line {
  id: number;
  receiptId: number;
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
  text: string;
  isLinked: boolean;
  color: number;
}

export interface Point {
  id: number;
  x: number;
  y: number;
}

export interface Category {
  id: number;
  avatar_url: string;
  color: number;
  name: string;
  deleted: boolean;
}
