import {
  html,
  customElement,
  property,
  TemplateResult,
  state,
  LitElement,
} from 'lit-element';
import {LunaPriceResponse, Validator} from './terra/terra-min';
import {Router, RouterLocation} from '@vaadin/router';

import './styles.css';

import '@material/mwc-circular-progress';

import './components/x-components';
import './parts/x-parts';

import {setLocaleFromUrl} from './localization';
import {BannerMessage} from './components/banner-message';

import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {WebsiteSettingsDB} from './parts/dashboard/settings';
import { loadMenu } from './backend';

import Modernizr from 'modernizr';

let supported = true;
for (const feature in Modernizr) {
  if (typeof (Modernizr as never)[feature] === "boolean" && (Modernizr as never)[feature] == false) {
    supported = false;
    break;
  }
}

if (!supported) {
  document.body.innerHTML = `
  <style>
*,:after,:before{box-sizing:border-box}body{display:flex;justify-content:center;align-items:center;min-height:100vh;font:300 14px/1.3 Lato,sans-serif;color:#444}#outdated-browser{position:relative;max-width:850px;margin:10px;text-align:center;padding:30px 40px;font-size:18px;box-shadow:0 0 50px rgba(81,98,137,.4)}#outdated-browser h2{display:flex;align-items:center;justify-content:center;margin:20px -20px 40px -20px;font-weight:700;color:#516289}#outdated-browser h2:after,#outdated-browser h2:before{content:' ';background:#516289;height:1px;flex:1 1 auto;margin:0 20px}#outdated-browser a{color:#06d;text-decoration:none}#outdated-browser a:hover{text-decoration:underline}#outdated-browser nav ul{margin:30px -15px;padding:0;list-style:none;display:flex;flex-wrap:wrap;justify-content:center}#outdated-browser nav ul li{width:150px;margin:0;padding:0 15px;list-style:none}#outdated-browser nav ul li a{display:block}#outdated-browser nav ul li a .image{height:150px;display:flex;align-items:center;justify-content:center;background-size:contain;background-position:50% 50%;background-repeat:no-repeat;opacity:.8;transition:all .15s linear}#outdated-browser nav ul li a .image .text{padding:5px;background-color:rgba(0,0,0,.8);font-size:15px;text-shadow:none;opacity:0;color:#fff;border-radius:3px;transition:all .2s linear}#outdated-browser nav ul li a:hover{text-decoration:none}#outdated-browser nav ul li a:hover .image{opacity:1;transform:scale(1.1);transition:all .15s linear}#outdated-browser nav ul li a:hover .image .text{opacity:1;transition:all .2s linear}#outdated-browser nav ul li.browser-chrome a .image{background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 data-icon=%27browser-type-chrome%27 width=%27128%27 height=%27128%27 fill=%27url%28%23Gradient1%29%27 data-container-transform=%27translate%280 %29 scale%281 1 %29%27 viewBox=%270 0 128 128%27%3E%3Cdefs%3E%3ClinearGradient id=%27Gradient1%27 x1=%270%27 y1=%271%27 x2=%271%27 y2=%270%27%3E%3Cstop offset=%270%%27 stop-color=%27hsla(197.30769230769232,100%,43%,1)%27/%3E%3Cstop offset=%27100%%27 stop-color=%27hsla(227.30769230769232,100%,43%,1)%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d=%27M64 0C43.638 0 25.503 9.524 13.78 24.344l18.282 32.094c3.413-14.554 16.45-25.25 31.938-25.25h54.97C107.792 12.504 87.353 0 64 0zM8.28 32.47C3.005 41.773 0 52.537 0 64c0 32.01 23.5 58.527 54.188 63.25L73.126 95.5A33.055 33.055 0 0 1 64 96.813c-11.865 0-22.824-6.45-28.624-16.813L8.282 32.47zM64 40c-13.234 0-24 10.766-24 24 0 4.1 1.044 8.135 3.03 11.688C47.284 83.276 55.323 88 64 88c8.077 0 15.566-4.037 20.03-10.78A23.92 23.92 0 0 0 88 64c0-13.233-10.766-24-24-24zm22.344 0a32.648 32.648 0 0 1 10.47 24 32.65 32.65 0 0 1-5.376 17.97L64 128c35.346 0 64-28.654 64-64a63.78 63.78 0 0 0-4.656-24h-37z%27/%3E%3C/svg%3E")}#outdated-browser nav ul li.browser-firefox a .image{background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 data-icon=%27browser-type-firefox%27 width=%27128%27 height=%27128%27 fill=%27url%28%23Gradient1%29%27 data-container-transform=%27translate%280 2 %29 scale%281 1 %29%27 viewBox=%270 0 128 128%27%3E%3Cdefs%3E%3ClinearGradient id=%27Gradient1%27 x1=%270%27 y1=%271%27 x2=%271%27 y2=%270%27%3E%3Cstop offset=%270%%27 stop-color=%27hsla(197.30769230769232,100%,43%,1)%27/%3E%3Cstop offset=%27100%%27 stop-color=%27hsla(227.30769230769232,100%,43%,1)%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d=%27M63.813 2C46.163 2 30.28 9.745 19.375 22c-.822-.9-1.647-1.95-2.375-3.125-.014-.023-.02-.028-.03-.03-.112-.1-.155.433-.25.374-.01-.01-.023-.05-.032-.065-.97-1.745-1.796-4.715-1.875-6.844 0 0-1.586.926-2.625 4.19-.183.577-.305.934-.438 1.25-.017-.07.07-1.01.03-.97-.197.407-.754 1.075-.937 1.813-.138.55-.38.872-.47 1.563-.01-.187-.027-.658-.062-.656-.003-.006-.023.015-.03.032-.366.97-.7 2.05-1 3.25-.062.25-.13.52-.187.78-.01.047-.02.08-.03.126-.01.042-.024.082-.032.125a32.873 32.873 0 0 0-.562 3.625 35.46 35.46 0 0 0-.125 6.375c-.003.348.073.688.063 1-.992 1.367-1.784 2.608-2.313 3.563C3.983 41.978 1.76 47.922 0 57.846c0 0 .033-.145.124-.407-.022.122-.04.247-.063.373 0 0 1.004-3.173 3-6.813C1.554 55.74.394 63.054 1.09 73.908c.006-.068.035-.242.064-.47.008.13-.008.276 0 .407.03-.363.365-3.153 1.188-6.906.4 7.325 2.138 16.327 7.844 26.093 4.348 7.448 15.808 24.744 44.563 31.22-3.158-.91-5.127-2.72-5.127-2.72s10.755 3.45 18.594 3.156c-2.454-.424-2.97-1.626-2.97-1.626s27.897 1.582 37.532-11.563c-3.294 3.855-11.658 4.936-14.814 4.97 4.802-4.413 15.436-4.306 26.938-15.625 6.308-6.212 6.97-10.928 7.656-15.344-.987 5.43-5.892 8.806-11.25 11.814a59.66 59.66 0 0 0 5.22-8.28c1.764-2.127 3.445-4.13 4.625-6.22.32-.568.67-1.252 1.03-2 3.424-6.682 7.06-18.246 5.376-29.28a30.157 30.157 0 0 0-1.28-5.44c-.044-.134-.093-.218-.093-.218s-1.037 3.177-2.438 7.906c.73-6.856.203-14.017-2.19-20.624a37.793 37.793 0 0 0-3.624-7.375c-1.87-3.175-3.966-5.614-5.625-6.75.09.1.16.213.25.314-.225-.21-.343-.313-.343-.313s.114.71.344 1.97c-3.47-5.455-8.75-8.03-8.75-8.03s.26 1.466.657 4.624c-1.218-.973-2.503-1.87-3.844-2.75-.044-.03-.08-.065-.125-.094C90.38 6.786 77.652 2 63.81 2zm0 4c12.588 0 24.18 4.217 33.5 11.313 3.96 4.068 6.198 7.78 7.844 11.25-3.152-3.224-8.574-6.595-12.22-6.875 5.468 4.066 14.63 16.134 13.657 34.406-1.402-2.943-3.96-7.544-5.78-9.156 1.96 17.947.222 21.796-.97 26.563-.262-2.19-1.044-3.84-1.5-4.842 0 0-.2 5.603-3.844 13.594-2.76 6.053-5.615 7.932-6.875 7.72-.342-.024-.534-.174-.53-.188.09-.783.176-1.602-.032-2.125 0 0-1.155.412-1.906 1.47a5.69 5.69 0 0 1-1.22 1.217c-.087.068.852-1.183.782-1.125-.455.368-.95.808-1.44 1.313-1.788 1.857-3.41 3.925-4.25 3.344.78-.24 1.425-1.245 1.594-2.22-.703.49-2.502 1.81-6.5 2.406-1.635.244-8.594 1.533-17.844-3.094 1.35-.154 3.37-.63 4.907.28-1.538-1.68-5.24-1.346-7.906-2.187-2.32-.735-5.35-3.98-7.092-5.625 7.12 1.744 14.66.488 19.03-2.5 4.42-3.022 7.06-5.24 9.407-4.72 2.343.525 3.888-1.814 2.063-3.905-1.82-2.092-6.213-4.914-12.22-3.406-4.597 1.15-8.54 4.844-15 2.28-.39-.155-.774-.358-1.187-.563-.41-.205 1.34.257.907 0-1.24-.457-3.502-1.483-4.063-1.875-.092-.068.95.19.844.125-6.13-3.626-5.75-6.548-5.75-8.344 0-1.435.893-3.37 2.53-4.28.885.315 1.44.594 1.44.594s-.43-.633-.69-.938c.06-.023.125-.014.19-.03.72.242 2.363.834 3.187 1.25 1.115.56 1.47 1.123 1.47 1.123s.27-.148 0-.72c-.113-.238-.522-.954-1.626-1.624.02-.003.05.002.062 0 .58.23 1.198.52 1.876.905.21-.983.63-2 .344-3.78-.2-1.255-.186-1.577-.5-2.032-.27-.39.084-.57.5-.22a5.266 5.266 0 0 0-.344-.78c.012-.004.024-.026.03-.063 1.91-2.314 9.543-5.853 11.25-7.656.186-.195.335-.347.47-.5.998-.753 1.437-1.46 1.875-2.53.446-1.087.958-3.653-.5-4.188-1.2-.287-2.224-.506-4.155-.47-1.494-.09-3.484-.116-6.156-.093-2.688.02-4.444-1.54-5.5-3.032-.214-.323-.393-.627-.564-.905a9.844 9.844 0 0 1-.53-1.094c1.173-4.26 3.546-7.97 7.218-10.97.222-.184-.895.138-.688-.06.248-.234 1.803-.96 2.094-1.126.377-.21-1.67-.772-3.438-.405-1.774.366-2.117.557-3.03 1.03.37-.384 1.545-.97 1.25-.906-1.927.432-4.19 1.695-6.126 3.063a2.352 2.352 0 0 1 .03-.594c-.912.473-3.093 2.17-3.655 3.468 0-.28.005-.435-.03-.75a13.288 13.288 0 0 0-1.78 2c-.007.01-.026.02-.032.03-5.426-1.347-10.064-1.1-14 .033C32.85 13.06 47.526 6 63.814 6z%27/%3E%3C/svg%3E")}#outdated-browser nav ul li.browser-safari a .image{background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 data-icon=%27browser-type-safari%27 width=%27128%27 height=%27128%27 fill=%27url%28%23Gradient1%29%27 data-container-transform=%27translate%280 %29 scale%281 1 %29%27 viewBox=%270 0 128 128%27%3E%3Cdefs%3E%3ClinearGradient id=%27Gradient1%27 x1=%270%27 y1=%271%27 x2=%271%27 y2=%270%27%3E%3Cstop offset=%270%%27 stop-color=%27hsla(197.30769230769232,100%,43%,1)%27/%3E%3Cstop offset=%27100%%27 stop-color=%27hsla(227.30769230769232,100%,43%,1)%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d=%27M64 0C28.654 0 0 28.654 0 64c0 35.346 28.654 64 64 64 35.346 0 64-28.654 64-64 0-35.346-28.654-64-64-64zm0 4c33.084 0 60 26.916 60 60s-26.916 60-60 60S4 97.084 4 64 30.916 4 64 4zm-.72 3.47v11.56h1.44V7.47h-1.44zm-4.124.218l-1.406.125.594 5.875 1.406-.125-.594-5.875zm9.688 0l-.594 5.875 1.406.125.594-5.875-1.406-.125zm-15.188.75l-1.375.28 2.25 11.314 1.377-.28-2.25-11.314zm20.688 0l-2.25 11.313 1.375.283L75.72 8.72l-1.376-.282zM48.28 9.718l-1.374.407 1.72 5.625 1.343-.406-1.69-5.625zm31.44 0l-1.69 5.626 1.345.406 1.72-5.625-1.376-.406zM43.03 11.5l-1.312.563 4.406 10.656 1.313-.533L43.03 11.5zm41.94 0l-4.407 10.688 1.313.53 4.406-10.655-1.313-.563zm-47 2.313l-1.22.688 2.75 5.19 1.25-.656-2.78-5.22zm52.062 0l-2.78 5.22 1.25.655 2.75-5.188-1.22-.688zm-56.844 2.813l-1.188.78L38.438 27l1.156-.78-6.406-9.593zm61.625 0l-6.406 9.594 1.156.78L96 17.408l-1.187-.78zm-66.125 3.25l-1.094.875 3.75 4.565 1.094-.906-3.75-4.53zm70.625 0l-3.75 4.53 1.094.907 3.75-4.563-1.094-.875zm-74.78 3.656l-1 1 8.187 8.188 1-1-8.188-8.188zm79.25.5l-46.69 33.25L24.22 103.97l47.374-32.906 32.188-47.03zM20.75 27.595l-.874 1.094 4.53 3.75.907-1.096-4.563-3.75zm86.5 0l-4.562 3.75.906 1.094 4.53-3.75-.874-1.096zM17.408 32l-.78 1.19 9.593 6.405.78-1.156L17.41 32zm93.188 0L101 38.44l.782 1.155 9.594-6.406-.78-1.19zM14.5 36.75l-.687 1.22 5.22 2.78.655-1.25-5.188-2.75zm99 0l-5.187 2.75.656 1.25 5.217-2.78-.688-1.22zM12.064 41.72l-.563 1.313 10.69 4.406.53-1.315-10.656-4.406zm103.875 0l-10.657 4.406.53 1.313 10.69-4.408-.564-1.313zM10.124 46.908l-.406 1.375 5.623 1.688.406-1.342-5.626-1.72zm107.75 0l-5.625 1.72.406 1.343 5.625-1.686-.404-1.375zM8.72 52.283l-.282 1.375 11.313 2.25.283-1.375-11.313-2.25zm110.562 0l-11.313 2.25.28 1.375 11.312-2.25-.28-1.375zm-111.47 5.47l-.124 1.405 5.875.594.125-1.406-5.875-.594zm112.376 0l-5.875.593.125 1.406 5.875-.594-.125-1.406zm-112.72 5.53v1.438h11.564v-1.436H7.47zm101.5 0v1.438h11.564v-1.436H108.97zm-95.405 4.97l-5.875.593.125 1.406 5.875-.594-.125-1.406zm100.875 0l-.125 1.405 5.875.594.125-1.406-5.875-.594zM19.75 72.095l-11.313 2.25.28 1.375 11.314-2.25-.28-1.374zm88.5 0l-.28 1.375 11.312 2.25.28-1.374-11.312-2.25zm-92.906 5.938l-5.624 1.69.405 1.374 5.625-1.72-.406-1.343zm97.313 0l-.406 1.344 5.627 1.72.406-1.376-5.625-1.687zm-90.47 2.53L11.5 84.973l.563 1.313L22.72 81.88l-.533-1.313zm83.626 0l-.53 1.314 10.655 4.406.563-1.313-10.686-4.405zm-86.78 6.69l-5.22 2.78.688 1.22 5.19-2.75-.656-1.25zm89.937 0l-.656 1.25 5.188 2.75.688-1.22-5.22-2.78zm-82.75 1.155l-9.594 6.405.78 1.188L27 89.564l-.78-1.156zm75.563 0l-.78 1.155L110.596 96l.78-1.187-9.593-6.406zm-5.5 6.874l-1 1 8.188 8.188 1-1-8.186-8.188zm-71.875.28l-4.53 3.75.874 1.095 4.563-3.75-.906-1.095zm79.188 0l-.906 1.095 4.563 3.75.875-1.095-4.53-3.75zm-65.156 5.44l-6.438 9.593 1.188.78 6.406-9.593-1.156-.78zm51.125 0l-1.156.78 6.404 9.594 1.188-.78L89.564 101zm-58.22 1.687l-3.75 4.563 1.095.875 3.75-4.532-1.094-.906zm65.314 0l-1.096.906 3.75 4.53 1.094-.874-3.75-4.563zm-50.533 2.594L41.72 115.94l1.314.564 4.406-10.688-1.312-.53zm35.75 0l-1.313.53 4.406 10.69 1.314-.564-4.406-10.655zm-27.344 2.688l-2.25 11.313 1.375.28 2.25-11.312-1.376-.28zm18.938 0l-1.374.28 2.25 11.314 1.375-.28-2.25-11.314zm-33.97.344l-2.75 5.188 1.22.688 2.78-5.22-1.25-.655zm49 0l-1.25.656 2.783 5.22 1.22-.69-2.75-5.187zm-25.217.656v11.563h1.438v-11.563h-1.437zm-14.656 3.28l-1.72 5.626 1.376.405 1.688-5.625-1.343-.406zm30.75 0l-1.344.407 1.688 5.624 1.376-.406-1.72-5.626zm-21.03 2.064l-.595 5.875 1.406.126.593-5.875-1.405-.124zm11.312 0l-1.407.125.594 5.876 1.406-.125-.594-5.874z%27/%3E%3C/svg%3E")}#outdated-browser nav ul li.browser-edge a .image{background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27612%27 height=%27652.8%27 viewBox=%270 69.6 612 652.8%27 fill=%27url%28%23Gradient1%29%27%3E%3Cdefs%3E%3ClinearGradient id=%27Gradient1%27 x1=%270%27 y1=%271%27 x2=%271%27 y2=%270%27%3E%3Cstop offset=%270%%27 stop-color=%27hsla(197.30769230769232,100%,43%,1)%27/%3E%3Cstop offset=%27100%%27 stop-color=%27hsla(227.30769230769232,100%,43%,1)%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d=%27M192.474 457.2c0 15.708 2.346 29.987 7.14 42.84 5.1 12.647 11.73 23.97 20.196 33.864 8.466 9.894 18.36 18.359 29.988 25.5 11.22 7.14 23.46 13.056 36.516 17.646 12.954 4.692 26.52 8.16 40.29 10.404 13.975 2.244 27.54 3.366 41.311 3.366 17.34 0 33.456-1.326 48.756-4.08 15.3-2.856 30.192-6.63 44.88-11.424 14.688-4.794 28.866-10.507 43.044-17.034a784.467 784.467 0 0 0 43.656-21.624V674.97c-16.626 8.16-32.946 14.994-49.266 20.91-16.32 5.712-32.641 10.71-49.267 14.688-16.626 4.08-33.456 7.14-50.693 8.976-17.238 1.836-34.885 2.856-53.244 2.856-24.48 0-48.145-2.856-70.89-8.467-22.746-5.609-44.064-13.668-64.056-24.275a268.402 268.402 0 0 1-54.876-38.557c-16.728-15.096-30.906-32.13-42.84-51-11.934-18.869-21.114-39.575-27.744-61.812-6.426-22.236-9.69-45.9-9.69-70.992 0-26.826 3.672-52.326 11.016-76.704 7.446-24.48 17.952-46.716 31.824-67.116 13.77-20.4 30.6-38.556 50.49-54.366 19.89-15.811 42.228-28.764 67.116-38.76-13.566 13.566-24.174 29.58-31.62 48.246-7.65 18.564-12.444 37.23-14.586 55.896H422.28c0-23.46-2.347-43.86-7.141-61.404s-12.443-32.13-23.153-43.656c-10.608-11.628-24.276-20.4-41.106-26.112-16.83-5.814-37.128-8.772-60.894-8.772-28.05 0-56.1 4.08-84.15 12.546-28.05 8.16-54.672 19.89-79.968 34.68-25.296 14.994-48.552 32.64-69.768 52.836-21.216 20.4-39.066 42.33-53.55 66.096 3.06-27.54 9.18-54.06 17.646-79.254 8.466-25.194 19.686-48.654 33.15-70.38 13.464-21.42 29.274-41.004 47.328-58.548 18.054-17.544 38.046-32.64 60.18-44.88 22.134-12.24 45.594-22.134 71.094-28.764 25.5-5.814 52.632-9.282 81.192-9.282 16.729 0 33.354 1.53 49.98 4.488 16.626 3.06 32.844 7.14 48.654 12.444 31.416 10.812 59.466 25.908 84.149 45.084 24.684 19.38 45.391 41.412 62.22 66.606 16.83 25.194 29.58 53.04 38.353 83.334 8.771 30.294 13.26 61.812 13.26 94.554v81.09H192.474v.001z%27/%3E%3C/svg%3E")}
  </style>
  <div id="outdated-browser" class="flex flex-col flex-wrap">
    <img class="block h-16 w-auto pointer-events-none" src="/assets/logo-black.svg" alt="LunaOrbit logo"  width="33" height="32">
    <h2>Unsupported Browser</h2>
    <p>Your web browser appears to be outdated. Our website may not look quite right in it.</p>
    <p>Please consider updating your browser to enjoy an optimal experience.</p>
    <nav>
      <ul>
        <li class="browser-chrome"><a href="https://www.google.com/chrome/browser/desktop/" target="_blank">
            <div class="image">
              <div class="text">Google Chrome</div>
            </div></a></li>
        <li class="browser-firefox"><a href="https://www.mozilla.org/en-US/firefox/new/" target="_blank">
            <div class="image">
              <div class="text">Mozilla Firefox</div>
            </div></a></li>
        <li class="browser-safari"><a href="https://support.apple.com/en-us/HT204416" target="_blank">
            <div class="image">
              <div class="text">Apple Safari</div>
            </div></a></li>
        <li class="browser-edge"><a href="https://www.microsoft.com/en-us/windows/microsoft-edge" target="_blank">
            <div class="image">
              <div class="text">Microsoft Edge</div>
            </div></a></li>
      </ul>
    </nav>
  </div>
    `;
}

export function retrieveSupabase(
  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxODk5MDIyNywiZXhwIjoxOTM0NTY2MjI3fQ.Nf1C2uRIocHV2bmfvbUxPGE8MTbRjbB9Kvft4V0dUaI'
): SupabaseClient {
  const supabaseUrl = 'https://ylqcozoikxxipzbvueua.supabase.co';

  return createClient(supabaseUrl, token);
}

/**
 * Luna-orbit
 *
 * @slot - This element has slots
 */
@customElement('luna-orbit')
export class LunaOrbit extends LitElement {
  private mobileMenu!: HTMLDivElement | null;
  private mobileMenuToggle!: HTMLButtonElement | null;

  static APIValidatorURL = 'https://lcd.terra.dev/staking/validators/';
  static APILunaPrice =
    'https://fcd.terra.dev/v1/market/price?denom=uusd&interval=1m';

  @state()
  private validatorInformation?: Validator;
  @state()
  private _commission = 0;

  public router: Router = new Router(document.querySelector('.content'));
  @property({type: Object})
  location = this.router.location;
  @state()
  private _bannerMessage!: BannerMessage;
  @state()
  private _price = 0;

  @state()
  private _supabase: SupabaseClient;
  private _priceInterval: number | null = null;
  private _isRefreshStopped = false;

  constructor() {
    super();

    this._supabase = retrieveSupabase();
    this.mobileMenuToggle = document.querySelector('#mobile-menu-toggle');
    this.mobileMenu = document.querySelector('#mobile-menu');

    this.router.setRoutes([
      {
        path: '',
        component: 'x-home',
      },
      {path: '/', component: 'x-home'},
      {path: '/home', component: 'x-home'},
      {path: '/test', component: 'x-test'},
      {path: '/how-to', component: 'x-how-to'},
      {path: '/tools', component: 'x-tools'},
      {path: '/contact', component: 'x-contact'},
      {path: '/airdrops', component: 'airdrop-dialog'},
      {path: '/bluna', component: 'x-bluna'},
      {path: '/cockpit', component: 'x-admin'},
      {path: '/cockpit/:page', component: 'x-admin'},
      {path: '(.*)', component: 'x-404'},
    ]);

    window.addEventListener(
      'vaadin-router-location-changed',
      this._routerLocationChanged.bind(this)
    );
  }

  public async showAirdropDialog(): Promise<void> {
    document.body.appendChild(document.createElement('airdrop-dialog'));
  }

  public async updateBannerMessage(): Promise<void> {
    if (sessionStorage.getItem('lunaorbit-banner-hide')) {
      return;
    }

    const queryBuilder = this._supabase.from<WebsiteSettingsDB>('settings');
    const enabledReq = queryBuilder
      .select('name, value, type')
      .eq('name', 'announcement-visible');
    const settings = (await enabledReq).data;

    if (settings && settings[0].value == 'true') {
      const queryBuilder = this._supabase.from<WebsiteSettingsDB>('settings');
      const query = queryBuilder
        .select('name, value, type')
        .eq('name', 'announcement');

      const settingDetail = (await query).data;
      if (!settingDetail) {
        return;
      }

      const banners = document.querySelectorAll('banner-message');
      for (const banner of banners) {
        banner.parentElement?.removeChild(banner);
      }

      const bannerNode = document.createElement('banner-message');
      bannerNode.message = settingDetail[0].value;

      bannerNode.addEventListener('click', function () {
        bannerNode.parentElement?.removeChild(bannerNode);
        sessionStorage.setItem('lunaorbit-banner-hide', 'true');
      });

      document.body.insertBefore(bannerNode, document.body.firstChild);
    }
  }

  private async _showAirdropToast() {
    if (sessionStorage.getItem('lunaorbit-airdrops-hide')) {
      return;
    }

    const queryBuilder = this._supabase.from<WebsiteSettingsDB>('settings');
    const enabledReq = queryBuilder
      .select('name, value, type')
      .eq('name', 'airdrop-balloon-visible');
    const settings = (await enabledReq).data;
    if (settings && settings[0].value == 'true') {
      const hasToast = this.shadowRoot?.querySelector('airdrop-toast');
      if (hasToast) {
        hasToast.parentElement?.removeChild(hasToast);
      }

      this.shadowRoot?.appendChild(document.createElement('airdrop-toast'));
    }
  }

  async firstUpdated(): Promise<void> {
    await Promise.all([
      setLocaleFromUrl(),
      this._setupMenus(),
      this.updateBannerMessage(),
      this._showAirdropToast(),
      this._retrieveCommissionAndPrice(),
    ]);

    this._handleMobileMenu();
  }

  private async _setupMenus() {
    const menuHolders = document.querySelectorAll('.menu-holder');

    const menuItems = await loadMenu(this._supabase);
    const links = [];
    if (menuItems) {
      for (const menuItem of menuItems) {
        links.push(menuItem);
      }
    }

    for (const menuHolder of menuHolders) {
      for (const link of links) {
        const elem = document.createElement('a');
        elem.href = link.url;
        elem.className =
          link.class ??
          'text-gray-300 hover:text-white block px-3 py-2 text-base font-medium';
        elem.innerText = link.name;
        menuHolder.appendChild(elem);
      }

      const elem = document.createElement('a');
      elem.target = '_blank';
      elem.href =
        'https://station.terra.money/validator/terravaloper1p94a6vwl9dkd98cyrlmzf6ydjdgfvamyhu33fa';
      elem.className =
        'text-gray-300 hover:text-white block px-3 py-2 text-base font-medium';
      elem.innerText = 'Delegate';
      menuHolder.appendChild(elem);
    }
  }

  render(): TemplateResult {
    const isWebsite = this.router.location.pathname.indexOf('cockpit') === -1;

    return html`
      ${this._bannerMessage}
      <slot name="nav"></slot>
      <slot name="content"></slot>
      ${isWebsite
        ? html`
            <slot name="equation"></slot>
            <slot name="divider"></slot>
            <slot name="footer"></slot>
          `
        : html``}
    `;
  }

  private _handleMobileMenu(): void {
    if (this.mobileMenuToggle && this.mobileMenu) {
      this.mobileMenuToggle.addEventListener('click', () => {
        if (this.mobileMenu?.style.display == 'none') {
          this.mobileMenu.style.display = 'block';
        } else if (this.mobileMenu) {
          this.mobileMenu.style.display = 'none';
        }
      });
    }
  }

  private async _retrieveCommissionAndPrice(): Promise<void> {
    const operatorAddressQuery = retrieveSupabase()
      .from('settings')
      .select('name, value')
      .eq('name', 'operator-address');
    const operatorSetting = (await operatorAddressQuery).data;
    let operatorAddress = '';
    if (operatorSetting) {
      operatorAddress = operatorSetting[0].value;
    }
    const [priceQuery, validatorQuery] = await Promise.all([
      fetch(LunaOrbit.APILunaPrice),
      fetch(LunaOrbit.APIValidatorURL + operatorAddress),
    ]);

    const price = (await priceQuery.json()) as LunaPriceResponse;
    this._price = price.lastPrice;

    const equation = document.querySelector('x-equation');
    if (equation) {
      equation.price = this._price;
    }

    this.validatorInformation = await validatorQuery.json();

    if (this.validatorInformation) {
      this._commission = parseInt(
        this.validatorInformation.result.commission.commission_rates.rate,
        10
      );

      const footer = document.querySelector('website-footer');
      if (footer) {
        footer.commission = this._commission + '%';
      }
    }

    if (this._isRefreshStopped) {
      return;
    }

    const priceCheck = window.setInterval(async () => {
      const priceReq = await fetch(LunaOrbit.APILunaPrice);
      const price = (await priceReq.json()) as LunaPriceResponse;
      if (this._price == price.lastPrice) {
        return;
      }

      this._price = price.lastPrice;
      const equation = document.querySelector('x-equation');
      if (equation) {
        equation.price = this._price;
      }
    }, 60000);

    this._priceInterval = priceCheck;
  }

  public stopPriceRefesh(): void {
    this._isRefreshStopped = true;
    if (this._priceInterval) {
      window.clearInterval(this._priceInterval);
    }
  }

  private _routerLocationChanged(
    event: CustomEvent<{
      router: Router;
      location: RouterLocation;
    }>
  ): void {
    const page = event.detail.location.route?.path.replace('/', '');
    const selector = `[href='${page}']`;
    const activeLinks = document.querySelectorAll(`a${selector}`);
    const current = document.querySelectorAll('[aria-current=page]');
    for (const currentActive of current) {
      currentActive.classList.remove('text-white');
      currentActive.classList.add('text-gray-300');
      currentActive.removeAttribute('aria-current');
    }

    for (const activeLink of Array.from(activeLinks)) {
      activeLink.setAttribute('aria-current', 'page');
      activeLink.classList.remove('text-gray-300');
      activeLink.classList.add('text-white');
    }

    if (this.mobileMenu) {
      this.mobileMenu.style.display = 'none';
    }

    if (page?.indexOf('cockpit') !== -1) {
      import('./parts/x-admin').then(() => {
        this.requestUpdate();
      });
    }

    this.requestUpdate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'luna-orbit': LunaOrbit;
  }
}
