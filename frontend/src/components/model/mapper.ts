import {Injectable} from "../../global/di/injectable";
import {ReceiptDto, ReceiptItemDto, ReceiptItemTypeDto, ReceiptStatusDto} from "./dto";
import {Receipt, ReceiptItem, ReceiptItemType, ReceiptStatus} from "./client";
import {cloneDeep} from "./cloneDeep";

@Injectable
export class Mapper {
  receiptFromDto(receiptDto: ReceiptDto): Receipt {
    return cloneDeep<ReceiptDto, Receipt>(
      receiptDto,
      {
        ".status": (status: ReceiptStatusDto) => ReceiptStatus[status],
        ".items.type": (type: ReceiptItemTypeDto) => ReceiptItemType[type]
      }
    );
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
