# write-or-die — Commands Cheat Sheet

A SvelteKit 5 app deployed to Cloudflare via `@sveltejs/adapter-cloudflare`.

- Node: `v24.x` (project tested on v24.13.1)
- Package manager: `npm`

---

## 1. First-time setup

```sh
npm install
```

---

## 2. Run locally

```sh
# start the dev server (http://localhost:5173)
npm run dev

# ...or start it and auto-open the browser
npm run dev -- --open
```

### Preview a production build locally

```sh
npm run build      # output goes to .svelte-kit/cloudflare
npm run preview    # serve the built app locally
```

---

## 3. Quality checks

```sh
npm run lint       # prettier --check + eslint
npm run format     # auto-format with prettier

npm run test       # run unit tests once, then e2e
npm run test:unit  # vitest (watch mode)
npm run test:e2e   # playwright end-to-end tests
```

---

## 4. Deploy to Cloudflare

This project uses `@sveltejs/adapter-cloudflare`, so `npm run build` produces a
Cloudflare-ready bundle in `.svelte-kit/cloudflare`.

There are two ways to deploy. Use whichever you set up before.

### Option A — Git integration (dashboard, no CLI) — most likely what you used

This is the "set it up once and forget it" path: every push to `main` triggers a build.

1. Go to the [Cloudflare dashboard](https://dash.cloudflare.com) → **Workers & Pages**.
2. Select the existing **write-or-die** project (or **Create application → Pages → Connect to Git**).
3. Connect the GitHub repo `eric-akira/write-or-die`.
4. Build settings:
   - **Framework preset:** SvelteKit
   - **Build command:** `npm run build`
   - **Build output directory:** `.svelte-kit/cloudflare`
5. Push to `main` and Cloudflare builds + deploys automatically:

```sh
git push origin main
```

### Option B — Deploy from your machine with Wrangler

`wrangler` is already available (installed via the adapter). First-time auth:

```sh
npx wrangler login
```

Then build and deploy:

```sh
npm run build
npx wrangler pages deploy .svelte-kit/cloudflare
```

> If you originally created a **Workers** project (not Pages), deploy with
> `npx wrangler deploy` instead. That requires a `wrangler.jsonc` with `main`
> and `assets` entries (none exists in this repo yet), which is why the
> dashboard Git integration (Option A) is the most likely route you used.

---

## Quick reference

| Task              | Command                                          |
| ----------------- | ------------------------------------------------ |
| Install deps      | `npm install`                                    |
| Dev server        | `npm run dev`                                     |
| Build             | `npm run build`                                   |
| Preview build     | `npm run preview`                                 |
| Lint / format     | `npm run lint` / `npm run format`                 |
| Tests             | `npm run test`                                    |
| Deploy (CLI)      | `npm run build && npx wrangler pages deploy .svelte-kit/cloudflare` |
| Deploy (Git)      | `git push origin main`                            |
