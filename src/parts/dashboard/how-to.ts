import {
  html,
  customElement,
  LitElement,
  TemplateResult,
  internalProperty,
} from 'lit-element';

import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element';
import {CTA, ctaForPage, loadSteps, Step} from '../../backend';
import {ctaEditor, loader} from './home';

@customElement('website-how-to')
export class WebsiteHowTo extends Localized(LitElement) {
  @internalProperty()
  private loading = false;
  @internalProperty()
  private _cta: CTA | null = null;
  @internalProperty()
  private _steps: Step[] | null = null;

  createRenderRoot(): this {
    return this;
  }

  public async firstUpdated(): Promise<void> {
    const db = document.querySelector('x-admin')?.supabase;

    if (db) {
      this.loading = true;
      this._cta = await ctaForPage(db, 'how-to');
      this._steps = await loadSteps(db);
      this.loading = false;
    }
  }

  private async _saveChanges() {
    const admin = document.querySelector('x-admin');
    const db = admin?.supabase;
    if (db) {
      if (this._steps) {
        await db.from<Step>('how-to-steps').upsert(this._steps);
      }

      if (this._cta) {
        await db.from<Step>('cta').update(this._cta).match({ id: `${this._cta.id}` });
      }

      admin?.showSnack('Updated');
    }
  }

  render(): TemplateResult {
    return html`
      <div class="flex justify-between gap-2 ml-4 mb-4 pb-6">
        <h1 class="text-xl">
          ${msg('How to?')}
        </h1>
        <mwc-fab icon="save" mini @click=${this._saveChanges}></mwc-fab>
      </div>
      <div class="m-4">
        ${this.loading
          ? loader()
          : html` ${this._cta ? html` ${ctaEditor(this._cta)} ` : html``} `}
        <div class="mt-4">
          <h1 class="text-md">
            ${msg('Steps')}
          </h1>
          ${this._steps && this._steps.map(step => html`
          <div class="step-box flex flex-wrap w-full">
            <div class="relative w-1/2">
              <label
                for="${step.id}-step-title"
                class="leading-7 text-sm text-gray-600"
                >Title</label
              >
              <input
                @change=${(e: Event) => {
                  const target = e.target as HTMLInputElement;
                  step.title = target.value;
                }}
                name="${step.id}-step-title"
                id="${step.id}-step-title"
                type="text"
                .value=${step.title}
                class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div class="relative w-1/2">
              <label
                for="${step.id}-step-image"
                class="leading-7 text-sm text-gray-600"
                >Image</label
              >
              <input
                @change=${(e: Event) => {
                  const target = e.target as HTMLInputElement;
                  step.img = target.value;
                }}
                name="${step.id}-step-img"
                id="${step.id}-step-img"
                type="text"
                .value=${step.img}
                class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
          </div>
          `)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'website-how-to': WebsiteHowTo;
  }
}
