import {
  html,
  customElement,
  LitElement,
  TemplateResult,
} from 'lit-element';

import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element.js';

/**
 * 404 component
 */
@customElement('x-404')
export class X404 extends Localized(LitElement) {
  createRenderRoot(): this {
    return this;
  }

  render(): TemplateResult {
    return html`
      <section
        class="container mx-auto px-2 py-4 text-gray-700 body-font border-t border-gray-200"
      >
        <h1 class="text-xl ml-4 mb-4 pt-6 pb-6">${msg('404 - Not found')}</h1>

      <div
        class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between"
      >
        <h2
          class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
        >
          <span class="block terra-color">${msg('We are here to help.')}</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <a
              href="contact"
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white terra-bg"
            >
              ${msg('Contact')}
            </a>
          </div>
        </div>
      </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-404': X404;
  }
}
