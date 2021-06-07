import {Injectable} from "../../global/di/injectable";

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
}
