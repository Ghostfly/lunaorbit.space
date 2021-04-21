import {
  html,
  customElement,
  LitElement,
  TemplateResult,
  internalProperty,
  property,
} from 'lit-element';

import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element.js';

import '../components/cta-hero';
import '../components/tailwind-quote';
import { retrieveSupabase } from '../luna-orbit';

interface ToolSection {
  id: number;
  name: string;
  explain: string;
  links: {
    href: string;
    name: string;
  }[];
}

/**
 * Tools component
 */
@customElement('x-tools')
export class XTools extends Localized(LitElement) {

  @internalProperty()
  private _sections: ToolSection[] = [];
  @property({ type: Boolean })
  public loading = false;

  createRenderRoot(): this {
    return this;
  }

  async firstUpdated(): Promise<void> {
    await this._loadTools();
  }

  private async _loadTools() {
    const db = retrieveSupabase();

    this.loading = true;
    
    const sections = (await db.from<ToolSection>('tools').select('name, explain, links')).data;
    
    if (sections) {
      this._sections = sections;
    }

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
                          target="_blank"
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

        ${this.loading ? html`
        <div class="loading flex w-full justify-center p-6">
          <mwc-circular-progress indeterminate></mwc-circular-progress>
        </div>
        ` : html``}

        ${this._sections.map((section) => {
          return this._sectionTemplate(section);
        })}

        <tailwind-quote .author=${msg('Justin')} .text=${msg(`To understand why Luna could appreciate over time, you need to
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

      <cta-hero .title=${msg('We are here to help.')} href="contact" .ctaText=${msg('Contact')}></cta-hero>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-tools': XTools;
  }
}
