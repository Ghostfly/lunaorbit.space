import {LitElement, html, TemplateResult, customElement, property} from 'lit-element';
import {Localized} from '@lit/localize/localized-element';
import {msg} from '@lit/localize';

@customElement('banner-message')
export class BannerMessage extends Localized(LitElement) {
  @property({ type: String })
  public message = '';
  
  createRenderRoot(): this {
    return this;
  }

  render(): TemplateResult {
    return html`
            <div class="terra-light" slot="header-banner">
        <div class="max-w-7xl mx-auto py-3 px-3 sm:px-4 lg:px-4">
          <div class="flex items-center justify-between flex-wrap">
            <div class="w-0 flex-1 flex items-center">
              <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <p class="ml-3 font-medium text-white truncate">
                <span class="md:inline" id="banner-message">${this.message}</span>
              </p>
            </div>
            <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
              <button id="close-banner" type="button" class="-mr-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-white sm:-mr-2">
                <span class="sr-only">${msg('Dismiss')}</span>
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'banner-message': BannerMessage;
  }
}
