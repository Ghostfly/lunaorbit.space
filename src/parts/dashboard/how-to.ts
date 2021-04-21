import {
  html,
  customElement,
  LitElement,
  TemplateResult,
  internalProperty,
} from 'lit-element';

import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element.js';
import { retrieveSupabase } from '../../luna-orbit';
import { CTA, ctaForPage } from '../../backend';
import { ctaEditor } from './home';

@customElement('website-how-to')
export class WebsiteHowTo extends Localized(LitElement) {
  @internalProperty()
  private loading = false;
  @internalProperty()
  private _cta: CTA | null = null;
  
  createRenderRoot(): this {
    return this;
  }

  public async firstUpdated(): Promise<void> {
    const db = retrieveSupabase();
    this.loading = true;

    this._cta = await ctaForPage(db, 'how-to');

    this.loading = false;
  }

  render(): TemplateResult {
    return html`
        <div class="flex justify-between gap-2 ml-4 mb-4 pb-6">
          <h1 class="text-xl">
            ${msg('How to?')}
          </h1>
          <mwc-fab icon="save" mini></mwc-fab>
        </div>
        <div class="m-4">
          ${this._cta ? html`
            ${ctaEditor(this._cta.id, this._cta.title, this._cta['cta-text'], this._cta.href)}
          ` : html``}
          ${this.loading ? html`
            <div class="loading flex w-full justify-center p-6">
              <mwc-circular-progress indeterminate></mwc-circular-progress>
            </div>
            ` : html``}
        </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'website-how-to': WebsiteHowTo;
  }
}
