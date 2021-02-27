import {Injectable} from "./di/injectable";
import {Dict, Store} from "./store";
import deepmerge from "deepmerge";
import flyd from 'flyd';
import {Receipt, ReceiptListItem, ReceiptStatus} from "../components/model/client";

@Injectable
export class GlobalStore extends Store<GlobalState> {
  constructor() {
    super({
      currentReceipt: null,
      receiptsByStatus: {},
      linkedUId: null
    });
  }
  setCurrentReceipt = (receipt: Receipt) => this.patch(state => { state.currentReceipt = receipt });

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
  receiptsByStatus: Dict<ReceiptStatus, ReceiptListItem[]>;
  linkedUId: string;
}
