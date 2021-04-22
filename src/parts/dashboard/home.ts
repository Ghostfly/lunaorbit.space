import {
  html,
  customElement,
  LitElement,
  TemplateResult,
  internalProperty,
} from 'lit-element';

import { msg } from '@lit/localize';
import { Localized } from '@lit/localize/localized-element';

import { CTA, ctaForPage, Strength } from '../../backend';
import { smoothDnD } from 'smooth-dnd';

export function ctaEditor(cta: CTA): TemplateResult {
  return html`
  <div class="cta-wrapper">
    <h2 class="text-md mt-4 mb-4 w-full">
      ${msg('Call to action')}
    </h2>
    <div class="cta-editor flex flex-wrap gap-2">
      <div class="relative">
          <label for="${cta.id}-cta-title" class="leading-7 text-sm text-gray-600">Title</label>
          <input @change=${(e: Event) => {
              const target = e.target as HTMLInputElement;
              cta.title = target.value;
          }} name="${cta.id}-cta-title" id="${cta.id}-cta-title" type="text" .value=${cta.title} class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
        </div>
        <div class="relative">
          <label for="${cta.id}-cta-text" class="leading-7 text-sm text-gray-600">Button title</label>
          <input @change=${(e: Event) => {
              const target = e.target as HTMLInputElement;
              cta['cta-text'] = target.value;
          }} name="${cta.id}-cta-text" id="${cta.id}-cta-text" type="text" .value=${cta['cta-text']} class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
        </div>
        <div class="relative">
          <label for="${cta.id}-cta-link-href" class="leading-7 text-sm text-gray-600">URL</label>
          <input @change=${(e: Event) => {
              const target = e.target as HTMLInputElement;
              cta.href = target.value;
          }} name="${cta.id}-cta-link-href" id="${cta.id}-cta-link-href" type="text" .value=${cta.href} class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
        </div>
    </div>
  </div>
  `;
}

export function loader(): TemplateResult {
  return html`
  <div class="loading flex w-full justify-center p-6">
    <mwc-circular-progress indeterminate></mwc-circular-progress>
  </div>
  `;
}

@customElement('website-home')
export class WebsiteHome extends Localized(LitElement) {
  @internalProperty()
  private _strengths: Strength[] = [];

  @internalProperty()
  private loading = false;

  @internalProperty()
  private _cta: CTA | null = null;
  
  createRenderRoot(): this {
    return this;
  }

  private async _loadStrengths() {
    const db = document.querySelector('x-admin')?.supabase;
    if (db) {
      const savedStrengths = (await db.from<Strength>('strengths').select('id, title, description, link, order').order('order')).data;
      if (savedStrengths) {
        this._strengths = savedStrengths;
      }
    }
  }

  public async firstUpdated(): Promise<void> {
    this.loading = true;
    const db = document.querySelector('x-admin')?.supabase;
    if (db) {
      this._cta = await ctaForPage(db, 'home');
    }

    await this._loadStrengths();
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
    const origin = e.target as HTMLElement;
    if (!origin.classList.contains('expander')) {
      return;
    }

    const box = (e.currentTarget as HTMLElement);
    const expandable = box.querySelector('.expandable');
    
    if (expandable?.classList.contains('hidden')) {
      expandable?.classList.remove('hidden');
    } else {
      expandable?.classList.add('hidden');
    }
  }

  protected _strengthBox(strength: Strength): TemplateResult {
    return html`
    <div class="strength-box" @click=${this._openBox}>
      <div class="w-full border-2 cursor-pointer mb-2 select-none">
          <div class="expander bg-gray-100 rounded flex p-4 h-full items-center justify-between">
            <span class="title-font font-medium">${strength.title}</span>
            <a title="Delete strength" @click=${async () => {
              await this._removeStrength(strength.title);
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </a>
          </div>
        </div>
        <div class="editable expandable hidden">
          <div class="strength-block flex justify-center gap-2 m-4">
            <div class="relative">
              <label for="${strength.id}-title" class="leading-7 text-sm text-gray-600">Title</label>
              <input @change=${(e: Event) => {
                const target = e.target as HTMLInputElement;
                strength.title = target.value;
              }} name="${strength.id}-title" id="${strength.id}-title" type="text" .value=${strength.title} class="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
            <div class="relative w-full">
              <label for="${strength.id}-text" class="leading-7 text-sm text-gray-600">Text</label>
              <textarea @change=${(e: Event) => {
                const target = e.target as HTMLInputElement;
                strength.description = target.value;
              }} id="${strength.id}-text" name="${strength.id}-text" .value=${strength.description} class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-16 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
            </div>
          </div>
          <div class="flex justify-start gap-2 m-4">
            ${strength.link ? html`
            <div class="relative">
              <label for="${strength.id}-link-name" class="leading-7 text-sm text-gray-600">Name</label>
              <input @change=${(e: Event) => {
                const target = e.target as HTMLInputElement;
                strength.link.name = target.value;
              }} name="${strength.id}-link-name" id="${strength.id}-link-name" type="text" .value=${strength.link.name} class="bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
            </div>
            <div class="relative w-full">
              <label for="${strength.id}-link-href" class="leading-7 text-sm text-gray-600">URL</label>
              <input @change=${(e: Event) => {
                const target = e.target as HTMLInputElement;
                strength.link.href = target.value;
              }} name="${strength.id}-link-" id="${strength.id}-link-" type="text" .value=${strength.link.href} class="bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out w-full" />
            </div>
          ` : ''}
          </div>
        </div>
    </div>
    `;
  }

  private async _removeStrength(title: string) {
    const db = document.querySelector('x-admin')?.supabase;
    if (db) {
      await db.from<Strength>('strengths').delete().match({
        title
      });
      await this._loadStrengths();
      document.querySelector('x-admin')?.showSnack('Removed.');
    }
  }

  private async _refresh() {
    await this._loadStrengths();
    document.querySelector('x-admin')?.showSnack('Refresh done.');
  }

  private async _addStrength() {
    this._strengths.push({
      id: this._strengths.length + 1,
      order: this._strengths.length,
      title: 'New strength',
      description: '',
      link: {
        href: '',
        name: '',
      }
    });
    await this.requestUpdate('_strengths');
  }

  private async _save() {
    console.warn('saving', this._strengths);
    const db = document.querySelector('x-admin')?.supabase;
    if (!db) {
      return;
    }

    if (this._cta) {
      await db.from<CTA>('cta').update(this._cta).match({ id: `${this._cta.id}` });
    }

    await db.from('strengths').upsert(this._strengths);
    
    await this._loadStrengths();
    console.warn('saved', this._strengths);
  }

  render(): TemplateResult {
    return html`
        <div class="flex justify-between ml-4">
          <h1 class="text-xl">
            ${msg('Home')}
          </h1>
          <div class="global-actions">
            <mwc-fab icon="add" mini @click=${this._addStrength}></mwc-fab>
            <mwc-fab icon="refresh" mini @click=${this._refresh}> </mwc-fab>
            <mwc-fab icon="save" mini @click=${this._save}></mwc-fab>
          </div>
        </div>
        <div class="m-4 p-4 flex flex-wrap">
          ${this._cta ? html`
              ${ctaEditor(this._cta)}
          ` : html``}
          <div class="strengths w-full">
              <h1 class="text-md mt-8 mb-4">
                ${msg('Strengths')}
              </h1>
            ${this.loading ? loader() : html`
              <div class="sortable-holder">
              ${this._strengths.map(strength => {
                return this._strengthBox(strength);
              })}
              </div>
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
