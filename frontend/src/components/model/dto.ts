export interface ReceiptDto {
  id: number;
  status: ReceiptStatusDto;
  imgUrl: string;
  angle?: number;
  transactionTotal?: number,
  uploadedAt: string,
  // the date is being serialized
  transactionDate?: string,
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
  label?: string;
  labelLineId?: number;
  price?: number;
  valueLineId?: number;
  categoryId?: number;
}

export interface CategoryDto {
  id: number;
  avatarUrl: string;
  color: number;
  name: string;
  deleted: boolean;
}

export interface UserSettingsDto {
  hideAddToHomeScreen: boolean;
}
