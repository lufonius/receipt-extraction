import {Injectable} from "../../global/di/injectable";
import {CategoryDto} from "../model/dto";

@Injectable
export class CategoryService {
  private baseApiUrl: string = "/api"

  async get(): Promise<CategoryDto[]> {
    return await fetch(`${this.baseApiUrl}/category`, {
      method: 'GET'
    }).then(r => r.json());
  }

  async delete(id: number): Promise<void> {
    return await fetch(`${this.baseApiUrl}/category/${id}`, {
      method: 'DELETE'
    }).then(r => undefined);
  }
}
