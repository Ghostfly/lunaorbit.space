import {
  LitElement,
  html,
  TemplateResult,
  customElement,
  property,
  query,
} from 'lit-element';
import {Localized} from '@lit/localize/localized-element';
import {msg} from '@lit/localize';
import {AnchorClaimResponse, MIRAirdrop, TerraQuery} from '../terra/terra-min';
import {Router} from '@vaadin/router';

import ExtensionSingleton from '../terra/terra-connect';

/**
 * Airdrop dialog component
 */
@customElement('airdrop-dialog')
export class AirdropDialog extends Localized(LitElement) {
  static ANCAirdropCheckingURL =
    'https://mantle.anchorprotocol.com/?__isClaimed';
  static MIRAirdropCheckingURL = 'https://graph.mirror.finance/graphql';

  @property({type: String})
  public terraAddress = 'terra1alpf6snw2d76kkwjv3dp4l7pcl6cn9uytq89zk';

  @query('#address-input')
  public input!: HTMLInputElement;

  @property({type: String})
  public message = '';

  @query('.dialog')
  public dialog!: HTMLDivElement;

  @property({type: Boolean})
  public showANC: boolean | null = null;

  @property({type: Boolean})
  public showMIR: boolean | null = null;

  @property({type: Boolean})
  public loading = false;

  @property({type: Boolean})
  public retrieveDisabled = false;

  public close(): void {
    this.parentElement?.removeChild(this);
  }

  createRenderRoot(): this {
    return this;
  }

  async firstUpdated(): Promise<void> {
    if (!ExtensionSingleton.init) {
      this.retrieveDisabled = true;
    } else {
      this.retrieveDisabled = false;
    }
  }

  public async checkAnchor(): Promise<void> {
    const anchorCheckQuery = await fetch(AirdropDialog.ANCAirdropCheckingURL, {
      method: 'POST',
      body: JSON.stringify(this._ancAirdropCheckParams()),
    });

    const anchorResponse = (await anchorCheckQuery.json()) as AnchorClaimResponse;

    if (anchorResponse.data.isClaimed) {
      const isClaimed = JSON.parse(anchorResponse.data.isClaimed.Result)
        ?.is_claimed;
      this.input.classList.remove('border-red-500');

      if (!isClaimed) {
        this.showANC = true;
      } else {
        this.showANC = false;
      }
    } else {
      this.input.classList.add('border-red-500');
      this.showANC = false;
    }
  }

  public async checkMIR(): Promise<void> {
    const headers = new Headers();
    headers.set('content-type', 'application/json');

    const mirCheckQuery = await fetch(AirdropDialog.MIRAirdropCheckingURL, {
      method: 'POST',
      body: JSON.stringify(this._mirAirdropCheckParams()),
      headers,
    });

    const mirResponse = (await mirCheckQuery.json()) as {
      data: {
        airdrop: MIRAirdrop[];
      };
    };

    if (mirResponse.data.airdrop.length === 0) {
      this.showMIR = false;
      return;
    }

    for (const airdrop of mirResponse.data.airdrop) {
      if (airdrop.claimable) {
        this.showMIR = true;
        break;
      } else {
        this.showMIR = false;
      }
    }
  }

  protected _mirAirdropCheckParams(): TerraQuery {
    return {
      operationName: 'airdrop',
      variables: {
        network: 'TERRA',
        address: this.terraAddress,
      },
      query:
        'query airdrop($address: String!, $network: String = "TERRA") {\n  airdrop(address: $address, network: $network)\n}\n',
    };
  }

  protected _ancAirdropCheckParams(): TerraQuery {
    return {
      operationName: '__isClaimed',
      variables: {
        airdropContract: 'terra146ahqn6d3qgdvmj8cj96hh03dzmeedhsf0kxqm',
        isClaimedQuery: `{"is_claimed":{"stage":2,"address":"${this.terraAddress}"}}`,
      },
      query:
        'query __isClaimed($airdropContract: String!, $isClaimedQuery: String!) { isClaimed: WasmContractsContractAddressStore(ContractAddress: $airdropContract, QueryMsg: $isClaimedQuery) {    Result    __typename  }}',
    };
  }

  private async _checkAirdrops() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    await this.checkMIR();
    await this.checkAnchor();
    this.loading = false;
  }

  private _onTerraAddressChange(change: InputEvent): void {
    if (!this.terraAddress || !this.terraAddress.startsWith('terra')) {
      this.input.classList.add('border-red-500');
      this.loading = true;
    } else {
      this.input.classList.remove('border-red-500');
      this.loading = false;
    }

    this.terraAddress = (change.target as HTMLInputElement).value;
  }

  private async _retrieveTerraAddress(): Promise<void> {
    if (ExtensionSingleton.init) {
      const info = await ExtensionSingleton.connect();
      this.terraAddress = info.address;
    } else {
      this.retrieveDisabled = true;
    }
  }

  render(): TemplateResult {
    return html`
      <div id="dialog" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    ${msg('Airdrops')}
                  </h3>
                  
                  <div class="flex sm:flex-row flex-col mx-auto px-8 sm:space-x-4 sm:space-y-0 space-y-2 sm:px-0 items-center m-10">
                    ${!this.retrieveDisabled ? html`
                    <button .disabled=${this.loading} class="${
                      this.loading ? 'opacity-50 cursor-wait' : ''
                    } text-white terra-bg border-0 py-2 px-8 rounded text-lg" @click=${() =>
                      this._retrieveTerraAddress()}>
                      ${msg('Retrieve')}
                    </button>
                    ` : ''}
                  </div>
                  <div class="relative flex-grow">
                      <label for="terra-address" class="leading-7 text-sm text-gray-600">${msg(
                        'Terra address'
                      )}</label>
                      <input id="address-input" .value=${
                        this.terraAddress
                      } @change=${(e: InputEvent) =>
      this._onTerraAddressChange(
        e
      )} type="text" id="terra-address" name="terra-address" class="bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                      <button .disabled=${this.loading} class="${
      this.loading ? 'opacity-50 cursor-wait' : ''
    } text-white terra-bg border-0 py-2 px-8 rounded text-lg" @click=${() =>
      this._checkAirdrops()}">
                          ${msg('Check')}
                      </button>
                  </div>
                </div>
              </div>
              <div class="text-sm text-gray-500">
                  <div class="flex justify-between m-5">
                    <div class="anc">
                      <img class="h-10" src="assets/anchor-logo.svg" alt="anchor protocol logo" height="30" />
                      <div class="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
                        ${
                          this.showANC === true
                            ? html`
                                <p class="leading-relaxed">
                                  ${msg('Claimable')}
                                </p>
                              `
                            : this.showANC === null
                            ? html``
                            : html`
                                <p class="leading-relaxed">${msg('Claimed')}</p>
                              `
                        }
                      </div>
                    </div>
                    <div class="mirror">
                      <img class="h-10" src="assets/logo-mirror.svg" alt="mirror protocol logo" height="30" />
                      <div class="p-4 sm:w-1/2 lg:w-1/4 w-1/2">
                        ${
                          this.showMIR === true
                            ? html`
                                <p class="leading-relaxed">
                                  ${msg('Claimable')}
                                </p>
                              `
                            : this.showMIR === null
                            ? html``
                            : html`
                                <p class="leading-relaxed">${msg('Claimed')}</p>
                              `
                        }
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              ${
                this.showANC === true
                  ? html`
                      <button
                        @click=${() => {
                          window.open(
                            'https://app.anchorprotocol.com/airdrop',
                            '_blank'
                          );
                        }}
                        type="button"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm anchor-bg"
                      >
                        ${msg('Claim ANC')}
                      </button>
                    `
                  : html``
              }
              ${
                this.showMIR === true
                  ? html`
                      <button
                        @click=${() => {
                          window.open(
                            'https://terra.mirror.finance/airdrop',
                            '_blank'
                          );
                        }}
                        type="button"
                        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm mirror-bg"
                      >
                        ${msg('Claim MIR')}
                      </button>
                    `
                  : html``
              }
              <button @click=${() => {
                this.close();
                Router.go('home');
              }} type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                ${msg('Close')}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'airdrop-dialog': AirdropDialog;
  }
}
