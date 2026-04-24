# Betra Amare Influencer Website

Multi-page static website for Betra Amare with TikTok, Instagram, and contact pages.

## Run locally

```bash
python -m http.server 8000
```

Open:
- http://127.0.0.1:8000/index.html
- http://127.0.0.1:8000/tiktok.html
- http://127.0.0.1:8000/instagram.html
- http://127.0.0.1:8000/contact.html

## Social links used on site
- TikTok: `https://www.tiktok.com/@betraamarey`
- Linktree: `https://linktr.ee/betraamareBetraamarey`

If your public URLs differ, update the anchor tags in `index.html` and `contact.html`.

- Instagram: `https://www.instagram.com/betra_amare`

## Photo troubleshooting
If photos are not visible, put them in `assets/photos/` and name them `betra-01` ... `betra-12`.
The site now auto-detects `.jpg/.jpeg/.png/.webp` and even legacy `ava-*` names.
