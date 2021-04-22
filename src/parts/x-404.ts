import {html, customElement, LitElement, TemplateResult} from 'lit-element';

import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element.js';

import '../components/cta-hero';

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
        <cta-hero
          .title=${msg('We are here to help.')}
          href="contact"
          .ctaText=${msg('Contact')}
        ></cta-hero>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-404': X404;
  }
}
