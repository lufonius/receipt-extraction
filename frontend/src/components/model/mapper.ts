import {Injectable} from "../../global/di/injectable";
import {ReceiptDto, ReceiptItemDto, ReceiptItemTypeDto, ReceiptStatusDto} from "./dto";
import {Receipt, ReceiptItem, ReceiptItemType, ReceiptStatus} from "./client";
import {cloneDeep} from "./cloneDeep";

@Injectable
export class Mapper {
  receiptFromDto(receiptDto: ReceiptDto): Receipt {
    const cloned = cloneDeep<ReceiptDto, Receipt>(
      receiptDto,
      {
        ".status": (status: ReceiptStatusDto) => ReceiptStatus[status],
        ".items.type": (type: ReceiptItemTypeDto) => ReceiptItemType[type]
      }
    );

    cloned.lines.forEach((it) => {
      it.isLinked = cloned.items.some((item) => item.valueLineId === it.id || item.labelLineId === it.id);
      console.log(cloned.items);
    });

    return cloned;
  }

  receiptItemFromDto(receiptItemDto: ReceiptItemDto): ReceiptItem {
    return cloneDeep<ReceiptItemDto, ReceiptItem>(
      receiptItemDto,
      {
        ".type": (type: ReceiptItemTypeDto) => ReceiptItemType[type]
      }
    )
  }

  dtoFromReceiptItem(receiptItem: ReceiptItem): ReceiptItemDto {
    return cloneDeep<ReceiptItem, ReceiptItemDto>(
      receiptItem,
      {
        ".type": (type: ReceiptItemType) => ReceiptItemTypeDto[type]
      }
    )
  }
}
