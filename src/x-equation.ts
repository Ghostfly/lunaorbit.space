import {
  LitElement,
  html,
  TemplateResult,
  customElement
} from 'lit-element';
import {
  Localized
} from '@lit/localize/localized-element';

@customElement('x-equation')
export class XEquation extends Localized(LitElement) {
  createRenderRoot(): this {
    return this;
  }

  render(): TemplateResult {
    return html`
      <div class="container  mx-auto py-12 px-6 flex justify-between" slot="equation">
        <ul class="container px-2 py-2 mx-auto">
          <li><em class="font-semibold"><a class="text-gray-600" href="https://terra.money" target="_blank" rel="noopener">Terra</a></em>'s competition is the <em class="font-semibold">Dollar</em>.</li>
          <li><em class="font-semibold"><a class="text-gray-600" href="https://mirror.finance" target="_blank" rel="noopener">Mirror</a></em>'s competition is the <em class="font-semibold">NASDAQ</em>.</li>
          <li><em class="font-semibold"><a class="text-gray-600" href="https://anchorprotocol.com" target="_blank" rel="noopener">Anchor</a></em>'s competition is the <em class="font-semibold">Federal Funds Rate</em>.</li>
        </ul>
        <div class="flex justify-center m-4 items-center">
          <a class="terra-color" href="https://docs.terra.money/luna.html">
            <img class="h-5" src="/assets/luna.svg" alt="Luna logo" width="20" height="20" />
            <h3 class="font-semibold ml-2">Luna governs them all !</h3>
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
