import {Injectable} from "./global/di/injectable";
import {Dict, Store} from "./global/store";
import Stream = flyd.Stream;

export interface Receipt {
  id: string;
  date: Date;
  total: number;
  imgUrl: string;
}

export interface ReceiptRecord {
  id: string;
  subject: string;
  recordTotal: number;
  category: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Entities {
  receipt: Dict<Receipt['id'], Receipt>;
  receiptRecord: Dict<ReceiptRecord['id'], ReceiptRecord>;
  category: Dict<Category['id'], Category>;
}

@Injectable
export class EntityStore extends Store<Entities> {
  constructor() {
    super({
      receipt: {},
      receiptRecord: {},
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
