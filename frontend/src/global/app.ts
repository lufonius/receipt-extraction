import {Container} from "./di/container";

export default async () => {
  /**
   * The code to be executed should be placed within a default function that is
   * exported by the global script. Ensure all of the code in the global script
   * is wrapped in the function() that is exported.
   */
  window.container = new Container();
  QrScanner["WORKER_PATH"] = 'lib/qr-scanner-worker.min.js';

  window.addEventListener("beforeinstallprompt", (event: any) => {
    window.beforeInstallEvent = event;
  });
};
