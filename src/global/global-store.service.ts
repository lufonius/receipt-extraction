import {Injectable} from "./di/injectable";
import {Dict, Store} from "./store";
import deepmerge from "deepmerge";
import flyd from 'flyd';

@Injectable
export class GlobalStore extends Store<GlobalState> {
  constructor() {
    super({
      receipt: {},
      category: {},
      linkedUId: null
    });
  }

  // Actions
  setLinkedUId = (uid: string) => this.patch((state) => state.linkedUId = uid);

  addReceipt = (receipt: Receipt) => this.patch(state => state.receipt[receipt.id] = receipt);
  updateReceipt = (update: Partial<Receipt>, id: string) => this.patch(state => deepmerge(state.receipt[id], update));

  addCategories = (categories: Category[]) => this.patch(state => state.category = toMap(categories));


  // Selectors
  selectReceipts = () => this.select(state => toArray(state.receipt));
  selectReceipt = (id: string) => this.select(state => state.receipt[id]);
  selectOpenReceipts = () => flyd.map(receipts => receipts.filter(r => r.status === ReceiptExtractionStatus.Open), this.selectReceipts());

  selectCategories = () => this.select(state => toArray(state.category));
}

const toArray = <T>(obj: Dict<string | number, T>): T[] => Object.keys(obj).map(key => obj[key]);
const toMap = <T extends { id: string | number }>(arr: T[]): Dict<string | number, T> => {
  return arr.reduce((acc, curr) => {
    // @ts-ignore
    acc[curr.id] = curr;
    return acc;
  }, {});
};

export enum ReceiptExtractionStatus {
  Open,
  InProgress,
  Done
}

export interface Receipt {
  id: string;
  date: Date;
  total: number;
  imgUrl: string;
  taxes: Tax[];
  items: ReceiptItem[];
  textExtractionResult: TextExtractionResult;
  status: ReceiptExtractionStatus;
}

export interface Tax {
  id: string;
  percentage: number;
  amount: number;
}

export interface Category {
  id: string;
  avatarUrl: string;
  name: string;
  subCategories: string[];
}

export interface ReceiptItem {
  id: string;
  category: Category;
  label: string;
  amount: number;
}

export interface TextExtractionResult {
  angle: number;
  lines: Array<Line>;
}

interface Point { x: number; y: number; }
export interface Line {
  id: string;
  boundingBox: { tl: Point, tr: Point, bl: Point, br: Point };
  text: string;
}

export interface GlobalState {
  receipt: Dict<Receipt['id'], Receipt>;
  category: Dict<Category['id'], Category>;
  linkedUId: string;
}
