import {Injectable} from "../../global/di/injectable";
import {User} from "../model/client";
import {getCookie} from "../../global/get-cookie";

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

  async confirmRegistration(code: string): Promise<undefined | { errorCode: string; message: string; }> {
    const response = await fetch(`${this.baseApiUrl}/confirm-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    });

    console.log("body used: ", response.bodyUsed);
    if (response.bodyUsed) {
      return response.json();
    } else {
      return;
    }
  }

  getCurrentUser(): User {
    const jwt = getCookie("token");
    if (jwt) {
      const jwtParts = jwt.split(".");
      return JSON.parse(atob(jwtParts[1]));
    } else {
      return null;
    }
  }
}
