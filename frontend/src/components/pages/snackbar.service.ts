import {Injectable} from "../../global/di/injectable";
import Stream = flyd.Stream;
import flyd from "flyd";

@Injectable
export class SnackbarService {

  successSnack: Stream<string> = flyd.stream();
  failureSnack: Stream<string> = flyd.stream();

  showSuccessSnack(message: string) {
    this.successSnack(message);
  }

  showFailureSnack(message: string) {
    this.failureSnack(message);
  }

  get successSnacks(): Stream<string> {
    return this.successSnack;
  }

  get failureSnacks(): Stream<string> {
    return this.failureSnack;
  }
}
