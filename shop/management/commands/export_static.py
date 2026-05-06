"""
Export the site as static HTML and assets for GitHub Pages (or any static host).

Usage:
  python manage.py export_static [--out=docs]

Output:
  - Renders each page via Django and saves HTML with links rewritten for static hosting.
  - Copies static/ into output/static/ so CSS, JS, and images work.

Optional env:
  STATIC_EXPORT_FORM_URL  If set (e.g. a Formspree URL), custom order form in the
                          exported JS will POST to this URL instead of /api/custom-order.
"""
import os
import re
import shutil
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand
from django.test import Client


# Pages to export: (url_path, output_filename)
EXPORT_PAGES = [
    ("/", "index.html"),
    ("/Shop.htm", "Shop.htm"),
    ("/aboutme.htm", "aboutme.htm"),
    ("/customorders.htm", "customorders.htm"),
]


def rewrite_html_for_static(html: str) -> str:
    """Rewrite Django output so it works when served from a static folder (e.g. GitHub Pages)."""
    # Static assets: /static/ -> static/ (relative)
    html = html.replace('"/static/', '"static/').replace("'/static/", "'static/")
    html = re.sub(r'(href|src)=(["\'])/static/', r'\1=\2static/', html)
    # Internal navigation: absolute paths -> relative so they work under /RepoName/
    html = html.replace('href="/"', 'href="index.html"')
    html = html.replace('href="/Shop.htm"', 'href="Shop.htm"')
    html = html.replace('href="/aboutme.htm"', 'href="aboutme.htm"')
    html = html.replace('href="/customorders.htm"', 'href="customorders.htm"')
    return html


class Command(BaseCommand):
    help = "Export the site to static HTML and assets for GitHub Pages or static hosting."

    def add_arguments(self, parser):
        parser.add_argument(
            "--out",
            type=str,
            default="docs",
            help="Output directory (default: docs for GitHub Pages from /docs).",
        )

    def handle(self, *args, **options):
        out_dir = Path(options["out"]).resolve()
        base_dir = settings.BASE_DIR
        static_src = base_dir / "static"

        if not static_src.exists():
            self.stderr.write(self.style.ERROR("static/ directory not found."))
            return

        out_dir.mkdir(parents=True, exist_ok=True)
        client = Client()

        for url_path, filename in EXPORT_PAGES:
            self.stdout.write(f"Exporting {url_path} -> {filename}")
            try:
                response = client.get(url_path)
                if response.status_code != 200:
                    raise RuntimeError(f"Got status {response.status_code}")
                html = response.content.decode("utf-8")
                html = rewrite_html_for_static(html)
                (out_dir / filename).write_text(html, encoding="utf-8")
            except Exception as e:
                self.stderr.write(self.style.ERROR(f"  Failed: {e}"))
                raise

        # Copy static files
        static_dst = out_dir / "static"
        if static_dst.exists():
            shutil.rmtree(static_dst)
        shutil.copytree(static_src, static_dst)

        # Optional: rewrite custom order form endpoint for static (e.g. Formspree)
        form_url = os.environ.get("STATIC_EXPORT_FORM_URL")
        custom_js = static_dst / "js" / "custom-order.js"
        if form_url and custom_js.exists():
            text = custom_js.read_text(encoding="utf-8")
            text = text.replace("'/api/custom-order'", repr(form_url))
            custom_js.write_text(text, encoding="utf-8")
            self.stdout.write(self.style.SUCCESS(f"Custom order form URL set to {form_url}"))
        elif not form_url:
            self.stdout.write(
                self.style.WARNING(
                    "STATIC_EXPORT_FORM_URL not set — custom order form on GitHub Pages will not send emails. "
                    "See .env.example for Formspree setup."
                )
            )

        self.stdout.write(self.style.SUCCESS(f"Static export written to {out_dir}"))
        self.stdout.write(
            "To publish on GitHub Pages: push this repo, then Settings → Pages → "
            "Deploy from branch → main → /docs (or your --out folder)."
        )
