import {Injectable} from "./di/injectable";
import {Category, Line, Receipt, ReceiptItem} from "../components/model/client";
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
  deleteCategory = (id: number) => this.patch(state => {
    const index = state.categories.map(it => it.id).indexOf(id);
    if (index !== -1) {
      state.categories.splice(index, 1);
    }
  });
  updateCategory = (category: Category) => this.patch(state => {
    const index = state.categories.map(it => it.id).indexOf(category.id);
    state.categories[index] = category;
  });
  addCategory = (category: Category) => this.patch(state => state.categories.push(category));

  // Selectors
  selectCurrentReceipt = () => this.select(state => state.currentReceipt);
  selectCurrentReceiptImgUrl = () => this.select(state => state.currentReceipt.imgUrl);
  selectCurrentReceiptLines = () => this.select(state => state.currentReceipt.lines);

  selectTotalOfCurrentReceipt = () => this.select(state => state.currentReceipt.transactionTotal);

  selectDateOfCurrentReceipt = () => this.select(state => state.currentReceipt.transactionDate);

  selectCategoryItemsOfCurrentReceipt = () => this.select(state => state.currentReceipt.items);

  selectHasCurrentReceiptAnyItems = () => {
    return this.select(state => state.currentReceipt.items.length > 0);
  };

  selectCategories = (includeDeleted: boolean = true) => {
    return this.select(state => state.categories.filter(it => includeDeleted ? true : it.deleted === false));
  };
  selectCategoriesById = () => this.select(state => new Map<number, Category>(state.categories.map(it => [it.id, it])));
}


export interface GlobalState {
  currentReceipt: Receipt;
  categories: Category[];
  linkedUId: string;
}
