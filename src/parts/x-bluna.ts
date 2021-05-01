import {
  html,
  customElement,
  TemplateResult,
  property,
  LitElement,
} from 'lit-element';

import '../components/cta-hero';

/**
 * X-bLuna-Luna Helper
 */
@customElement('x-bluna')
export class XBluna extends LitElement {
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
