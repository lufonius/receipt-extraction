export interface Receipt {
  id: number;
  status: ReceiptStatus;
  imgUrl: string;
  angle?: number;
  transactionTotal?: number;
  transactionDate?: Date;
  lines: Line[];
  items: ReceiptItem[];
}

export interface ReceiptItem {
  id: number;
  receiptId: number;
  label: string;
  labelLineId: number;
  price?: number;
  valueLineId?: number;
  categoryId?: number;
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
  avatarUrl: string;
  color: number;
  name: string;
  deleted: boolean;
}
