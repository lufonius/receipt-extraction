import {Injectable} from "../../global/di/injectable";
import {UserDto} from "../model/dto";

@Injectable
export class AuthService {
  private baseApiUrl: string = "/api";

  async registerUser(email: string, password: string): Promise<number> {
    const response = await fetch(`${this.baseApiUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    return response.status;
  }

  async getCurrentUser(): Promise<UserDto> {
    const response = await fetch(`${this.baseApiUrl}/current-user`, { method: 'GET' });
    return response.json();
  }
}
