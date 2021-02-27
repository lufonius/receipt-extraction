import {Component, Host, h} from '@stencil/core';

@Component({
  tag: 'app-logo',
  styleUrl: 'app-logo.scss',
  shadow: true,
})
export class AppLogo {
  render() {
    return (
      <Host>
        <div class="logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74.69 66.41">
            <g id="Layer_2" data-name="Layer 2">
              <g id="Layer_1-2" data-name="Layer 1">
                <path class="cls-1"
                      d="M11.45,11.63c2.07.95,2.59,4.45,2.59,4.45V33.65a27,27,0,0,0,27,27H54.14s5.68,0,5.68,3.78"/>
                <path class="cls-1" d="M51,44.68V31.57a27,27,0,0,0-27-27H6.45S3,4.07,2,2"/>
                <circle class="cls-2" cx="31.77" cy="26.36" r="9.61"/>
                <circle class="cls-3" cx="32.79" cy="28.41" r="4.5"/>
                <text class="cls-4" transform="translate(32.79 55.27)">d
                  <tspan class="cls-5" x="8.59" y="0">r</tspan>
                  <tspan class="cls-6" x="14.21" y="0">e</tspan>
                  <tspan class="cls-7" x="22.08" y="0">zip</tspan>
                </text>
              </g>
            </g>
          </svg>
        </div>
      </Host>
    );
  }
}
