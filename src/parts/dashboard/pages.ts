import {
  html,
  customElement,
  LitElement,
  TemplateResult,
  property,
} from 'lit-element';

import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element.js';
import { deleteFile, getFile, putFile } from '../../storage';

import EditorJS, { LogLevels } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import SimpleImage from '@editorjs/simple-image'; 
import RawTool from '@editorjs/raw'; 
import Link from '@editorjs/link'; 
import Checklist from '@editorjs/checklist'; 
import NestedList from '@editorjs/nested-list';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';

import edjsParser from 'editorjs-parser';

/**
 * Pages component
 */
@customElement('website-pages')
export class WebsitePages extends Localized(LitElement) {

  @property({ type: Object })
  public editor: EditorJS | null = null;

  @property({ type: String })
  public lang = 'en';

  @property({ type: String })
  public page = 'home';

  private _data: undefined;

  createRenderRoot(): this {
    return this;
  }

  async loadEditor(): Promise<void> {
    const editorHolder = this.querySelector('#holder') as HTMLDivElement;
    const editorInit = {
      holder: editorHolder,
      tools: {
        header: {
          class: Header,
          inlineToolbar: ['link']
        },
        list: {
          class: NestedList,
          inlineToolbar: true
        },
        image: SimpleImage,
        raw: {
          class: RawTool
        },
        link: {
          class: Link,
        },
        checklist: {
          class: Checklist
        },
        marker: {
          class: Marker,
          shortcut: 'CMD+SHIFT+M',
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+O',
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote\'s author',
          },
        },
        delimiter: Delimiter,
      },
      autofocus: true,
      placeholder: msg('Let`s write an awesome story!'),
      logLevel: 'VERBOSE' as LogLevels,
      onReady: () => {
        // console.log('Editor.js is ready to work!');
      },
      onChange: () => {
        // console.log('Now I know that Editor\'s content changed!');
      },
      data: undefined,
    };

    if (editorHolder) {
      this.editor?.destroy();

      try {
        const savedTest = await getFile(this.editedPage, {
          decrypt: false
        });
        const data = JSON.parse(savedTest as string);
        this._data = data;
        editorInit.data = this._data;
      } catch (err) {
        editorInit.data = undefined;
        // console.error('no page found', err);
      }

      this.editor = new EditorJS(editorInit);
    }
  }

  async firstUpdated(): Promise<void> {
    await this.loadEditor();

    const parser = new edjsParser({
      image: {
        use: "figure",
        imgClass: "img",
        figureClass: "fig-img",
        figCapClass: "fig-cap",
        path: "absolute",
      },
      paragraph: {
        pClass: "paragraph",
      },
      code: {
        codeBlockClass: "code-block",
      },
      embed: {
        useProvidedLength: false,
      },
      quote: {
        applyAlignment: false,
      },
    });

    const markup = parser.parse(this._data);
    console.warn(markup);
  }

  public get editedPage(): string {
    return `page-${this.page}-${this.lang}.json`;
  }

  render(): TemplateResult {
    return html`
        <div class="flex justify-between ml-4 mb-4 pb-6">
          <h1 class="text-xl">
            ${msg('Pages')}
          </h1>
          <div class="flex justify-between gap-2">
            <div class="relative">
              <select
                  @change=${async (event: Event) => {
                    this.lang = (event.target as HTMLSelectElement).value;
                    await this.loadEditor();
                  }}
                  class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-7"
                >
                  <option value="en">EN</option>
                  <option value="fr">FR</option>
              </select>
              <select
                @change=${async (event: Event) => {
                  this.page = (event.target as HTMLSelectElement).value;
                  await this.loadEditor();
                }}
                class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-7"
              >
                <option value="home">Staking</option>
                <option value="how-to">How to</option>
                <option value="tools">Tools</option>
                <option value="contact">Contact</option>
              </select>
              <span
                class="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </div>
            <button @click=${async () => {
              const outputData = await this.editor?.save();
              const savedTest = await putFile(this.editedPage, JSON.stringify(outputData), {
                contentType: 'text/html',
                encrypt: false,
                dangerouslyIgnoreEtag: false
              });
          
              console.warn(savedTest);
            }} class="bg-blue-500 hover:terra-bg text-white py-2 px-4 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </button>
            <button @click=${async () => {
              console.warn('will add page.');
            }} class="bg-blue-500 hover:terra-bg text-white py-2 px-4 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button @click=${async () => {
              console.warn('will drop page.');
              await deleteFile(this.editedPage);
              this.loadEditor();
            }} class="bg-blue-500 hover:terra-bg text-white py-2 px-4 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>

        <div id="holder" class="w-full p-4 border-4 rounded-sm"></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'website-pages': WebsitePages;
  }
}
