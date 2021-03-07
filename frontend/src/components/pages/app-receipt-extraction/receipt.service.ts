import {Injectable} from "../../../global/di/injectable";

@Injectable
export class ReceiptService {
  private baseApiUrl: string = "http://localhost:8080/api"

  async deleteReceiptItem(id: number): Promise<void> {
    return await fetch(`${this.baseApiUrl}/receipt/item/${id}`, {
      method: 'DELETE'
    })
      .then(r => {
        if (!r.ok) return Promise.reject();
        return undefined;
      });
  }
}
