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
import { Strength } from '../../backend';

@customElement('website-home')
export class WebsiteHome extends Localized(LitElement) {
  @internalProperty()
  private _strengths: Strength[] = [];

  @internalProperty()
  private loading = false;
  
  createRenderRoot(): this {
    return this;
  }

  public async firstUpdated(): Promise<void> {
    const db = retrieveSupabase();
    this.loading = true;

    const savedStrengths = (await db.from<Strength>('strengths').select('id, title, description, link')).data;
    if (savedStrengths) {
      this._strengths = savedStrengths;
    }

    this.loading = false;
  }

  private _ctaEditor(id: number, title: string, ctaText: string, href: string) {
    return html`
      <div class="relative">
        <label for="${id}-cta-title" class="leading-7 text-sm text-gray-600">Title</label>
        <input name="${id}-cta-title" id="${id}-cta-title" type="text" .value=${title} class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
      </div>
      <div class="relative">
        <label for="${id}-cta-text" class="leading-7 text-sm text-gray-600">Button title</label>
        <input name="${id}-cta-text" id="${id}-cta-text" type="text" .value=${ctaText} class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
      </div>
      <div class="relative">
        <label for="${id}-cta-link-href" class="leading-7 text-sm text-gray-600">URL</label>
        <input name="${id}-cta-link-href" id="${id}-cta-link-href" type="text" .value=${href} class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
      </div>
    `;
  }

  protected _strengthBox(id: number, title: string, message: string, link: {
    href: string;
    name: string;
  } | null): TemplateResult {
    return html`
      <div class="relative">
        <label for="${id}-title" class="leading-7 text-sm text-gray-600">Title</label>
        <input name="${id}-title" id="${id}-title" type="text" .value=${title} class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
      </div>
      <div class="relative">
        <label for="${id}-text" class="leading-7 text-sm text-gray-600">Text</label>
        <textarea id="${id}-text" name="${id}-text" .value=${message} class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-16 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
      </div>
      ${link ? html`
      <div class="relative">
        <label for="${id}-name" class="leading-7 text-sm text-gray-600">Name</label>
        <input name="${id}-name" id="${id}-name" type="text" .value=${link.name} class="bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
      </div>
      <div class="relative">
        <label for="${id}-href" class="leading-7 text-sm text-gray-600">URL</label>
        <input name="${id}-href" id="${id}-href" type="text" .value=${link.href} class="bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
      </div>
      ` : ''}
    `;
  }

  render(): TemplateResult {
    return html`
        <div class="flex justify-between gap-2 ml-4 mb-4 pb-6">
          <h1 class="text-xl">
            ${msg('Home')}
          </h1>
          <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm terra-bg">
              ${msg('Save')}
          </button>
        </div>
        <div class="m-4">
          ${this._ctaEditor(0, msg('Stake with us today !'), msg('Get started'), 'how-to')}
          <h1 class="text-md mt-4 mb-4">
            ${msg('Strengths')}
          </h1>
          ${this.loading ? html`
            <div class="loading flex w-full justify-center p-6">
              <mwc-circular-progress indeterminate></mwc-circular-progress>
            </div>
            ` : html`
            ${this._strengths.map(strength => {
              return this._strengthBox(strength.id, strength.title, strength.description, strength.link)
            })}
          `}
        </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'website-home': WebsiteHome;
  }
}
