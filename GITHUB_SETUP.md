# GitHub Setup & Deployment

This project is connected to:

- **Repo:** `https://github.com/LaneyCommits/BryonnasCrochetNook`
- **Branch:** `main`
- **Deploy method:** GitHub Pages via GitHub Actions

## 1) Verify remote

```bash
git remote -v
```

Expected:

- `origin https://github.com/LaneyCommits/BryonnasCrochetNook.git (fetch)`
- `origin https://github.com/LaneyCommits/BryonnasCrochetNook.git (push)`

If needed, set it again:

```bash
git remote set-url origin https://github.com/LaneyCommits/BryonnasCrochetNook.git
```

## 2) Push updates

```bash
git add .
git commit -m "Your message"
git push origin main
```

## 3) Enable GitHub Pages (one-time)

In GitHub repository settings:

1. Open **Settings → Pages**
2. Set **Source** to **GitHub Actions**
3. Save

Deployment workflow file:

- `.github/workflows/deploy-pages.yml`

It builds `frontend/` and deploys `frontend/dist` on every push to `main`.

## 4) Confirm deployment

1. Open **Actions** tab in GitHub
2. Verify the latest **Deploy Frontend to GitHub Pages** run is green
3. Open the live URL and hard refresh

## Troubleshooting

- **Blank page or missing styles** — In **Settings → Pages**, ensure **Source** is **GitHub Actions**, not “Deploy from a branch.” Branch-based deploys can serve an old `index.html` or wrong artifact.
- **Homepage still looks like the old Bootstrap / `Shop.htm` site** — That was the legacy static export. It used to live in `/docs` on `main`; it has been moved to `legacy/pre-vite-static-site/` so it is no longer published from `/docs`. Set **Pages → Source** to **GitHub Actions**, let **Deploy Frontend to GitHub Pages** run, then hard refresh. View source: you should see `/assets/index-*.js`, not `static/style.css`.
- **404 on `/assets/...` or wrong layout** — Check `frontend/vite.config.js`: for a **custom domain at the site root**, `base` must be `"/"`. For `https://<user>.github.io/<repo>/` only, use `base: "/<repo>/"`.
- **Site looks old after a green workflow** — Hard refresh or clear cache; confirm you are opening the URL that Pages shows for this repo (custom domain vs `*.github.io`).
