import {html, customElement, LitElement, query, TemplateResult} from 'lit-element';
import config from './config';

import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element.js';

/**
 * Contact component
 */
@customElement('x-contact')
export class XContact extends Localized(LitElement) {
  @query('#contact-form')
  public contactForm!: HTMLFormElement;

  @query('#status')
  public status!: HTMLParagraphElement;

  createRenderRoot(): this {
    return this;
  }

  firstUpdated(): void {
    this.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;

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

  render(): TemplateResult {
    return html`
    <section class="text-gray-600 body-font relative">
      <div class="absolute inset-0 bg-gray-300">
        <img class="w-full h-full object-cover" src="assets/moon.jpeg" alt="Moon" width="600" height="292">
      </div>
      <div class="container px-5 py-24 mx-auto flex">
        <div class="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
          <h2 class="text-gray-900 text-lg mb-6 font-medium title-font">${msg(
            'Contact us'
          )}</h2>
          <form
            id="contact-form"
            action="${config.formspree}"
            method="POST"
          >
            <div class="relative mb-4">
              <label for="email" class="leading-7 text-sm text-gray-600">${msg(
                'Email'
              )}</label>
              <input type="email" id="email" name="email" class="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out">
            </div>
            <div class="relative mb-4">
              <label for="message" class="leading-7 text-sm text-gray-600">${msg(
                'Comment'
              )}</label>
              <textarea id="message" name="message" class="w-full bg-white rounded border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
            </div>
            <button type="submit" class="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg">${msg(
              'Send'
            )}</button>
            <p id="status" class="font-semibold"></p>
            <p class="text-md mt-3">${msg('Find us on')} <a href="http://t.me/${config.telegram}" target="_blank" rel="noopener" title="Telegram" class="text-gray-500 hover:text-indigo-500">Telegram</a> ${msg('or')} 
            <a class="text-gray-500 hover:text-indigo-500" href="https://twitter.com/${config.twitter}" target="_blank" rel="noopener" title="Twitter">Twitter</a>.</p>
        </form>
        </div>
      </div>
    </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-contact': XContact;
  }
}
