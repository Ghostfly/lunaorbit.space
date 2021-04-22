import {
  html,
  customElement,
  LitElement,
  TemplateResult,
  internalProperty,
} from 'lit-element';

import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element';
import {CTA, ctaForPage, loadSteps, loadWords, Step, Word} from '../../backend';
import { ctaEditor, loader } from './home';

@customElement('website-how-to')
export class WebsiteHowTo extends Localized(LitElement) {
  @internalProperty()
  private loading = false;
  @internalProperty()
  private _cta: CTA | null = null;
  @internalProperty()
  private _steps: Step[] | null = null;
  @internalProperty()
  private _words: Word[] | null = null;

  createRenderRoot(): this {
    return this;
  }

  public async firstUpdated(): Promise<void> {
    const admin = document.querySelector('x-admin');
    const db = admin?.supabase;

    if (db) {
      this.loading = true;
      this._cta = await ctaForPage(db, 'how-to');
      this._steps = await loadSteps(db);
      this._words = await loadWords(db);
      this.loading = false;
    }
  }

  private async _refresh() {
    const admin = document.querySelector('x-admin');
    const db = admin?.supabase;

    if (db) {
      this._cta = await ctaForPage(db, 'how-to');
      this._steps = await loadSteps(db);
      admin?.showSnack('Refresh ok.');
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
        await db.from<CTA>('cta').update(this._cta).match({ id: `${this._cta.id}` });
      }

      admin?.showSnack('Updated');
    }
  }
  
  private async _addStep() {
    this._steps?.push({
      id: `${this._steps.length + 1}`,
      title: 'New step',
      img: 'filename'
    });
    await this.requestUpdate('_steps');
  }

  private async _removeStep(step: Step) {
    const admin = document.querySelector('x-admin');
    const db = admin?.supabase;
    if (db) {
      await db.from<Step>('how-to-steps').delete().match({ id: step.id });
      await this._refresh();
    }
    admin?.showSnack('Removed');
  }

  render(): TemplateResult {
    return html`
      <div class="flex justify-between gap-2 ml-4 mb-4 pb-6">
        <h1 class="text-xl">
          ${msg('How to?')}
        </h1>
        <div class="global-actions">
          <mwc-fab icon="add" mini @click=${this._addStep}></mwc-fab>
          <mwc-fab icon="refresh" mini @click=${this._refresh}></mwc-fab>
          <mwc-fab icon="save" mini @click=${this._saveChanges}></mwc-fab>
        </div>
      </div>
      <div class="m-4">
        ${this.loading
          ? loader()
      : html`
        ${this._cta ? html` ${ctaEditor(this._cta)} ` : html``} `}
        <div class="mt-4">
          <h1 class="text-md">
            ${msg('Steps')}
          </h1>
          ${this._steps && this._steps.map(step => html`
          <div class="step-box flex flex-wrap w-full items-center">
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
            <div class="relative w-1/3">
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
            
            <a
              title="Remove step"
              class="cursor-pointer flex items-center h-full"
              @click=${async() => {
                await this._removeStep(step);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </a>
          </div>
          `)}
        </div>
        <div class="glossary mt-4">
          <h1 class="text-md">
            ${msg('Glossary')}
          </h1>
          <div class="words-block flex flex-wrap w-full">
            ${this._words?.map(word => {
              return html`
              <div class="word w-full flex flex-wrap mt-4 mb-4 items-center gap-3">
                <div class="fields flex flex-col w-full">
                  <input
                    @change=${(e: Event) => {
                      const target = e.target as HTMLInputElement;
                      word.title = target.value;
                    }}
                    class="w-auto bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    type="text" .value=${word.title}>
                  <textarea
                    @change=${(e: Event) => {
                      const target = e.target as HTMLInputElement;
                      word.text = target.value;
                    }}
                    rows="5"
                    class="w-auto bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    .value=${word.text}></textarea>
                </div>
                  <a
                    class="w-10"
                    title="Delete word"
                    @click=${async () => {
                      console.warn('should delete word');
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </a>
              </div>
              `;
            })}
          </div>
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
