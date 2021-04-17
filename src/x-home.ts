import {html, customElement, LitElement} from 'lit-element';
import config from './config';

/**
 * Home component
 */
@customElement('x-home')
export class XHome extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <section
        class="container mx-auto px-2 py-4 text-gray-700 body-font border-t border-gray-200 relative text-gray-700 body-font border-t border-gray-200 relative"
      >
        <div
          class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between"
        >
          <h2
            class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            <span class="block terra-color">Stake with us today !</span>
          </h2>
          <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div class="inline-flex rounded-md shadow">
              <a
                href="how-to"
                class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white terra-bg"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
        <div class="container px-5 py-8 mx-auto">
          <div class="flex flex-wrap -m-4">
            <div class="sm:w-full xl:w-1/3 md:w-1/2 p-4">
              <div class="border border-gray-300 p-6 rounded-lg">
                <h2 class="text-lg text-gray-900 font-medium title-font mb-2">
                  Safe
                </h2>
                <p class="leading-relaxed text-base">
                  Multi-cloud hosting across 12 regions on AWS, GCP, and Azure
                  with 24/7 monitoring.
                </p>
              </div>
            </div>
            <div class="xl:w-1/3 md:w-1/2 p-4">
              <div class="border border-gray-300 p-6 rounded-lg">
                <h2 class="text-lg text-gray-900 font-medium title-font mb-2">
                  Distributed
                </h2>
                <p class="leading-relaxed text-base">
                  Geographically distributed across four continents to ensure
                  validator stays online.
                </p>
              </div>
            </div>
            <div class="xl:w-1/3 md:w-1/2 p-4">
              <div class="border border-gray-300 p-6 rounded-lg">
                <h2 class="text-lg text-gray-900 font-medium title-font mb-2">
                  Smart
                </h2>
                <p class="leading-relaxed text-base">
                  Oracle Management provides maximum accuracy to maximize
                  delegation rewards
                </p>
              </div>
            </div>
            <div class="xl:w-1/3 md:w-1/2 p-4">
              <div class="border border-gray-300 p-6 rounded-lg">
                <h2 class="text-lg text-gray-900 font-medium title-font mb-2">
                  Fair
                </h2>
                <p class="leading-relaxed text-base">
                  0% commissions until <b>May 10th 2021</b>, then 2%.
                </p>
              </div>
            </div>
            <div class="xl:w-1/3 md:w-1/2 p-4">
              <div class="border border-gray-300 p-6 rounded-lg">
                <h2 class="text-lg text-gray-900 font-medium title-font mb-2">
                  Aware
                </h2>
                <p class="leading-relaxed text-base">
                  Changes in the commission rate will be announced 30 days in
                  advance.
                </p>
              </div>
            </div>
            <div class="xl:w-1/3 md:w-1/2 p-4">
              <div class="border border-gray-300 p-6 rounded-lg">
                <h2 class="text-lg text-gray-900 font-medium title-font mb-2">
                  Reachable
                </h2>
                <p class="leading-relaxed text-base">
                  Find us on the Luna Orbit chat on
                  <a
                    class="text-gray-500 hover:text-gray-700"
                    href="http://t.me/${config.telegram}"
                    >Telegram</a
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-home': XHome;
  }
}
