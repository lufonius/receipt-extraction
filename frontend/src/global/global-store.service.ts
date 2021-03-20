import {Injectable} from "./di/injectable";
import {Category, Line, Receipt, ReceiptItem, ReceiptItemType} from "../components/model/client";
import {LocalstorageStore} from "./localstorage-store";

@Injectable
export class GlobalStore extends LocalstorageStore<GlobalState> {
  constructor() {
    super({
      currentReceipt: null,
      categories: [],
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

  setCategories = (categories: Category[]) => this.patch(state => state.categories = categories);

  // Selectors
  selectCurrentReceipt = () => this.select(state => state.currentReceipt);
  selectCurrentReceiptImgUrl = () => this.select(state => state.currentReceipt.imgUrl);
  selectCurrentReceiptLines = () => this.select(state => state.currentReceipt.lines);

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

  selectCategories = () => this.select(state => state.categories);
}


export interface GlobalState {
  currentReceipt: Receipt;
  categories: Category[];
  linkedUId: string;
}
