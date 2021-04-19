import {html, customElement, LitElement, TemplateResult} from 'lit-element';
import config from '../config';
import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element.js';

/**
 * Home component
 */
@customElement('x-home')
export class XHome extends Localized(LitElement) {
  createRenderRoot(): this {
    return this;
  }

  render(): TemplateResult {
    const strengths = [
      {
        title: msg('Safe'),
        description: msg('Multi-cloud hosting across 12 regions on AWS, GCP, and Azure with 24/7 monitoring'), 
        link: null,
      },
      {
        title: msg('Distributed'),
        description: msg('Geographically distributed across four continents to ensure validator stays online'), 
        link: null,
      },
      {
        title: msg('Smart'),
        description: msg('Geographically distributed across four continents to ensure validator stays online.'), 
        link: null,
      },
      {
        title: msg('Fair'),
        description: msg('0% commissions until') + ' ' + msg('May 10th 2021') + ' ' + msg(', then 2%.'), 
        link: null,
      },
      {
        title: msg('Aware'),
        description: msg('Changes in the commission rate will be announced 30 days in advance.'), 
        link: null,
      },
      {
        title: msg('Reachable'),
        description: msg('Find us on the Luna Orbit chat on'), 
        link: {
          href: `http://t.me/${config.telegram}`,
          name: msg('Telegram')
        }
      },

      
    ]

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
            <span class="block terra-color"
              >${msg('Stake with us today !')}</span
            >
          </h2>
          <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div class="inline-flex rounded-md shadow">
              <a
                href="how-to"
                class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white terra-bg"
              >
                ${msg('Get started')}
              </a>
            </div>
          </div>
        </div>
        <div class="container px-5 py-8 mx-auto">
          <div class="flex flex-wrap -m-4">
            ${strengths.map(strength => {
              return this._strengthBox(strength.title, strength.description, strength.link)
            })}
          </div>
        </div>
      </section>
    `;
  }

  private _strengthBox(title: string, message: string, link: {
    href: string;
    name: string;
  } | null): TemplateResult {
    return html`
    <div class="xl:w-1/3 md:w-1/2 p-4">
        <div class="border border-gray-300 p-6 rounded-lg strength hover:text-white">
          <h2 class="text-lg text-gray-900 font-medium title-font mb-2">
            ${title}
          </h2>
          <p class="leading-relaxed text-base">
            ${message}
            ${link ? html`
            <a
              class="text-gray-500 hover:text-gray-700"
              href="${link.href}"
              >${link.name}</a
            >
            ` : html``}

          </p>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-home': XHome;
  }
}
