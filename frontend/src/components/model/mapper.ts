import {Injectable} from "../../global/di/injectable";
import {CategoryDto, ReceiptDto, ReceiptItemDto, ReceiptStatusDto} from "./dto";
import {Category, Line, Receipt, ReceiptItem, ReceiptStatus} from "./client";
import {cloneDeep} from "./cloneDeep";
import { arrayToDict } from './array-to-dict';
import { dictToArray } from './dict-to-array';

@Injectable
export class Mapper {
  receiptFromDto(receiptDto: ReceiptDto, categories: Category[]): Receipt {
    const clonedReceiptItem = cloneDeep<ReceiptDto, Receipt>(
      receiptDto,
      {
        ".status": (status: ReceiptStatusDto) => ReceiptStatus[status]
      }
    );

    // TODO: consider moving this to the backend
    const lineDict = arrayToDict(clonedReceiptItem.lines, "id");
    const categoryDict = arrayToDict(categories, "id");

    for (const key in lineDict) {
      const line = lineDict[key];
      line.color = 0x696969;
    }

    for (const item of clonedReceiptItem.items) {
      const category = categoryDict[item.categoryId];
      const valueLine = lineDict[item.valueLineId];
      const labelLine = lineDict[item.labelLineId];

      this.setColorOfLineIfReferenced(valueLine, category);
      this.setColorOfLineIfReferenced(labelLine, category);
    }

    clonedReceiptItem.lines = dictToArray(lineDict);

    return clonedReceiptItem;
  }

  private setColorOfLineIfReferenced(
    line: Line,
    category: CategoryDto
  ) {
    if (line && category) {
      line.color = category.color;
    } else if (line && !category) {
      // line is in use, but not for categories (total and date)
      line.color = 0x03b700;
    }
  }

  receiptItemFromDto(receiptItemDto: ReceiptItemDto): ReceiptItem {
    return cloneDeep<ReceiptItemDto, ReceiptItem>(receiptItemDto)
  }

  dtoFromReceiptItem(receiptItem: ReceiptItem): ReceiptItemDto {
    return cloneDeep<ReceiptItem, ReceiptItemDto>(receiptItem)
  }
}
