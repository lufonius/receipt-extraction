export interface Receipt {
  id: number;
  status: ReceiptStatus;
  imgUrl: string;
  angle?: number;
  total?: number;
  totalLineId?: number;
  date?: Date;
  dateLineId?: number;
  lines: Line[];
  items: ReceiptItem[];
}

export interface ReceiptItem {
  id: number;
  receiptId: number;
  label: string;
  labelLineId: number;
  amount: number;
  type: ReceiptItemType;
  amountLineId: number;
  categoryId?: number;
}

export enum ReceiptItemType {
  Category = "Category",
  Tax = "Tax"
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
  text: String;
}

export interface Point {
  id: number;
  x: number;
  y: number;
}
