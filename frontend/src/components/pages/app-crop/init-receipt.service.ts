import { Injectable } from "../../../global/di/injectable";
import { ReceiptDto } from "../../model/dto";

@Injectable
export class InitReceiptService {
  private baseApiUrl: string = "http://localhost:8080/api"

  async initReceipt(image: Blob): Promise<ReceiptDto> {
    const formData = new FormData();
    formData.append("image", image, "image.jpeg")

    return await fetch(`${this.baseApiUrl}/receipt/init`, {
      method: 'POST',
      body: formData
    }).then(r => r.json());
  }
}
