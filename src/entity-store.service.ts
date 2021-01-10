import {Injectable} from "./global/di/injectable";
import {Dict, Store} from "./global/store";
import Stream = flyd.Stream;

export interface Receipt {
  id: string;
  date: Date;
  total: number;
  imgUrl: string;
  taxes: Tax[];
  items: ReceiptItem[];
  textExtractionResult: TextExtractionResult;
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

export interface Entities {
  receipt: Dict<Receipt['id'], Receipt>;
  category: Dict<Category['id'], Category>;
}

@Injectable
export class EntityStore extends Store<Entities> {
  constructor() {
    super({
      receipt: {},
      category: {}
    });
  }

  addReceipt(receipt: Receipt) {
    this.modifyState((state) => {
      state.receipt[receipt.id] = receipt;
    });
  }

  selectReceipts(): Stream<Array<Receipt>> {
    return this.select((state) => Object.keys(state.receipt).map(key => state.receipt[key]));
  }
}
