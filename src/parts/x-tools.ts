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
import '../components/tailwind-quote';

import {retrieveSupabase} from '../luna-orbit';
import {CTA, ctaForPage, loadTools, ToolSection} from '../backend';
import {loader} from './dashboard/home';

/**
 * Tools component
 */
@customElement('x-tools')
export class XTools extends LitElement {
  @state()
  private _cta: CTA | null = null;

  @state()
  private _sections: ToolSection[] | null = [];
  @property({type: Boolean})
  public loading = false;

  createRenderRoot(): this {
    return this;
  }

  async firstUpdated(): Promise<void> {
    const db = retrieveSupabase();

    this.loading = true;

    this._cta = await ctaForPage(db, 'tools');
    this._sections = await loadTools(db);

    this.loading = false;
  }

  private _sectionTemplate(description: ToolSection): TemplateResult {
    return html`
      <section class="text-gray-600 body-font">
        <div class="container px-2 py-2 mx-auto flex flex-wrap">
          <div class="flex flex-wrap mt-auto mb-auto content-start">
            <div class="w-full sm:p-4 px-4">
              <h1 class="title-font font-medium text-xl mb-2 text-gray-900">
                ${description.name}
              </h1>
              <div class="leading-relaxed">${description.explain}</div>
              <div class="pt-4 pb-3 space-y-1">
                <ul>
                  ${description.links.map((link) => {
                    return html`
                      <li>
                        <a
                          target="${link.href.indexOf('http') !== -1
                            ? '_blank'
                            : '_self'}"
                          rel="noopener"
                          href="${link.href}"
                          class="text-base font-medium"
                          >${link.name}</a
                        >
                      </li>
                    `;
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  render(): TemplateResult {
    return html`
      <section
        class="container mx-auto px-2 py-4 text-gray-700 body-font border-t border-gray-200"
      >
        <h1 class="text-xl ml-4 mb-4 pt-6 pb-6">${msg('Terra tools')}</h1>

        ${this.loading ? loader() : html``}
        ${this._sections &&
        this._sections.map((section) => {
          return this._sectionTemplate(section);
        })}

        <!-- TODO : Make configurable -->
        <tailwind-quote
          .author=${msg('Justin')}
          .text=${msg(`To understand why Luna could appreciate over time, you need to
                understand a few things. The first thing is to understand
                the relationship between the market cap of UST and the price of
                Luna. The second piece of the puzzle is to understand all
                of the different ways demand is being created for the adoption
                and use of UST. When you put those two pieces together,
                you will understand why Luna could continue to appreciate in
                value over time. These are the tools that I personally use
                to watch the ecosystem around Terra. If you have any
                questions, please come find me in the Telegram.`)}
        >
        </tailwind-quote>
      </section>

      ${this._cta
        ? html`
            <cta-hero
              .title=${this._cta.title}
              href="${this._cta.href}"
              .ctaText=${this._cta['cta-text']}
            ></cta-hero>
          `
        : html``}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-tools': XTools;
  }
}
