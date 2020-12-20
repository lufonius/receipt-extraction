import {Container} from "./di/container";

declare global {
  interface Window {
    container: Container;
  }
}
