import {
  html,
  customElement,
  LitElement,
  internalProperty,
  TemplateResult,
  property,
} from 'lit-element';
import {msg} from '@lit/localize';
import { Localized } from '@lit/localize/localized-element.js';

import '../components/cta-hero';
import { CTA, ctaForPage, loadSteps, Step } from '../backend';
import { retrieveSupabase } from '../luna-orbit';

/**
 * How to choose a validator component
 */
@customElement('x-how-to')
export class XHowTo extends Localized(LitElement) {
  @internalProperty()
  private step = '0';

  @property({ type: Boolean })
  public loading = false;

  @internalProperty()
  private _cta: CTA | null = null;
  @internalProperty()
  private _steps: Step[] | null = null;

  createRenderRoot(): this {
    return this;
  }

  async firstUpdated(): Promise<void> {
    const db = retrieveSupabase();

    this.loading = true;

    this._steps = await loadSteps(db);
    this._cta = await ctaForPage(db, 'how-to');

    this.loading = false;
  }

  private _onTabClick(e: Event) {
    const item = e.target as HTMLElement;
    if (item.dataset.img) {
      this.step = item.dataset.img;
    }
  }

  private _glossaryItem(title: string, text: string): TemplateResult {
    return html`
      <a class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50">
        <div class="ml-4">
          <p class="text-base font-medium text-gray-900">
            ${title}
          </p>
          <p class="mt-1 text-md text-gray-500">
            ${text}
          </p>
        </div>
      </a>
    `;
  }

  private _tabItem(title: string, img: string, active?: boolean) {
    return html`
      <li class="mr-1">
        <a
          data-img="${img}"
          class="cursor-pointer	bg-white inline-block rounded-t py-2 px-4 ${active ? 'active font-semibold border-l border-t border-r text-blue-800' : ''}"
          >
          ${title}
        </a>
      </li>
    `;
  }

  render(): TemplateResult {
    const glossaryItems = [
      {
        title: msg('Voting power'),
        text: msg(`This is the amount of Luna that has been validated to this node. For the sake of decentralization, it is better if this number is lower. If any one node has too much voting power, they have too much influence over voting.`),
      },
      {
        title: msg('Self-delegation'),
        text: msg(`This is skin in the game, but the number reported here is often not correct. For Luna Orbit, I am currently 10% self delegated (as of March 2021) but will be 25% within a month. If you find skin in the game important, I recommend reaching out to the validator to ask them the accurate number they have delegated.`),
      },
      {
        title: msg('Validator commission'),
        text: msg(`
          This is currently the only way a validator makes money and it
          comes out of rewards. For example, at a rate of commission at
          5% and a reward of 1 Luna, a delegator would receive .95 Luna
          and the validator would receive .05 Luna. Luna Orbit utilizes
          enterprise grade hosting that should ensure maximum
          reliability and performance but it comes at a cost. Delegators
          must decide if reliability and performance is important to
          them or if lower cost validators are worth the risk.
        `),
      },
      {
        title: msg('Delegation return'),
        text: msg(`
        This is the current annual return you can expect from staking
        with this validator. Keep in mind that validators that are new
        (less than 30 days) might show different actual rates. This
        does not mean that a new delegator making 12% is better than
        an established validator making 8%, it just means the returns
        have gone up recently and the numbers fail to fairly represent
        the true picture for delegation return. However - Do Kwon has
        said that oracle performance will have a major impact on
        delegation returns so pay attention to the performance of your
        validators at this website (Look at http://terra.stake.id and
        check the column "Missed Oracle Votes" to get an idea of
        performance).
        `),
      },
      {
        title: msg('Uptime'),
        text: msg(`
        This might be the most important on the list, you want the
        maximum amount of uptime. Anything less can lead to small
        penalties "slashing" to "jailing" . A small penalty is .01%
        while jailing would cut off rewards until you redelegate or
        the node fixes the issues. You want to choose a node that is
        reliable if you want good uptime.
        `),
      },
      {
        title: msg('The Blue check mark'),
        text: msg('This means the validator has submitted a profile on github. This is cosmetic only and has no effect on anything.'),
      },
      {
        title: msg('Other considerations'),
        text: msg(`
          Some validators are active in the community and help people
          out, some are building useful tools, some are high end for
          reliability, and some people just want to make sure they
          support the smaller validators in order to decentralize. There
          could be any number of reasons to choose particular validators
          and they all have an incentive to help you and the Terra eco
          system!
        `),
      },
    ];

    return html`
      <section
        class="container mx-auto px-2 py-4 text-gray-700 body-font border-t border-gray-200"
      >
        <h1 class="text-xl ml-4 mb-4 pt-6 pb-6">
          ${msg('How to start staking on Terra ?')}
        </h1>
        <ul
          class="list-reset flex border-b"
          @click=${this._onTabClick}
        >
          ${this._steps && this._steps.map(item => {
            return this._tabItem(item.title, item.img, this.step === item.img);
          })}          
        </ul>
        
        <div class="p-4" id="tabs">
          <img src=${`/assets/${this.step}.png`} alt="download terra station" />
        </div>

        <div
          class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
        >
          <div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
            <h2 class="text-md pointer-events-none">${msg('Glossary')}</h2>
            ${glossaryItems.map(item => {
              return this._glossaryItem(item.title, item.text)
            })}
          </div>
        </div>
        ${this._cta ? html`
        <cta-hero .title=${this._cta.title} href=${this._cta.href} .ctaText=${this._cta['cta-text']}></cta-hero>
        ` : html``}
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-how-to': XHowTo;
  }
}
