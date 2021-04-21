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
import { CTA, ctaForPage, loadTools, ToolSection } from '../../backend';

@customElement('website-tools')
export class WebsiteTools extends Localized(LitElement) {
  @internalProperty()
  private loading = false;
  @internalProperty()
  private _cta: CTA | null = null;
  @internalProperty()
  private _tools: ToolSection[] | null = null;
  
  createRenderRoot(): this {
    return this;
  }

  public async firstUpdated(): Promise<void> {
    const db = retrieveSupabase();
    this.loading = true;

    this._cta = await ctaForPage(db, 'tools');
    this._tools = await loadTools(db)

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

  render(): TemplateResult {
    return html`
        <div class="flex justify-between gap-2 ml-4 mb-4 pb-6">
          <h1 class="text-xl">
            ${msg('Tools')}
          </h1>
          <button type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm terra-bg">
              ${msg('Save')}
          </button>
        </div>
        <div class="m-4">
          ${this.loading ? html`
            <div class="loading flex w-full justify-center p-6">
              <mwc-circular-progress indeterminate></mwc-circular-progress>
            </div>
            ` : html`
            ${this._cta ? html`
              <h2 class="text-md mt-4 mb-4">
                ${msg('Call to action')}
              </h2>
              ${this._ctaEditor(this._cta.id, this._cta.title, this._cta['cta-text'], this._cta.href)}
          ` : html``}

            <h2 class="text-md mt-4 mb-4">
              ${msg('Tools links')}
            </h2>
            ${this._tools && this._tools.map(tool => {
              return html`
                <label class="leading-7 text-sm text-gray-600">${tool.id}</label>
                <div class="relative">
                  <input name="${tool.id}-name" id="${tool.id}-name" .value=${tool.name} type="text" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                  <textarea placeholder="Explain" name="${tool.id}-name" id="${tool.id}-explain" .value=${tool.explain} class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"></textarea>

                  <div class="bg-gray-100 p-4 rounded-md">
                    ${tool.links.map((link, idx) => {
                      return html`
                      <div class="flex">
                        <div class="relative">
                          <label for="${tool.id}-link-${idx}-title" class="leading-7 text-sm text-gray-600">Title</label>
                          <input name="${tool.id}-link-${idx}-title" id="${tool.id}-link-${idx}-title" type="text" .value=${link.name} class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                        <div class="relative">
                          <label for="${tool.id}-link-${idx}-href" class="leading-7 text-sm text-gray-600">URL</label>
                          <input name="${tool.id}-link-${idx}-href" id="${tool.id}-link-${idx}-href" type="text" .value=${link.href} class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                      </div>
                      `;
                    })}
                  </div>
                </div>
              `;
            })}    
          `}
        </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'website-tools': WebsiteTools;
  }
}
