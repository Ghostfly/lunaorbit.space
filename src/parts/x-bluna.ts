import {
  html,
  customElement,
  LitElement,
  TemplateResult,
  property,
} from 'lit-element';

import {Localized} from '@lit/localize/localized-element.js';

import '../components/cta-hero';

/**
 * X-bLuna-Luna Helper
 */
@customElement('x-bluna')
export class XBluna extends Localized(LitElement) {
  @property({type: Boolean})
  public loading = false;

  createRenderRoot(): this {
    return this;
  }

  async firstUpdated(): Promise<void> {
    this.loading = true;

    const orbit = document.querySelector('luna-orbit');
    await orbit?.updateComplete;

    setTimeout(() => {
      orbit?.stopPriceRefesh();
    }, 0);

    this.loading = false;
  }

  render(): TemplateResult {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-bluna': XBluna;
  }
}
