import {
  html,
  customElement,
  LitElement,
  internalProperty,
  TemplateResult,
} from 'lit-element';

import {msg} from '@lit/localize';

enum Tools {
  Airdrop = 'airdrop',
  Staking = 'staking',
  Exchange = 'exchange',
  Various = 'various',
  USTSupply = 'ust-supply',
  MIRVolume = 'mirror-volume',
  ValidatorPerformance = 'validator-perf',
  Price = 'price',
}

interface ToolSection {
  id: Tools;
  name: string;
  explain: string;
  links: {
    href: string;
    name: string;
  }[];
}

/**
 * Tools component
 */
@customElement('x-tools')
export class XTools extends LitElement {
  createRenderRoot() {
    return this;
  }

  @internalProperty()
  private sections: ToolSection[] = [
    {
      id: Tools.Airdrop,
      name: msg('Airdrop timing and information'),
      explain: msg(
        'I use this to follow upcoming airdrops you get for staking Luna in Terra Station.  As of April 9th 2021 there are 2 drops per week - ANC and MIR.'
      ),
      links: [
        {
          href: 'https://terra-airdrop-timer.vercel.app/',
          name: msg('Vercel Airdrop Timer'),
        },
        {
          href: 'https://terra.smartstake.io/',
          name: msg('Terra Analytics'),
        },
      ],
    },
    {
      id: Tools.Staking,
      name: msg('Staking / Unstaking Calendar'),
      explain: msg(
        'Shows the amount of Luna that has been delegated or undelegated on certain days.  When Luna gets undelegated and 21 days pass, it is possible that the Luna will get moved to an exchange and sold. Track'
      ),
      links: [
        {
          href:
            'https://www.lunawhale.com/servlet/web/StakingUnstaking_selectPage',
          name: 'LunaWhale',
        },
      ],
    },
    {
      id: Tools.Exchange,
      name: msg('Exchange Wallets'),
      explain: msg(
        'As Luna gets burned, the amount of Luna available on exchanges should slowly decrease.  Also good to watch these addresses during big undelegation events.'
      ),
      links: [
        {
          href:
            'https://finder.terra.money/columbus-4/account/terra15s66unmdcpknuxxldd7fsr44skme966tdckq8c',
          name: 'Binance',
        },
        {
          href:
            'https://finder.terra.money/columbus-4/address/terra1rvxcszyfecrt2v3a7md8p30hvu39kj6xf48w9e',
          name: 'KuCoin',
        },
      ],
    },
    {
      id: Tools.Various,
      name: msg('Various useful metrics for Anchor and TerraSwap'),
      explain: msg(
        'You can see Anchor earn APY history, tokens in the ANC - UST LP,  bLuna / Luna swap price history and pool size, etc.'
      ),
      links: [
        {
          href: 'https://reactor.starport.services/',
          name: 'MarteCloud Tools',
        },
      ],
    },
    {
      id: Tools.USTSupply,
      name: msg('UST Supply information'),
      explain: msg(
        'This is the most important metric to watch, UST market cap and growth day over day.  Burn tracking shows you how much Luna has been burned, more is better.'
      ),
      links: [
        {
          href: 'https://www.coingecko.com/en/coins/terra-usd',
          name: 'CoinGecko UST',
        },
        {
          href: 'https://terra.smartstake.io/history',
          name: 'Burn tracking and statistics',
        },
      ],
    },
    {
      id: Tools.MIRVolume,
      name: msg('Mirror volume'),
      explain: msg(
        'As the price of Mirror goes up, so does the yield for staking mAssets which in turn drives demand for UST and increases the value of the weekly MIR airdrop.'
      ),
      links: [
        {
          href: 'https://www.coingecko.com/en/exchanges/terraswap',
          name: 'CoinGecko Volume information for Mirror',
        },
      ],
    },
    {
      id: Tools.ValidatorPerformance,
      name: msg('Validator performance'),
      explain: msg(
        'How is Luna Orbit doing?  You want to see good uptime, few missed Oracle votes, and low precommits missed.  Numbers are trailing and should be watched over time.'
      ),
      links: [
        {
          href: 'https://terra.stake.id/#/',
          name: msg('Terra Stake ID'),
        },
        {
          href:
            'https://hubble.figment.io/terra/chains/columbus-4/validators/EA5B6A187F6A74B40AFF1828E8ADE11072835416',
          name: msg('Luna Orbit - hubble.figment.io'),
        },
      ],
    },
    {
      id: Tools.Price,
      name: 'Trading tools',
      explain: '',
      links: [
        {
          href:
            'https://analytics.blep.ai/charts/uniswapv2.0x67B3825348521B94828127f1eE31da80EE67d285.trade-1m0s',
          name: msg('Blep.ai - LUNA-UST (UniSwap)'),
        },
        {
          href:
            'https://analytics.blep.ai/charts/uniswapv2.0x87dA823B6fC8EB8575a235A824690fda94674c88.trade-1m0s',
          name: msg('Blep.ai - MIR-UST (UniSwap)'),
        },
      ],
    },
  ];

  public sectionForTools(toolsSection: Tools): ToolSection | undefined {
    return this.sections.find((section) => section.id === toolsSection);
  }

  private _sectionTemplate(description: ToolSection): TemplateResult {
    return html`
      <section class="text-gray-600 body-font">
        <div class="container px-2 py-2 mx-auto flex flex-wrap">
          <div class="flex flex-wrap mt-auto mb-auto content-start">
            <div class="w-full sm:p-4 px-4">
              <h1 class="title-font font-medium text-xl mb-2 text-gray-900">
                ${description.name}
              </h1>
              <div class="leading-relaxed">${description.explain}</div>
              <div class="pt-4 pb-3 space-y-1">
                <ul>
                  ${description.links.map((link) => {
                    return html`
                      <li>
                        <a
                          target="_blank"
                          rel="noopener"
                          href="${link.href}"
                          class="text-base font-medium"
                          >${link.name}</a
                        >
                      </li>
                    `;
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  render() {
    return html`
      <section
        class="container mx-auto px-2 py-4 text-gray-700 body-font border-t border-gray-200"
      >
        <h1 class="text-xl ml-4 mb-4 pt-6 pb-6">${msg('Terra tools')}</h1>

        ${this.sections.map((section) => {
          return this._sectionTemplate(section);
        })}

        <section class="text-gray-600 body-font">
          <div class="container px-5 py-6 mx-auto">
            <div class="xl:w-1/2 lg:w-3/4 w-full mx-auto text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                class="inline-block w-8 h-8 text-gray-400 mb-8"
                viewBox="0 0 975.036 975.036"
              >
                <path
                  d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"
                ></path>
              </svg>
              <p class="leading-relaxed text-lg">
                ${msg(`To understand why Luna could appreciate over time, you need to
                understand a few things. The first thing is to understand
                the relationship between the market cap of UST and the price of
                Luna. The second piece of the puzzle is to understand all
                of the different ways demand is being created for the adoption
                and use of UST. When you put those two pieces together,
                you will understand why Luna could continue to appreciate in
                value over time. These are the tools that I personally use
                to watch the ecosystem around Terra. If you have any
                questions, please come find me in the`)}
                <a
                  class="text-gray-500 hover:text-gray-700"
                  href="https://t.me/lunaorbitchat"
                  target="_blank"
                  rel="noopener"
                  >${msg('Luna Orbit chat room on Telegram')}</a
                >.
              </p>
              <span
                class="inline-block h-1 w-10 rounded bg-indigo-500 mt-8 mb-6"
              ></span>
              <h2
                class="text-gray-900 font-medium title-font tracking-wider text-sm"
              >
                ${msg('Justin')}
              </h2>
            </div>
          </div>
        </section>
      </section>

      <div
        class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between"
      >
        <h2
          class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
        >
          <span class="block terra-color">${msg('We are here to help.')}</span>
        </h2>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <a
              href="contact"
              class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white terra-bg"
            >
              ${msg('Contact')}
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-tools': XTools;
  }
}
