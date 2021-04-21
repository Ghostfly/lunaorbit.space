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

export function ctaEditor(id: number, title: string, ctaText: string, href: string): TemplateResult {
  return html`
  <h2 class="text-md mt-4 mb-4 w-full">
    ${msg('Call to action')}
  </h2>
  <div class="cta-editor flex flex-wrap gap-2">
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
  </div>
  `;
}

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

  private _openBox(e: Event) {
    const editable = (e.currentTarget as HTMLElement).nextElementSibling;
    if (editable?.classList.contains('hidden')) {
      editable?.classList.remove('hidden');
    } else {
      editable?.classList.add('hidden');
    }
  }

  protected _strengthBox(id: number, title: string, message: string, link: {
    href: string;
    name: string;
  } | null): TemplateResult {
    return html`
      <div class="w-full border-2 cursor-pointer mb-2 select-none" @click=${this._openBox}>
        <div class="bg-gray-100 rounded flex p-4 h-full items-center justify-between">
          <span class="title-font font-medium">${title}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      </div>
      <div class="editable hidden">
        <div class="strength-block flex justify-center gap-2 m-4">
          <div class="relative">
            <label for="${id}-title" class="leading-7 text-sm text-gray-600">Title</label>
            <input name="${id}-title" id="${id}-title" type="text" .value=${title} class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
          <div class="relative w-full">
            <label for="${id}-text" class="leading-7 text-sm text-gray-600">Text</label>
            <textarea id="${id}-text" name="${id}-text" .value=${message} class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-16 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
          </div>
        </div>
        <div class="flex justify-start gap-2 m-4">
          ${link ? html`
          <div class="relative">
            <label for="${id}-name" class="leading-7 text-sm text-gray-600">Name</label>
            <input name="${id}-name" id="${id}-name" type="text" .value=${link.name} class="bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
          <div class="relative w-full">
            <label for="${id}-href" class="leading-7 text-sm text-gray-600">URL</label>
            <input name="${id}-href" id="${id}-href" type="text" .value=${link.href} class="bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out w-full" />
          </div>
        ` : ''}
        </div>
      </div>
    `;
  }

  render(): TemplateResult {
    return html`
        <div class="flex justify-between ml-4">
          <h1 class="text-xl">
            ${msg('Home')}
          </h1>
          <mwc-fab icon="save" mini></mwc-fab>
        </div>
        <div class="m-4 p-4 flex flex-wrap">
          ${ctaEditor(0, msg('Stake with us today !'), msg('Get started'), 'how-to')}
          <div class="strengths w-full">
              <h1 class="text-md mt-8 mb-4">
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
              <button type="button" class="w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-white terra-bg">
                  ${msg('Add strength')}
              </button>
            `}
          </div>
        </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'website-home': WebsiteHome;
  }
}
