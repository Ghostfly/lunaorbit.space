var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, customElement, LitElement, internalProperty } from 'lit-element';
/**
 * How to choose a validator component
 */
let XHowTo = class XHowTo extends LitElement {
    constructor() {
        super(...arguments);
        this.step = '0';
    }
    createRenderRoot() {
        return this;
    }
    render() {
        return html `
      <section
        class="container mx-auto px-2 py-4 text-gray-700 body-font border-t border-gray-200"
      >
        <h1 class="text-xl ml-4 mb-4 pt-6 pb-6">
          How to start staking on Terra ?
        </h1>
        <ul
          class="list-reset flex border-b"
          @click=${(e) => {
            const activeElements = e.currentTarget.querySelectorAll('.active');
            for (const activeElement of Array.from(activeElements)) {
                activeElement.classList.remove('active', 'font-semibold', 'border-l', 'border-t', 'border-r', 'text-blue-800');
            }
            const item = e.target;
            if (item.dataset.img) {
                this.step = item.dataset.img;
                item.classList.add('active', 'font-semibold', 'border-l', 'border-t', 'border-r', 'text-blue-800');
            }
        }}
        >
          <li class="mr-1">
            <a
              data-img="0"
              class="cursor-pointer	active bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-800 font-semibold"
              >Download Terra Station</a
            >
          </li>
          <li class="mr-1">
            <a
              data-img="1"
              class="cursor-pointer	bg-white inline-block py-2 px-4 hover:text-blue-800"
              >Choose the validator</a
            >
          </li>
          <li class="mr-1">
            <a
              data-img="2"
              class="cursor-pointer	bg-white inline-block py-2 px-4 hover:text-blue-800"
              >Delegate tokens</a
            >
          </li>
        </ul>
        <div class="p-4" id="tabs">
          <img .src=${`${this.step}.png`} alt="download terra station" />
        </div>

        <div
          class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
        >
          <div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
            <h2 class="text-md pointer-events-none">Glossary</h2>
            <a class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50">
              <div class="ml-4">
                <p class="text-base font-medium text-gray-900">
                  Voting power
                </p>
                <p class="mt-1 text-md text-gray-500">
                  This is the amount of Luna that has been validated to this
                  node. For the sake of decentralization, it is better if this
                  number is lower. If any one node has too much voting power,
                  they have too much influence over voting.
                </p>
              </div>
            </a>

            <a class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50">
              <div class="ml-4">
                <p class="text-base font-medium text-gray-900">
                  Self-delegation
                </p>
                <p class="mt-1 text-md text-gray-500">
                  This is skin in the game, but the number reported here is
                  often not correct. For Luna Orbit, I am currently 10% self
                  delegated (as of March 2021) but will be 25% within a month.
                  If you find skin in the game important, I recommend reaching
                  out to the validator to ask them the accurate number they have
                  delegated.
                </p>
              </div>
            </a>

            <a class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50">
              <div class="ml-4">
                <p class="text-base font-medium text-gray-900">
                  Validator commission
                </p>
                <p class="mt-1 text-md text-gray-500">
                  This is currently the only way a validator makes money and it
                  comes out of rewards. For example, at a rate of commission at
                  5% and a reward of 1 Luna, a delegator would receive .95 Luna
                  and the validator would receive .05 Luna. Luna Orbit utilizes
                  enterprise grade hosting that should ensure maximum
                  reliability and performance but it comes at a cost. Delegators
                  must decide if reliability and performance is important to
                  them or if lower cost validators are worth the risk.
                </p>
              </div>
            </a>

            <a class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50">
              <div class="ml-4">
                <p class="text-base font-medium text-gray-900">
                  Delegation return
                </p>
                <p class="mt-1 text-sm text-gray-500">
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
                </p>
              </div>
            </a>

            <a class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50">
              <div class="ml-4">
                <p class="text-base font-medium text-gray-900">
                  Uptime
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  This might be the most important on the list, you want the
                  maximum amount of uptime. Anything less can lead to small
                  penalties "slashing" to "jailing" . A small penalty is .01%
                  while jailing would cut off rewards until you redelegate or
                  the node fixes the issues. You want to choose a node that is
                  reliable if you want good uptime.
                </p>
              </div>
            </a>

            <a class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50">
              <div class="ml-4">
                <p class="text-base font-medium text-gray-900">
                  The Blue check mark
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  This means the validator has submitted a profile on github.
                  This is cosmetic only and has no effect on anything.
                </p>
              </div>
            </a>

            <a class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50">
              <div class="ml-4">
                <p class="text-base font-medium text-gray-900">
                  Other considerations
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  Some validators are active in the community and help people
                  out, some are building useful tools, some are high end for
                  reliability, and some people just want to make sure they
                  support the smaller validators in order to decentralize. There
                  could be any number of reasons to choose particular validators
                  and they all have an incentive to help you and the Terra eco
                  system!
                </p>
              </div>
            </a>
          </div>
        </div>

        <div
          class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between"
        >
          <h2
            class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            <span class="block terra-color">Discover & Understand Terra</span>
          </h2>
          <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div class="inline-flex rounded-md shadow">
              <a
                href="tools"
                class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white terra-bg"
              >
                Tools
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
    }
};
__decorate([
    internalProperty()
], XHowTo.prototype, "step", void 0);
XHowTo = __decorate([
    customElement('x-how-to')
], XHowTo);
export { XHowTo };
//# sourceMappingURL=x-how-to.js.map