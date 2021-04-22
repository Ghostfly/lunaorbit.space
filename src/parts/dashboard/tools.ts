import {
  html,
  customElement,
  LitElement,
  TemplateResult,
  internalProperty,
} from 'lit-element';

import { msg } from '@lit/localize';
import { Localized } from '@lit/localize/localized-element';

import { CTA, ctaForPage, loadTools, ToolSection } from '../../backend';
import { ctaEditor, loader } from './home';
import { smoothDnD } from 'smooth-dnd';

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
    const db = document.querySelector('x-admin')?.supabase;
    if (!db) {
      return;
    }

    this.loading = true;

    this._cta = await ctaForPage(db, 'tools');
    this._tools = await loadTools(db);
    this.loading = false;

    await this.updateComplete;

    const sortableHolders = this.querySelectorAll('.sortable-holder') as NodeListOf<HTMLDivElement>;
    if (sortableHolders.length) {
      for (const holder of sortableHolders) {
        smoothDnD(holder);
      }
    }
  }

  private _openBox(e: Event) {
    const editable = (e.currentTarget as HTMLElement).nextElementSibling;
    if (editable?.classList.contains('hidden')) {
      editable?.classList.remove('hidden');
    } else {
      editable?.classList.add('hidden');
    }
  }

  private async _saveChanges() {
    const db = document.querySelector('x-admin')?.supabase;
    if (!db || !this._tools) {
      return;
    }

    console.warn('saving ', this._tools);

    await db.from<ToolSection>('tools').upsert(this._tools);

    console.warn('saved ', this._tools);
  }

  render(): TemplateResult {
    return html`
        <div class="flex justify-between gap-2 ml-4 mb-4 pb-6">
          <h1 class="text-xl">
            ${msg('Tools')}
          </h1>
          <mwc-fab icon="save" mini @click=${async() => this._saveChanges()}></mwc-fab>
        </div>
        <div class="m-4">
          ${this.loading ? loader() : html`
            ${this._cta ? html`
              ${ctaEditor(this._cta.id, this._cta.title, this._cta['cta-text'], this._cta.href)}
          ` : html``}

            <h2 class="text-md mt-4 mb-4">
              ${msg('Tools links')}
            </h2>
            ${this._tools && this._tools.map(tool => {
              return html`
              <div class="w-full bg-gray-100 cursor-pointer mb-2 select-none" @click=${this._openBox}>
                <div class="rounded flex p-4 h-full items-center justify-between">
                  <span class="title-font font-medium">${tool.name}</span>
                  <a title="Remove tool" @click=${() => {
                    this._tools = this._tools?.filter(tooling => tooling !== tool) ?? null;
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </a>
                </div>
              </div>
              <div class="p-2 m-2 rounded hidden">
                <input name="${tool.id}-name" id="${tool.id}-name" .value=${tool.name} type="text" class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                <textarea placeholder="Explain" name="${tool.id}-name" id="${tool.id}-explain" .value=${tool.explain} class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"></textarea>

                <div class="tool-links flex flex-wrap gap-4 sortable-holder cursor-pointer m-4">
                  ${tool.links.map((link, idx) => {
                    return this._templateForToolLink(idx, tool, link);
                  })}
                </div>
                <button type="button" class="w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-white terra-bg" @click=${() => this._addToolLink(tool)}>
                    ${msg('Add link')}
                </button>
              </div>
              `;
            })}
            <button type="button" class="m-4 w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-white terra-bg" @click=${this._addTool}>
              ${msg('Add tool')}
            </button>
          `}
        </div>
    `;
  }

  private _addTool() {
    this._tools?.push({
      id: this._tools.length + 1,
      name: 'New tool',
      explain: 'Why?',
      links: [{
        href: '',
        name: '',
      }]
    });

    this.requestUpdate('_tools');
  }

  private _addToolLink(tool: ToolSection) {
    tool.links.push({
      href: '',
      name: ''
    });
    this.requestUpdate('_tools');
  }


  private _removeToolLink(tool: ToolSection, link: { href: string, name: string }) {
    tool.links = tool.links.filter(currentLinks => currentLinks !== link);
    this.requestUpdate('_tools');
  }

  private _templateForToolLink(idx: number, tool: ToolSection, link: { href: string; name:string}) {
    return html`
    <div class="flex gap-3">
      <div class="relative">
        <label for="${tool.id}-link-${idx}-title" class="leading-7 text-sm text-gray-600">Title</label>
        <input @change=${(e: Event) => {
          const target = e.target as HTMLInputElement;
          link.name = target.value;
        }} name="${tool.id}-link-${idx}-title" id="${tool.id}-link-${idx}-title" type="text" .value=${link.name} class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
      </div>
      <div class="relative">
        <label for="${tool.id}-link-${idx}-href" class="leading-7 text-sm text-gray-600">URL</label>
        <input @change=${(e: Event) => {
          const target = e.target as HTMLInputElement;
          link.href = target.value;
        }} name="${tool.id}-link-${idx}-href" id="${tool.id}-link-${idx}-href" type="text" .value=${link.href} class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
      </div>
      <div class="relative">
        <a title="Delete link" class="cursor-pointer flex items-center h-full" @click=${() => {
          this._removeToolLink(tool, link);
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </a>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'website-tools': WebsiteTools;
  }
}
