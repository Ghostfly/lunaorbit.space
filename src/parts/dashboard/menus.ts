import {
  html,
  customElement,
  LitElement,
  TemplateResult,
} from 'lit-element';

import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element.js';

/**
 * Admin menu component
 */
@customElement('admin-menu')
export class AdminMenu extends Localized(LitElement) {
  createRenderRoot(): this {
    return this;
  }

  render(): TemplateResult {
    return html`
        <h1 class="text-xl ml-4 mb-4 pb-6">
          ${msg('Menus')}
        </h1>
        <div class="m-4">
          TODO : Form to manage website menus
        </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'admin-menu': AdminMenu;
  }
}
