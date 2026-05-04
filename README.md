# cord

A very simple guitar chord reference. React + TypeScript + Tailwind, deployed to GitHub Pages.

## Develop

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Deploy

Pushes to `main` are deployed to GitHub Pages by `.github/workflows/deploy.yml`.

In the repo settings, set Pages → Source to **GitHub Actions**.

The Vite `base` is set to `/cord/` to match the repository name. If you fork to a different repo name, update `vite.config.ts`.
