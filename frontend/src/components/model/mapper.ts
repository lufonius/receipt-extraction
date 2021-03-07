import {Injectable} from "../../global/di/injectable";
import {ReceiptDto, ReceiptItemTypeDto, ReceiptStatusDto} from "./dto";
import {Receipt, ReceiptItemType, ReceiptStatus} from "./client";
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
}
