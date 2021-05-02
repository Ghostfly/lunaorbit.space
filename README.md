<img src="./src/assets/logo.svg?raw=true" width="250" alt="LunaOrbit Logo" />

# LunaOrbit website

- URL : https://lunaorbit.space

## Setup

Install dependencies:

```bash
npm i
```

## Dev Server

To run the dev server :

```bash
npm run webpack:start
```

You can view the website at http://localhost:3000/.

## Localization

### Extract strings
```bash
npm run localize:extract
```

### Translate
Go to https://xliff.brightec.co.uk/
Upload the xlf file

### Generate strings
```bash
npm run localize:build
```

## Lint

```bash
npm run lint
```

## Prettify

```bash
npm run format
```

## Deploy

```bash
npm run webpack:build
```
