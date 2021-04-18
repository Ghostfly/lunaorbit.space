import {LitElement, html, TemplateResult, customElement} from 'lit-element';
import {Localized} from '@lit/localize/localized-element';
import {msg} from '@lit/localize';

/**
 * Equation component
 *
 */
@customElement('x-equation')
export class XEquation extends Localized(LitElement) {
  createRenderRoot(): this {
    return this;
  }

  render(): TemplateResult {
    return html`
      <div class="container  mx-auto py-12 px-6 flex justify-between">
        <ul class="container px-2 py-2 mx-auto">
          <li>
            <em class="font-semibold"
              ><a
                class="text-gray-600"
                href="https://terra.money"
                target="_blank"
                rel="noopener"
                >${msg(`Terra`)}</a
              ></em
            >${msg(`'s competition is the`)}<em class="font-semibold"
              >${msg(`Dollar`)}</em
            >.
          </li>
          <li>
            <em class="font-semibold"
              ><a
                class="text-gray-600"
                href="https://mirror.finance"
                target="_blank"
                rel="noopener"
                >${msg(`Mirror`)}</a
              ></em
            >${msg(`'s competition is the`)}
            <em class="font-semibold">${msg(`NASDAQ`)}</em>.
          </li>
          <li>
            <em class="font-semibold"
              ><a
                class="text-gray-600"
                href="https://anchorprotocol.com"
                target="_blank"
                rel="noopener"
                >${msg(`Anchor`)}</a
              ></em
            >${msg(`'s competition is the`)}
            <em class="font-semibold">${msg(`Federal Funds Rate`)}</em>.
          </li>
        </ul>
        <div class="flex justify-center m-4 items-center">
          <a class="terra-color" href="https://docs.terra.money/luna.html">
            <img
              class="h-5"
              src="/assets/luna.svg"
              alt="Luna logo"
              width="20"
              height="20"
            />
            <h3 class="font-semibold ml-2">
              ${msg('Luna governs them all !')}
            </h3>
          </a>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-equation': XEquation;
  }
}
