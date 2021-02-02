import {Injectable} from "./di/injectable";

@Injectable
export class CssVarsService {
  constructor() {}

  get primaryColor(): string {
    return this.getCssVar("--primary").trim();
  }

  get backgroundColor(): string {
    return this.getCssVar("--background").trim();
  }

  private getCssVar(varName: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName);
  }
}
