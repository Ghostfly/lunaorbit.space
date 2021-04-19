import {
  html,
  customElement,
  LitElement,
  TemplateResult,
  property,
} from 'lit-element';

import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element.js';
import { IXliffSource, IXliffTarget } from '@vtabary/xliff2js';

/**
 * Translate static strings component
 */
@customElement('website-translate')
export class WebsiteTranslate extends Localized(LitElement) {
  @property({type: Array})
  public strings: { source: IXliffSource, target: IXliffTarget }[] = [];

  createRenderRoot(): this {
    return this;
  }

  render(): TemplateResult {
    return html`
        <div class="flex justify-between gap-2 ml-4 mb-4 pb-6">
          <h1 class="text-xl">
            ${msg('Translate')}
          </h1>
          <button class="bg-blue-500 hover:terra-bg text-white py-2 px-4 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </button>
        </div>
        <div class="m-4">
          <table class="table-auto w-full">
            <thead>
              <tr>
                <th>
                  ${msg('Source')}
                  <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 uppercase last:mr-0 mr-1">
                    ${msg('EN')}
                  </span>
                </th>
                <th>
                  ${msg('Target')}
                  <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 uppercase last:mr-0 mr-1">
                    ${msg('FR')}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              ${this.strings.map(translatable => {
                return html`
                <tr>
                    <td>
                      <div class="m-3 pt-0">
                        <input readonly type="text" .value=${translatable.source.children[0] as unknown as string} class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                    </td>
                    <td>
                      <div class="m-3 pt-0">
                        <input type="text" .value=${translatable.target?.children[0] as unknown as string ?? ''} class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
                      </div>
                    </td>
                </tr>
                `;
              })}
            </tbody>
          </table>
        </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'website-translate': WebsiteTranslate;
  }
}
