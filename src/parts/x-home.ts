import {html, customElement, LitElement, TemplateResult, internalProperty} from 'lit-element';
import { Localized } from '@lit/localize/localized-element.js';

import '../components/cta-hero';

import { Strength, CTA, ctaForPage } from '../backend';

import { retrieveSupabase } from '../luna-orbit';
import { loader } from './dashboard/home';

/**
 * Home component
 */
@customElement('x-home')
export class XHome extends Localized(LitElement) {
  @internalProperty()
  private _strengths: Strength[] = [];

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

    const savedStrengths = (await db.from<Strength>('strengths').select('title, description, link')).data;
    if (savedStrengths) {
      this._strengths = savedStrengths;
    }
    
    this._cta = await ctaForPage(db, 'home');

    this.loading = false;
  }

  render(): TemplateResult {
    return html`
      <section
        class="container mx-auto px-2 py-4 text-gray-700 body-font border-t border-gray-200 relative text-gray-700 body-font border-t border-gray-200 relative"
      >
        ${this._cta ? html`
        <cta-hero .title="${this._cta.title}" .ctaText=${this._cta['cta-text']} href="${this._cta.href}"></cta-hero>
        ` : html``}
        <div class="container px-5 py-8 mx-auto">
          <div class="flex flex-wrap -m-4">
            ${this.loading ? loader() : html`
            ${this._strengths.map(strength => {
              return this._strengthBox(strength.title, strength.description, strength.link)
            })}
            `}
          </div>
        </div>
      </section>
    `;
  }

  protected _strengthBox(title: string, message: string, link: {
    href: string;
    name: string;
  } | null): TemplateResult {
    return html`
    <div class="xl:w-1/3 md:w-1/2 p-4">
        <div class="border border-gray-300 p-6 rounded-lg strength hover:text-white">
          <h2 class="text-lg text-gray-900 font-medium title-font mb-2">
            ${title}
          </h2>
          <p class="leading-relaxed text-base">
            ${message}
            ${link ? html`
            <a
              class="text-gray-500 hover:text-gray-700"
              href="${link.href}"
              >${link.name}</a
            >
            ` : html``}

          </p>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-home': XHome;
  }
}
