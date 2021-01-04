import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss',
  shadow: true,
})
export class AppRoot {

  addPWA() {
    if (!window.beforeInstallEvent) {
      // The deferred prompt isn't available.
      return;
    }
    // Show the install prompt.
    window.beforeInstallEvent.prompt();
    // Log the result
    window.beforeInstallEvent.userChoice.then((result) => {
      console.log('👍', 'userChoice', result);
      // Reset the deferred prompt variable, since
      // prompt() can only be called once.
    });
  }

  render() {
    return (
      <div>
        <main>
          <stencil-router>
            <stencil-route-switch scrollTopOffset={0}>
              <stencil-route url="/" component="app-home" exact={true} /><br />
              <stencil-route url="/profile/:name" component="app-profile" /><br />
              <stencil-route url="/crop" component="app-crop" /><br />
              <stencil-route url="/qr" component="app-qr" />
            </stencil-route-switch>
          </stencil-router>

          <button onClick={() => this.addPWA()}>Add PWA</button>
        </main>
      </div>
    );
  }
}
