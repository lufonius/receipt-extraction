import {Injectable} from "../../global/di/injectable";
import {CategoryDto} from "../model/dto";

@Injectable
export class CategoryService {
  private baseApiUrl: string = "/api"

  async getCategories(): Promise<CategoryDto[]> {
    return await fetch(`${this.baseApiUrl}/category`, {
      method: 'GET'
    }).then(r => r.json());
  }
}
