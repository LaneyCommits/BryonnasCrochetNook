# Bryonna's Crochet Nook

A small-business website for **Bryonna's Crochet Nook** — handmade crochet plushies, headbands, beanies, bracelets, keychains, and more.

## Why this project is useful

This repo gives a small crochet business a real online presence. Instead of only selling on Etsy, the shop gets its own site to show off products, tell its story, and take custom orders in one place. The site can run as a full Django app (with a database and admin) or be exported as static HTML and hosted for free on GitHub Pages — no server needed.

## What you can do with it

- **Browse the shop** — See plushies, wearables, and accessories with links to the Etsy shop.
- **Read the story** — The About page shares Bryonna’s Crochet Nook’s story and photos.
- **Request custom orders** — Customers can submit a form to ask for custom pieces; submissions are saved and can be emailed to the shop when configured.
- **Run it locally** — Develop or preview the site on your machine with Django.
- **Deploy to the web** — Export to static files and publish on GitHub Pages.

**Live site:** [laney3503.github.io/BryonnasCrochetNook](https://laney3503.github.io/BryonnasCrochetNook/)

## How to use it

### Tech overview

- **Django** — Serves the pages, handles the custom-order form (saves to SQLite, optional email to Gmail), and provides an admin to view orders.
- **Static export** — The same site can be exported to plain HTML/CSS/JS in the `docs/` folder for GitHub Pages (no server required).

### Running locally

```bash
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Edit .env: add BCN_EMAIL_APP_PASSWORD for order emails
python manage.py migrate
python manage.py createsuperuser
./serve
```

Open **http://127.0.0.1:8000** for the site and **http://127.0.0.1:8000/admin/** to view custom orders.

### Updating the live (GitHub Pages) site

After changing templates or static files, regenerate the static export and push:

```bash
source venv/bin/activate
python manage.py export_static
git add docs/
git commit -m "Update static site"
git push
```

GitHub Pages should be set to **Source: Deploy from a branch** → **main** → **/docs**.

### Sending custom order forms to Bryonna via email

**Django (local or hosted server):** Set `BCN_EMAIL_APP_PASSWORD` in `.env` (see above). Submissions are saved to the database and emailed to `bcn.shop24@gmail.com`.

**Static site (GitHub Pages):** There is no backend on GitHub Pages, so use [Formspree](https://formspree.io) to receive form submissions by email:

1. Create a free account at [formspree.io](https://formspree.io).
2. Create a new form and set the notification email to `bcn.shop24@gmail.com`.
3. Copy your form endpoint (e.g. `https://formspree.io/f/xxxxxxxx`).
4. When exporting, set the env var so the form posts to Formspree:
   ```bash
   STATIC_EXPORT_FORM_URL=https://formspree.io/f/YOUR_FORM_ID python manage.py export_static
   ```
5. Push the updated `docs/` folder. Form submissions will be emailed to Bryonna.
