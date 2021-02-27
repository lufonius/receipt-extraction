import {Injectable} from "../../global/di/injectable";
import {ReceiptDto, ReceiptStatusDto} from "./dto";
import {Receipt, ReceiptStatus} from "./client";
import {cloneDeep} from "./cloneDeep";

@Injectable
export class Mapper {
  receiptFromDto(receiptDto: ReceiptDto): Receipt {
    return cloneDeep<ReceiptDto, Receipt>(
      receiptDto,
      {
        ".status": (status: ReceiptStatusDto) => ReceiptStatus[status]
      }
    );
  }
}
