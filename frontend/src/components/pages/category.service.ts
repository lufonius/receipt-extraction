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

  async update(id: number, category: CategoryDto): Promise<void> {
    return await fetch(`${this.baseApiUrl}/category/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category)
    }).then(r => undefined);
  }

  async insert(category: CategoryDto): Promise<CategoryDto> {
    return await fetch(`${this.baseApiUrl}/category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category)
    }).then(r => r.json());
  }
}
