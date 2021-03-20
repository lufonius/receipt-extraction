import {Injectable} from "../../../global/di/injectable";
import {ReceiptItemDto} from "../../model/dto";

@Injectable
export class ReceiptItemService {
  private baseApiUrl: string = "http://localhost:8080/api"

  async deleteReceiptItem(id: number): Promise<void> {
    const response = await fetch(`${this.baseApiUrl}/receipt/item/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      console.error("request failed. response: ", response);
      throw Error("initializing the receipt did not work");
    }
  }

  async createReceiptItem(receiptItemDto: ReceiptItemDto): Promise<ReceiptItemDto> {
    const response = await fetch(`${this.baseApiUrl}/receipt/item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receiptItemDto)
    });

    if (!response.ok) {
      console.error("request failed. response: ", response);
      throw Error("initializing the receipt did not work");
    }

    return response.json();
  }

  async updateReceiptItem(id: number, receiptItemDto: ReceiptItemDto): Promise<ReceiptItemDto> {
    const response = await fetch(`${this.baseApiUrl}/receipt/item/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receiptItemDto)
    });

    if (!response.ok) {
      console.error("request failed. response: ", response);
      throw Error("initializing the receipt did not work");
    }

    return response.json();
  }
}
