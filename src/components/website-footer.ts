import {
  html,
  TemplateResult,
  customElement,
  state,
  property,
  LitElement
} from 'lit-element';
import { retrieveSupabase } from '../luna-orbit';
import { WebsiteSettingsDB } from '../parts/dashboard/settings';
import { loader } from '../parts/dashboard/home';

/**
 * Sign in using Terra component
 */
@customElement('website-footer')
export class WebsiteFooter extends LitElement {
  @state()
  private _twitter: WebsiteSettingsDB | undefined;

  @state()
  private _telegram: WebsiteSettingsDB | undefined;
  @state()
  private _operatorAddress: WebsiteSettingsDB | undefined;
  @state()
  private _name: WebsiteSettingsDB | undefined;

  @property({ type: String})
  public commission = 'Loading...';

  public createRenderRoot(): this {
    return this;
  }

  public async firstUpdated(): Promise<void> {
    const supabase = retrieveSupabase();
    const settingsData = (await supabase.from<WebsiteSettingsDB>('settings')).data;

    if (settingsData) {
      this._twitter = settingsData.find(setting => setting.name === 'twitter');
      this._telegram = settingsData.find(setting => setting.name === 'telegram');
      this._operatorAddress = settingsData.find(setting => setting.name === 'operator-address');
      this._name = settingsData.find(setting => setting.name === 'name');
    }
  }

  render(): TemplateResult {
    return html`
    ${this._twitter && this._telegram && this._operatorAddress && this._name ? html`
    <div class="bg-gradient-to-r from-indigo-300 to-blue-500">
            <div class="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
              <a class="flex title-font font-medium items-center md:justify-start justify-center text-white" href="home">
                <img slot="branding" class="block h-8 w-auto pointer-events-none" src="/assets/logo.svg" alt="LunaOrbit logo" width="33" height="32">
                <span class="ml-3 text-xl">${this._name.value}</span>
              </a>
              <p class="text-sm text-white sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
                <a title="Twitter" href="https://twitter.com/justinlunaorbit" class="text-white ml-1" rel="noopener" target="_blank">@${this._twitter.value}</a>
                | <a class="text-white ml-1" target="_blank" rel="noopener" href="https://station.terra.money/validator/${this._operatorAddress.value}">Validator commission : <span id="commission" class="text-white">${this.commission}</span></a>
                | <a class="text-white ml-1" target="_blank"  rel="noopener" href="https://github.com/terra-project/validator-profiles/tree/master/validators/${this._operatorAddress.value}">Validator profile</a>
              </p>
              <span class="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
                <a class="telegram" title="telegram" class="ml-3 text-white" href="http://t.me/${this._telegram.value.replace('@', '')}" target="_blank"  rel="noopener">
                  <svg fill="currentColor" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/"
                  class="w-5 h-5">
                  <path id="telegram-1"
                      d="M18.384,22.779c0.322,0.228 0.737,0.285 1.107,0.145c0.37,-0.141 0.642,-0.457 0.724,-0.84c0.869,-4.084 2.977,-14.421 3.768,-18.136c0.06,-0.28 -0.04,-0.571 -0.26,-0.758c-0.22,-0.187 -0.525,-0.241 -0.797,-0.14c-4.193,1.552 -17.106,6.397 -22.384,8.35c-0.335,0.124 -0.553,0.446 -0.542,0.799c0.012,0.354 0.25,0.661 0.593,0.764c2.367,0.708 5.474,1.693 5.474,1.693c0,0 1.452,4.385 2.209,6.615c0.095,0.28 0.314,0.5 0.603,0.576c0.288,0.075 0.596,-0.004 0.811,-0.207c1.216,-1.148 3.096,-2.923 3.096,-2.923c0,0 3.572,2.619 5.598,4.062Zm-11.01,-8.677l1.679,5.538l0.373,-3.507c0,0 6.487,-5.851 10.185,-9.186c0.108,-0.098 0.123,-0.262 0.033,-0.377c-0.089,-0.115 -0.253,-0.142 -0.376,-0.064c-4.286,2.737 -11.894,7.596 -11.894,7.596Z" />
                  </svg>
                </a>
                <a title="Twitter" class="ml-3 text-white" href="https://twitter.com/${this._twitter.value}" target="_blank" rel="noopener">
                  <svg fill="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                  </svg>
                </a>
              </span>
            </div>
        </div>
    ` : html`
      ${loader()}
    `}

    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'website-footer': WebsiteFooter;
  }
}
