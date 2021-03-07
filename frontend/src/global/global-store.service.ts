import {Injectable} from "./di/injectable";
import {Dict, Patch, Store} from "./store";
import {Receipt, ReceiptItem} from "../components/model/client";
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

  addReceiptItemOfCurrentReceipt = (receiptItem: ReceiptItem) => this.patch(state => {
    state.currentReceipt.items.push(receiptItem);
  });

  // Selectors
  selectCurrentReceipt = () => this.select(state => state.currentReceipt);
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
