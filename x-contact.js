var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, customElement, LitElement, query } from 'lit-element';
import config from './config';
/**
 * Contact component
 */
let XContact = class XContact extends LitElement {
    createRenderRoot() {
        return this;
    }
    firstUpdated() {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const data = new FormData(form);
            fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    Accept: 'application/json',
                },
            })
                .then((_response) => {
                this.status.innerText = 'Thanks for your submission!';
                form.classList.add('opacity-50', 'pointer-events-none');
            })
                .catch((_err) => {
                this.status.innerText =
                    'Oops! There was a problem submitting your form';
            });
        });
    }
    render() {
        return html `
    <section class="text-gray-600 body-font relative">
      <div class="absolute inset-0 bg-gray-300">
        <img class="w-full h-full" src="moon.jpeg" alt="lunaorbit" />
      </div>
      <div class="container px-5 py-24 mx-auto flex">
        <div class="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
          <h2 class="text-gray-900 text-lg mb-6 font-medium title-font">Contact us</h2>
          <form
            id="contact-form"
            action="${config.formspree}"
            method="POST"
          >
            <div class="relative mb-4">
              <label for="email" class="leading-7 text-sm text-gray-600">Email</label>
              <input type="email" id="email" name="email" class="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
            </div>
            <div class="relative mb-4">
              <label for="message" class="leading-7 text-sm text-gray-600">Comment</label>
              <textarea id="message" name="message" class="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
            </div>
            <button type="submit" class="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg">Send</button>
            <p id="status" class="font-semibold"></p>
            <p class="text-md mt-3">Find us on <a href="http://t.me/${config.telegram}" target="_blank" title="Telegram" class="text-gray-500 hover:text-indigo-500">Telegram</a> or <a class="text-gray-500 hover:text-indigo-500" href="https://twitter.com/${config.twitter}" target="_blank" title="Twitter">Twitter.</p>
        </form>
        </div>
      </div>
    </section>
    `;
    }
};
__decorate([
    query('#contact-form')
], XContact.prototype, "contactForm", void 0);
__decorate([
    query('#status')
], XContact.prototype, "status", void 0);
XContact = __decorate([
    customElement('x-contact')
], XContact);
export { XContact };
//# sourceMappingURL=x-contact.js.map