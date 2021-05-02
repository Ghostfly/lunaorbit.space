import {
  html,
  customElement,
  TemplateResult,
  property,
  state,
  LitElement,
} from 'lit-element';
import {msg} from '@lit/localize';

import '../components/cta-hero';

import {CTA, ctaForPage, loadSteps, loadWords, Step, Word} from '../backend';
import {retrieveSupabase} from '../luna-orbit';
import {loader} from './dashboard/home';

/**
 * How to choose a validator component
 */
@customElement('x-how-to')
export class XHowTo extends LitElement {
  @state()
  private step = 1;

  @property({type: Boolean})
  public loading = false;

  @state()
  private _cta: CTA | null = null;
  @state()
  private _steps: Step[] | null = null;
  @state()
  private _dictionary: Word[] | null = null;

  createRenderRoot(): this {
    return this;
  }

  async firstUpdated(): Promise<void> {
    const db = retrieveSupabase();

    this.loading = true;

    this._steps = await loadSteps(db);
    if (this._steps) {
      for (const step of this._steps) {
        const storage = retrieveSupabase().storage.from('assets');
        const signedImageURL = (
          await storage.createSignedUrl(step.img + '.png', 3000)
        ).signedURL;
        if (signedImageURL) {
          step.signedURL = signedImageURL;
        }
      }
    }

    this._cta = await ctaForPage(db, 'how-to');
    this._dictionary = await loadWords(db);

    this.loading = false;
  }

  private _onTabClick(e: Event) {
    const item = e.target as HTMLElement;
    if (item.dataset.id) {
      this.step = parseInt(item.dataset.id, 10);
    }
  }

  protected _glossaryItem(title: string, text: string): TemplateResult {
    return html`
      <a class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50">
        <div class="ml-4">
          <p class="text-base font-medium text-gray-900">${title}</p>
          <p class="mt-1 text-md text-gray-500">${text}</p>
        </div>
      </a>
    `;
  }

  private _tabItem(id: string, title: string, active?: boolean) {
    return html`
      <li class="mr-1">
        <a
          data-id="${id}"
          class="cursor-pointer	bg-white inline-block rounded-t py-2 px-4 ${active
            ? 'active font-semibold border-l border-t border-r text-blue-800'
            : ''}"
        >
          ${title}
        </a>
      </li>
    `;
  }

  render(): TemplateResult {
    const currentStep = this._steps?.find(
      (step) => parseInt(step.id, 10) === this.step
    );
    const currentSignedURL = currentStep?.signedURL ?? '';
    const currentALT = currentStep?.title ?? '';

    return html`
      <section
        class="container mx-auto px-2 py-4 text-gray-700 body-font border-t border-gray-200"
      >
        <h1 class="text-xl ml-4 mb-4 pt-6 pb-6">
          ${msg('How to start staking on Terra ?')}
        </h1>

        ${this.loading
          ? loader()
          : html`
              <ul class="list-reset flex border-b" @click=${this._onTabClick}>
                ${this._steps &&
                this._steps.map((item) => {
                  return this._tabItem(
                    item.id,
                    item.title,
                    this.step === parseInt(item.id, 10)
                  );
                })}
              </ul>

              <div class="p-4" id="tabs">
                <img src=${currentSignedURL} alt=${currentALT} />
              </div>

              <div
                class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
              >
                <div
                  class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8"
                >
                  <h2 class="text-md pointer-events-none">
                    ${msg('Glossary')}
                  </h2>
                  ${this._dictionary &&
                  this._dictionary.map((item) => {
                    return this._glossaryItem(item.title, item.text);
                  })}
                </div>
              </div>
              ${this._cta
                ? html`
                    <cta-hero
                      .title=${this._cta.title}
                      href=${this._cta.href}
                      .ctaText=${this._cta['cta-text']}
                    ></cta-hero>
                  `
                : html``}
            `}
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-how-to': XHowTo;
  }
}
