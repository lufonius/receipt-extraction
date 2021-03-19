import {Injectable} from "./di/injectable";
import {Dict} from "./store";
import {Line, Receipt, ReceiptItem, ReceiptItemType} from "../components/model/client";
import {LocalstorageStore} from "./localstorage-store";

@Injectable
export class GlobalStore extends LocalstorageStore<GlobalState> {
  constructor() {
    super({
      currentReceipt: null,
      linkedUId: null
    });
  }
  setCurrentReceipt = (receipt: Receipt) => this.patch(state => { state.currentReceipt = receipt });

  deleteReceiptItemOfCurrentReceipt = (id: number) => this.patch(state => {
    const index = state.currentReceipt.items.findIndex(it => it.id === id);
    state.currentReceipt.items.splice(index, 1);
  });

  updateReceiptItemOfCurrentReceipt = (id: number, changes: Partial<ReceiptItem>) => this.patch(state => {
    const index = state.currentReceipt.items.findIndex(it => it.id === id);
    const item = state.currentReceipt.items[index];

    state.currentReceipt.items[index] = {
      ...item,
      ...changes
    };
  });

  addReceiptItemOfCurrentReceipt = (receiptItem: ReceiptItem) => this.patch(state => {
    state.currentReceipt.items.push(receiptItem);
  });

  updateLine = (id: number, changes: Partial<Line>) => this.patch(state => {
    const index = state.currentReceipt.lines.findIndex(it => it.id === id);
    const line = state.currentReceipt.lines[index];

    state.currentReceipt.lines[index] = {
      ...line,
      ...changes
    };
  });

  // Selectors
  selectCurrentReceipt = () => this.select(state => state.currentReceipt);

  selectTotalOfCurrentReceipt = () => {
    return this.select(state => {
      return state.currentReceipt.items
        .find(it => it.type === ReceiptItemType.Total);
    });
  }

  selectDateOfCurrentReceipt = () => {
    return this.select(state => {
      return state.currentReceipt.items
        .find(it => it.type === ReceiptItemType.Date);
    });
  }

  selectTaxesOfCurrentReceipt = () => {
    return this.select(state => {
      return state.currentReceipt.items.filter(it => it.type === ReceiptItemType.Tax);
    });
  }

  selectCategoryItemsOfCurrentReceipt = () => {
    return this.select(state => {
      return state.currentReceipt.items.filter(it => it.type === ReceiptItemType.Category);
    });
  }

  selectHasCurrentReceiptAnyItems = () => {
    return this.select(state => state.currentReceipt.items.length > 0);
  };
}

const toArray = <T>(obj: Dict<string | number, T>): T[] => Object.keys(obj).map(key => obj[key]);
const toMap = <T extends { id: string | number }>(arr: T[]): Dict<string | number, T> => {
  return arr.reduce((acc, curr) => {
    // @ts-ignore
    acc[curr.id] = curr;
    return acc;
  }, {});
};

export interface GlobalState {
  currentReceipt: Receipt;
  linkedUId: string;
}
