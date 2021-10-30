import {Injectable} from "../../global/di/injectable";
import {CategoryDto, ReceiptDto} from "../model/dto";

@Injectable
export class ReceiptService {
  private baseApiUrl: string = "/api";

  async startExtraction(receiptId: number): Promise<void> {
    const response = await fetch(`${this.baseApiUrl}/receipt/start/${receiptId}`, {
      method: 'POST'
    });

    if (!response.ok) {
      console.error("request failed. response: ", response);
      throw Error("starting receipt extraction did not work");
    }
  }

  async endExtraction(receiptId: number): Promise<void> {
    const response = await fetch(`${this.baseApiUrl}/receipt/end/${receiptId}`, {
      method: 'POST'
    });

    if (!response.ok) {
      console.error("request failed. response: ", response);
      throw Error("starting receipt extraction did not work");
    }
  }

  async update(id: number, receiptDto: ReceiptDto): Promise<void> {
    return await fetch(`${this.baseApiUrl}/receipt/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receiptDto)
    }).then(r => undefined);
  }
}
