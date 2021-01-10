import {Injectable} from "../../global/di/injectable";
import { v4 as uuid } from 'uuid';

@Injectable
export class OcrService {
  private endpoint: string = 'https://thelab.cognitiveservices.azure.com';
  private key: string = '8eef6983cada4509967a088b3cef6e77';

  async detectText(url: string): Promise<AnalyzeResult> {
    const response = await fetch(`${this.endpoint}/vision/v3.1/read/analyze?language=de`,{
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': this.key
      }),
      body: JSON.stringify({ url })
    });

    const resultUrl = response.headers.get('Operation-Location');

    const maxRetries = 30;
    let retries = 0;
    return await new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        const result = await fetch(resultUrl, {
          method: 'GET',
          headers: new Headers({
            'Ocp-Apim-Subscription-Key': this.key
          })
        });

        const resultJson = await result.json();

        if (resultJson.status === 'succeeded') {
          this.addIdToLines(resultJson);
          resolve(resultJson);
          clearInterval(interval);
        }

        if (resultJson.status === 'failed') {
          reject(resultJson);
          clearInterval(interval);
        }

        retries++;

        if (maxRetries <= retries) {
          reject();
          clearInterval(interval);;
        }
      }, 500);
    });
  }

  private addIdToLines(analyzeResult: AnalyzeResult) {
    analyzeResult.analyzeResult.readResults.forEach(result => {
      result.lines.forEach(line => {
        line.id = uuid();
      });
    });
  }
}

export interface AnalyzeResult {
  analyzeResult: {
    readResults: Array<ReadResult>;
  };
}

export interface ReadResult {
  page: number;
  angle: number;
  language: 'de' | 'en';
  lines: Array<Line>;
}

export interface Line {
  id: string;
  boundingBox: Array<number>;
  text: string;
}
